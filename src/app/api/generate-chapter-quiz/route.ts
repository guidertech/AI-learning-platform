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
      console.warn("[Chapter Quiz API] No GEMINI_API_KEY found. Returning mock fallback.");
      return NextResponse.json({
        fallback: true,
        message: "API key not configured. Please use mock data fallback."
      });
    }

    const prompt = `You are a helpful AI curriculum editor. Create exactly 10 multiple-choice questions (MCQs) in simple english for a comprehensive Chapter End Test for the chapter "${chapter.name}".
The topics covered in this chapter are: ${topics.join(", ")}.

Guidelines:
1. Generate exactly 10 questions.
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

    let apiResponse: Response | null = null;
    let lastError = "";
    for (const key of apiKeys) {
      console.log(`[Chapter Quiz API] Trying API key ending ...${key!.slice(-6)}`);
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
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

      lastError = `Gemini API returned status ${resp.status}`;
      console.warn(`[Chapter Quiz API] Key ...${key!.slice(-6)} failed: ${lastError}`);

      if (resp.status !== 429) {
        break;
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
