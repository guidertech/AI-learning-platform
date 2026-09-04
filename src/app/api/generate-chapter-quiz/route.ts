import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chapterId = searchParams.get("chapterId");

    if (!chapterId) {
      return NextResponse.json({ error: "Missing chapterId parameter" }, { status: 400 });
    }

    const supabase = createClient();

    // 1. Fetch chapter from database
    const { data: chapter, error: chapterError } = await supabase
      .from("chapters")
      .select("chapter_id, name")
      .eq("id", chapterId)
      .maybeSingle();

    if (chapterError) {
      console.error("[Chapter Quiz API] Error fetching chapter:", chapterError);
      return NextResponse.json({ error: chapterError.message }, { status: 500 });
    }

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    // 2. Fetch topics for this chapter
    const { data: dbTopics, error: topicsError } = await supabase
      .from("topics")
      .select("topic_name, topic_id")
      .eq("chapter_id", chapter.chapter_id);

    if (topicsError) {
      console.error("[Chapter Quiz API] Error fetching topics:", topicsError);
    }

    let topics: string[] = [];
    if (dbTopics && dbTopics.length > 0) {
      topics = dbTopics.map((t: any) => t.topic_name).filter(Boolean);
    } else {
      // Fallback topics based on chapter name
      const name = chapter.name.toLowerCase();
      if (name.includes("fraction") || name.includes("mixed") || name.includes("भिन्न")) {
        topics = ["Fractions Basics", "Numerator and Denominator", "Equivalent Fractions", "Mixed Numbers"];
      } else if (name.includes("multiply") || name.includes("divide") || name.includes("guna") || name.includes("bhaag")) {
        topics = ["Multiplication Tables", "Division Basics", "Remainders", "Word Problems"];
      } else {
        topics = [`${chapter.name} Basics`, "Concept Comprehension"];
      }
    }

    console.log(`[Chapter Quiz API] Generating 10 questions for chapter: "${chapter.name}" with topics:`, topics);

    // 3. Generate questions using Gemini API
    const apiKeys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_2,
    ].filter((k) => k && k !== "placeholder" && k !== "");

    if (apiKeys.length === 0) {
      apiKeys.push("placeholder-key-attempt");
    }

    const gradeParam = searchParams.get("grade") || "5";
    const prompt = `You are an expert school curriculum AI editor. Create exactly 10 multiple-choice questions (MCQs) in simple, clean English for a comprehensive Chapter End Test for the chapter "${chapter.name}".
The topics covered in this chapter are: ${topics.join(", ")}.

CRITICAL GRADE LEVEL & DIFFICULTY RULES:
1. Generate exactly 10 questions strictly matching Grade ${gradeParam} curriculum standards, difficulty, concepts, and age level.
2. Distribute the questions reasonably across these topics: ${topics.join(", ")}.
3. For each question, provide exactly 4 options.
4. Set correctIndex as the 0-based index of the correct option (0, 1, 2, or 3).
5. Provide a simple, clear, and brief explanation of the answer in clean English.
6. Format the response strictly as a JSON array of objects conforming to this schema:
[
  {
    "id": "q-1",
    "topic": "Specific Topic Name",
    "question": "Question text in English",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Explanation in English..."
  }
]`;

    let rawText = "";

    // Try Groq API first if key is available
    if (process.env.GROQ_API_KEY) {
      try {
        console.log("[Chapter Quiz API] Generating via Groq API...");
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
          temperature: 0.5,
          max_completion_tokens: 2048,
        });

        rawText = completion.choices[0]?.message?.content || "";
        console.log("[Chapter Quiz API] Successfully generated quiz via Groq API");
      } catch (groqErr: any) {
        console.warn("[Chapter Quiz API] Groq API failed, falling back to Gemini:", groqErr?.message || groqErr);
      }
    }

    // Fallback to Gemini if Groq did not return output
    if (!rawText) {
      let apiResponse: Response | null = null;
      let lastError = "";
      for (const key of apiKeys) {
        console.log(`[Chapter Quiz API] Trying API key ending ...${key!.slice(-6)}`);
        const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
        const resp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: prompt }]
                }
              ],
              generationConfig: {
                responseMimeType: "application/json"
              }
            })
          }
        );

        if (resp.ok) {
          apiResponse = resp;
          break;
        }

        const errorText = await resp.text();
        lastError = `Gemini API model ${model} returned status ${resp.status}: ${errorText}`;
        console.warn(`[Chapter Quiz API] Key ...${key!.slice(-6)} failed: ${lastError}`);
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

    // Map questions to ensure correct structure
    const questions = parsedQuestions.map((q: any, index: number) => ({
      id: q.id || `chapter-end-${chapter.chapter_id}-${index + 1}`,
      topic: q.topic || topics[index % topics.length],
      question: q.question,
      options: q.options || [],
      correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : 0,
      explanation: q.explanation || ""
    }));

    return NextResponse.json({
      fallback: false,
      questions
    });

  } catch (err: any) {
    console.error("[Chapter Quiz API] Error generating quiz:", err);
    return NextResponse.json({
      fallback: true,
      message: "Failed to generate chapter end quiz: " + err.message
    });
  }
}
