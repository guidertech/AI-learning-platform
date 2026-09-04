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
      apiKeys.push("placeholder-key-attempt");
    }

    const gradeParam = searchParams.get("grade") || "5";

    const prompt = `You are a friendly, highly intelligent AI study tutor for Grade ${gradeParam} school students.
Topic: "${topic}" | Chapter: "${chapter.name}" | Student Level: Grade ${gradeParam}

CRITICAL INSTRUCTIONS FOR CLEAN OUTPUT:
1. ABSOLUTELY NO LaTeX markup or LaTeX commands (DO NOT write \\boxed{}, \\longrightarrow, \\underbrace{}, \\text{}, \\frac{}{}, \\[, \\]).
2. Write chemical equations and math formulas in simple plain readable text using unicode arrows/subscripts (e.g. "6 CO₂ + 6 H₂O + Light Energy ➔ C₆H₁₂O₆ + 6 O₂").
3. Use rich Markdown formatting: **bold key terms**, section headings (##, ###), bullet points (-), numbered lists (1.), and clean tables (| Col 1 | Col 2 |).
4. Tailor the depth, tone, examples, and vocabulary strictly for a Grade ${gradeParam} student.
5. Write all explanations, headings, and examples in simple, clean, natural English.

Provide a comprehensive, engaging explanation lesson in English.

Format the response strictly as a JSON object conforming to this schema:
{
  "topic": "${topic}",
  "title": "A short, encouraging title in English with emojis (e.g., 🌟 Understanding ${topic} – Grade ${gradeParam} Guide)",
  "explanation": "Detailed explanation tailored for Grade ${gradeParam} in simple English with rich Markdown formatting matching ALL instructions above (include intro paragraph, headings like ## 1️⃣ What is ${topic}?, bullet points with bold terms, markdown tables like | Feature | Details |, etc.)",
  "example": "Optional step-by-step solved example in clean plain text and markdown formatting in simple English for Grade ${gradeParam}"
}`;

    let rawText = "";

    // Try Groq API first if key is available
    if (process.env.GROQ_API_KEY) {
      try {
        console.log("[Prereq Lesson API] Generating via Groq API...");
        const Groq = (await import("groq-sdk")).default;
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const groqModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

        const completion = await groq.chat.completions.create({
          model: groqModel,
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.5,
          max_completion_tokens: 2048,
        });

        rawText = completion.choices[0]?.message?.content || "";
        console.log("[Prereq Lesson API] Successfully generated lesson via Groq API");
      } catch (groqErr: any) {
        console.warn("[Prereq Lesson API] Groq API failed, falling back to Gemini:", groqErr?.message || groqErr);
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
                    responseMimeType: "application/json"
                  }
                })
              }
            );

            if (resp.ok) {
              apiResponse = resp;
              break outerLoop;
            }

            lastError = `Gemini API model ${model} returned status ${resp.status}`;
          } catch (err: any) {
            lastError = err.message;
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

    const parsed = JSON.parse(rawText.trim());

    return NextResponse.json({
      topic: parsed.topic || topic,
      title: parsed.title || `🌟 ${topic} – Basics`,
      explanation: parsed.explanation || "",
      example: parsed.example || "",
      imageSrc: ""
    });

  } catch (err: any) {
    console.error("[Generate Prereq Lesson API] Error:", err);
    return NextResponse.json({
      topic: "Error",
      title: "Foundational Lesson",
      explanation: "An error occurred while loading the explanation. Please proceed or try again.",
      example: "Example not available.",
      imageSrc: ""
    });
  }
}
