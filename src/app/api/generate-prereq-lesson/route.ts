import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topic = searchParams.get("topic");
    const chapterId = searchParams.get("chapterId");

    if (!topic || !chapterId) {
      return NextResponse.json({ error: "Missing topic or chapterId" }, { status: 400 });
    }

    const supabase = createClient();

    // 1. Fetch chapter details
    const { data: chapter, error: chapterError } = await supabase
      .from("chapters")
      .select("name, chapter_id")
      .eq("id", chapterId)
      .maybeSingle();

    if (chapterError || !chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    // 2. Setup Gemini Prompt
    const apiKeys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_2,
    ].filter((k) => k && k !== "placeholder" && k !== "");

    if (apiKeys.length === 0) {
      // Return a basic fallback structure directly
      return NextResponse.json({
        topic,
        title: `${topic} की बुनियादी बातें`,
        explanation: `यहाँ हम ${topic} के बारे में बुनियादी अवधारणाओं को आसान भाषा में समझेंगे। यह आपके मुख्य अध्याय '${chapter.name}' को समझने में मदद करेगा।`,
        example: `${topic} का हल किया हुआ उदाहरण।`,
        imageSrc: "https://images.unsplash.com/photo-1596495578065-6e076b888b83?w=800&auto=format&fit=crop&q=60"
      });
    }

    const prompt = `You are an expert friendly AI school teacher. Create a short, highly engaging, and very simple concept explanation lesson in Hindi (Devanagari script) for a Grade 5 student.
The student struggled with the prerequisite topic "${topic}" for the chapter "${chapter.name}".

Provide:
1. A catchy, simple title for the lesson in Hindi.
2. A very clear, easy-to-understand explanation of the concept in Hindi. Use simple, conversational language, analogies if helpful, and keep it friendly.
3. A step-by-step solved example in Hindi to show the concept in action.

Format the response strictly as a JSON object conforming to this schema:
{
  "topic": "${topic}",
  "title": "A short and simple Title in Hindi",
  "explanation": "Clear explanation in Devanagari Hindi (2-3 paragraphs, simple grade-5 level vocabulary)",
  "example": "A step-by-step solved example in Devanagari Hindi"
}`;

    // Try API keys sequentially
    let apiResponse: Response | null = null;
    let lastError = "";

    for (const key of apiKeys) {
      try {
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
        if (resp.status !== 429) {
          break;
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }

    if (!apiResponse) {
      throw new Error(lastError || "All API keys failed");
    }

    const apiData = await apiResponse.json();
    const rawText = apiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("No response text returned from Gemini API");
    }

    const parsed = JSON.parse(rawText.trim());

    // Add a default Unsplash image representation
    const defaultImage = "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60";

    return NextResponse.json({
      topic: parsed.topic || topic,
      title: parsed.title || `${topic} की बुनियादी बातें`,
      explanation: parsed.explanation || "",
      example: parsed.example || "",
      imageSrc: defaultImage
    });

  } catch (err: any) {
    console.error("[Generate Prereq Lesson API] Error:", err);
    return NextResponse.json({
      topic: "Error",
      title: "बुनियादी बातें",
      explanation: "अवधारणा की व्याख्या लोड करने में त्रुटि हुई। कृपया आगे बढ़ें या पुनः प्रयास करें।",
      example: "उदाहरण उपलब्ध नहीं है।",
      imageSrc: "https://images.unsplash.com/photo-1596495578065-6e076b888b83?w=800&auto=format&fit=crop&q=60"
    });
  }
}
