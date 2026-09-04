import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chapterId = searchParams.get("chapterId");
    const weakTopicsParam = searchParams.get("weakTopics");

    if (!chapterId) {
      return NextResponse.json({ error: "Missing chapterId parameter" }, { status: 400 });
    }

    const supabase = createClient();

    // 1. Fetch chapter from database
    const { data: chapter, error: chapterError } = await supabase
      .from("chapters")
      .select("chapter_id, name, requires_prerequisite")
      .eq("id", chapterId)
      .maybeSingle();

    if (chapterError) {
      console.error("[Prereq Quiz API] Error fetching chapter:", chapterError);
      return NextResponse.json({ error: chapterError.message }, { status: 500 });
    }

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    // If the chapter does not require a prerequisite, let the frontend know
    if (!chapter.requires_prerequisite) {
      return NextResponse.json({ requiresPrerequisite: false, questions: [] });
    }

    // 2. Fetch prerequisite topics for this chapter
    const { data: prereqData, error: prereqError } = await supabase
      .from("chapter_prerequisite")
      .select("topics_name")
      .eq("chapter_id", chapter.chapter_id)
      .maybeSingle();

    if (prereqError) {
      console.error("[Prereq Quiz API] Error fetching prerequisite topics:", prereqError);
      // We will continue to fallback instead of crashing
    }

    let topics: string[] = [];
    if (weakTopicsParam) {
      topics = weakTopicsParam.split(",").map((t) => t.trim()).filter(Boolean);
    } else if (prereqData && Array.isArray(prereqData.topics_name) && prereqData.topics_name.length > 0) {
      topics = prereqData.topics_name;
    } else {
      // Fallback topics based on chapter name if no database record exists
      const name = chapter.name.toLowerCase();
      if (name.includes("fraction") || name.includes("mixed") || name.includes("भिन्न")) {
        topics = ["Fractions Basics", "Numerator and Denominator", "Equivalent Fractions", "Basic Addition"];
      } else if (name.includes("multiply") || name.includes("divide") || name.includes("guna") || name.includes("bhaag") || name.includes("गुणन") || name.includes("भाग")) {
        topics = ["Multiplication Tables", "Division Basics", "Remainders", "Addition and Subtraction"];
      } else if (name.includes("decimal") || name.includes("dashmalav") || name.includes("दशमलव")) {
        topics = ["Comparing Numbers", "Place Values", "Basic Division", "Fractions"];
      } else if (name.includes("add") || name.includes("subtract") || name.includes("जोड़") || name.includes("घटाव")) {
        topics = ["Place Values", "Comparing Numbers", "Basic Counting"];
      } else {
        topics = [`${chapter.name} Basics`, "Foundational Concepts"];
      }
    }

    console.log(`[Prereq Quiz API] Generating questions for chapter: "${chapter.name}" (ID: ${chapter.chapter_id}) with topics:`, topics);

    // 3. Generate questions using Gemini API
    const apiKeys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_2,
    ].filter((k) => k && k !== "placeholder" && k !== "");

    // If no explicit keys configured, we still attempt default gemini-3.6-flash models
    if (apiKeys.length === 0) {
      apiKeys.push("placeholder-key-attempt");
    }

    const gradeParam = searchParams.get("grade") || "5";
    const timestampSeed = Date.now();
    const prompt = `You are an expert school curriculum AI editor. Create exactly 5 BRAND NEW multiple-choice questions (MCQs) in English strictly tailored for Grade ${gradeParam} student level to test prerequisite knowledge for the chapter "${chapter.name}".
The prerequisite topics to test are: ${topics.join(", ")}.

CRITICAL GRADE LEVEL & DIFFICULTY RULES:
1. All questions must strictly match Grade ${gradeParam} curriculum standards, difficulty, concepts, and vocabulary.
2. Generate 5 FRESH and UNIQUE questions. Do NOT use overly simplistic Grade 1-2 questions unless the student is Grade 1-2 (Seed/Session ID: ${timestampSeed}).
3. Distribute the questions reasonably across these topics: ${topics.join(", ")}.
4. For each question, provide exactly 4 options.
5. Set correctIndex as the 0-based index of the correct option (0, 1, 2, or 3).
6. Provide a clear 1-2 sentence explanation suitable for a Grade ${gradeParam} student.
7. Format the response strictly as a JSON array of objects conforming to this schema:
[
  {
    "id": "q-1",
    "topic": "Specific Topic Name",
    "question": "Question text in english",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Explanation in english..."
  }
]`;

    let rawText = "";

    // Try Groq API first if key is available
    if (process.env.GROQ_API_KEY) {
      try {
        console.log("[Prereq Quiz API] Generating via Groq API...");
        const Groq = (await import("groq-sdk")).default;
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const groqModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

        const completion = await groq.chat.completions.create({
          model: groqModel,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
          temperature: 0.9,
          max_completion_tokens: 2048,
        });

        rawText = completion.choices[0]?.message?.content || "";
        console.log("[Prereq Quiz API] Successfully generated quiz via Groq API");
      } catch (groqErr: any) {
        console.warn("[Prereq Quiz API] Groq API failed, falling back to Gemini:", groqErr?.message || groqErr);
      }
    }

    // Fallback to Gemini if Groq did not return output
    if (!rawText) {
      const candidateModels = Array.from(new Set([
        process.env.GEMINI_MODEL || "gemini-3.6-flash",
        "gemini-3.6-flash",
        "gemini-3.7-flash"
      ]));

      let apiResponse: Response | null = null;
      let lastError = "";

      outerLoop:
      for (const key of apiKeys) {
        console.log(`[Prereq Quiz API] Trying API key ending ...${key!.slice(-6)}`);
        for (const model of candidateModels) {
          try {
            const resp = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                signal: AbortSignal.timeout(15000),
                body: JSON.stringify({
                  contents: [
                    {
                      role: "user",
                      parts: [{ text: prompt }]
                    }
                  ],
                  generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.9
                  }
                })
              }
            );

            if (resp.ok) {
              apiResponse = resp;
              break outerLoop;
            }

            const errText = await resp.text();
            lastError = `Gemini API model ${model} returned status ${resp.status}: ${errText}`;
            console.warn(`[Prereq Quiz API] Key ...${key!.slice(-6)} model ${model} failed: ${lastError}`);
          } catch (err: any) {
            lastError = err?.message || String(err);
            console.error(`[Prereq Quiz API] Fetch exception for model ${model}:`, err);
          }
        }
      }

      if (!apiResponse) {
        throw new Error(lastError || "All AI API attempts failed");
      }

      const apiData = await apiResponse.json();
      rawText = apiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    if (!rawText) {
      throw new Error("No response text returned from AI API");
    }

    const parsedQuestions = JSON.parse(rawText.trim());

    // Map questions to ensure they have correct structure and valid IDs
    const questions = parsedQuestions.map((q: any, index: number) => ({
      id: q.id || `prereq-${chapter.chapter_id}-${index + 1}`,
      topic: q.topic || topics[index % topics.length],
      question: q.question,
      options: q.options || [],
      correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : 0,
      explanation: q.explanation || ""
    }));

    return NextResponse.json({
      requiresPrerequisite: true,
      questions
    });

  } catch (err: any) {
    console.error("[Prereq Quiz API] Error generating quiz:", err);
    return NextResponse.json({
      requiresPrerequisite: true,
      fallback: true,
      message: "Failed to generate prerequisite quiz: " + err.message
    });
  }
}
