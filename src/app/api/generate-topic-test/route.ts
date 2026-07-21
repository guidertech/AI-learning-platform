import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { topicTitle, chapterTitle } = await req.json();

    if (!topicTitle) {
      return NextResponse.json({ error: 'topicTitle is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    const prompt = `You are an expert AI tutor. Generate exactly 3 Multiple Choice Questions (MCQs) for a student who just finished reading the topic "${topicTitle}" in the chapter "${chapterTitle || 'General'}".
    
The questions must be written in simple Devanagari Hindi (or the language appropriate for Indian students studying this subject).
Ensure the questions test their conceptual understanding of this specific topic.

You must return a JSON array of exactly 3 objects. Do NOT wrap it in an object, return the raw array.
Each object must have the following exact keys:
- "id": string (unique identifier like "q1", "q2", "q3")
- "question": string (The question text)
- "options": array of 4 strings (The multiple choice options)
- "correctAnswer": string (The exact text of the correct option)
- "explanation": string (A brief 1-2 sentence explanation of why the answer is correct)

Example output format:
[
  {
    "id": "q1",
    "question": "सौर मंडल का सबसे बड़ा ग्रह कौन सा है?",
    "options": ["पृथ्वी", "मंगल", "बृहस्पति", "शनि"],
    "correctAnswer": "बृहस्पति",
    "explanation": "बृहस्पति हमारे सौर मंडल का सबसे बड़ा ग्रह है।"
  }
]`;

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      }
    );

    if (!resp.ok) {
      throw new Error(`Gemini API error: ${resp.status}`);
    }

    const apiData = await resp.json();
    const rawText = apiData.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!rawText) {
      throw new Error("Invalid output format from AI model");
    }

    const questions = JSON.parse(rawText);
    
    if (!Array.isArray(questions) || questions.length !== 3) {
      throw new Error("Invalid output format from AI model (not an array of 3)");
    }

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error('[Generate Topic Test] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate test' }, { status: 500 });
  }
}
