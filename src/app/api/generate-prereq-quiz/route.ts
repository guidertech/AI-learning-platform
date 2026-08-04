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

    if (apiKeys.length === 0) {
      console.warn("[Prereq Quiz API] No GEMINI_API_KEY found. Returning mock fallback.");
      return NextResponse.json({
        requiresPrerequisite: true,
        fallback: true,
        message: "API key not configured. Please use mock data fallback."
      });
    }

    const prompt = `You are a helpful AI curriculum editor. Create exactly 5 multiple-choice questions (MCQs) in English to test a student's prerequisite knowledge for the chapter "${chapter.name}".
The prerequisite topics to test are: ${topics.join(", ")}.

Guidelines:
1. Generate exactly 5 questions.
2. Distribute the questions reasonably across these topics: ${topics.join(", ")}.
3. For each question, provide exactly 4 options.
4. Set correctIndex as the 0-based index of the correct option (0, 1, 2, or 3).
5. Provide a simple, clear, and brief explanation of the answer in Hindi.
6. The question, options, and explanation must be in clean, friendly Devanagari Hindi suitable for a Grade 5 student (or similar).
7. Format the response strictly as a JSON array of objects conforming to this schema:
[
  {
    "id": "q-1",
    "topic": "Specific Topic Name",
    "question": "Question text in Devanagari Hindi",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Explanation in Hindi..."
  }
]`;

    const candidateModels = [
      "gemini-2.0-flash",
      "gemini-1.5-flash"
    ];

    // Try each API key and model — if one is rate-limited (429) or fails, try the next config
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
      throw new Error(lastError || "All Gemini API keys failed");
    }

    const apiData = await apiResponse.json();
    const rawText = apiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("No response text returned from Gemini API");
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
