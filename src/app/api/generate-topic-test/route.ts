import { NextResponse } from 'next/server';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getFallbackQuestions(topicTitle: string, chapterTitle?: string, count: number = 5) {
  const norm = topicTitle.toLowerCase();
  
  let rawList = [];
  if (norm.includes("fraction") || norm.includes("mixed number")) {
    rawList = [
      {
        id: "q1",
        question: "What is 1/2 + 1/4 ?",
        options: ["2/6", "3/4", "2/4", "1/6"],
        correctAnswer: "3/4",
        explanation: "Convert 1/2 to 2/4. Then 2/4 + 1/4 = 3/4.",
        advice: "Read carefully and try bringing both fractions to a common denominator (4) first."
      },
      {
        id: "q2",
        question: "Convert 2 1/3 to an improper fraction.",
        options: ["5/3", "7/3", "6/3", "8/3"],
        correctAnswer: "7/3",
        explanation: "Multiply whole number 2 by denominator 3 (=6) and add numerator 1 (=7). Result is 7/3.",
        advice: "Multiply the whole number by the bottom number, then add the top number!"
      },
      {
        id: "q3",
        question: "Which fraction is equivalent to 2/4 ?",
        options: ["1/2", "3/4", "2/3", "1/4"],
        correctAnswer: "1/2",
        explanation: "Divide both numerator and denominator of 2/4 by 2 to get 1/2.",
        advice: "Simplify the fraction by finding the common factor of numerator and denominator."
      },
      {
        id: "q4",
        question: "What is 3/5 - 1/5 ?",
        options: ["2/5", "2/0", "4/5", "1/5"],
        correctAnswer: "2/5",
        explanation: "With the same denominator, subtract the numerators: 3 - 1 = 2. So result is 2/5.",
        advice: "Keep the denominator unchanged when subtracting like fractions."
      },
      {
        id: "q5",
        question: "What is 5/5 equal to?",
        options: ["0", "1", "5", "10"],
        correctAnswer: "1",
        explanation: "Any non-zero number divided by itself equals 1.",
        advice: "Remember that when top and bottom numbers are equal, the fraction equals 1 whole."
      }
    ];
  } else {
    rawList = [
      {
        id: "q1",
        question: `What is the core definition of "${topicTitle}"?`,
        options: [
          `Fundamental principle of ${topicTitle}`,
          `Unrelated property`,
          `Opposite concept`,
          `None of the above`
        ],
        correctAnswer: `Fundamental principle of ${topicTitle}`,
        explanation: `This tests basic understanding of ${topicTitle}.`,
        advice: `Focus on the main rule or definition of ${topicTitle}.`
      },
      {
        id: "q2",
        question: `Which statement is correct about "${topicTitle}" in ${chapterTitle || "this topic"}?`,
        options: [
          `It plays an essential role in ${chapterTitle || topicTitle}`,
          `It is completely irrelevant`,
          `It only applies in theory`,
          `It cannot be verified`
        ],
        correctAnswer: `It plays an essential role in ${chapterTitle || topicTitle}`,
        explanation: `Mastering ${topicTitle} is key to understanding ${chapterTitle || topicTitle}.`,
        advice: `Recall how ${topicTitle} connects to ${chapterTitle || 'the chapter'}.`
      },
      {
        id: "q3",
        question: `How do we practically apply "${topicTitle}"?`,
        options: [
          `By systematically solving related problems`,
          `By ignoring its core principles`,
          `It cannot be applied practically`,
          `Only by memorization`
        ],
        correctAnswer: `By systematically solving related problems`,
        explanation: `Practical application strengthens conceptual understanding.`,
        advice: `Think about real-world or step-by-step problem-solving.`
      },
      {
        id: "q4",
        question: `Which of the following is a common mistake when dealing with "${topicTitle}"?`,
        options: [
          `Skipping core steps or formulas`,
          `Verifying steps carefully`,
          `Applying correct principles`,
          `Checking calculations`
        ],
        correctAnswer: `Skipping core steps or formulas`,
        explanation: `Skipping foundational steps leads to calculation errors.`,
        advice: `Watch out for common pitfalls and double-check your steps.`
      },
      {
        id: "q5",
        question: `Why is learning "${topicTitle}" important?`,
        options: [
          `It forms a foundation for advanced topics`,
          `It has no future applications`,
          `It is only for trivia`,
          `It replaces all previous knowledge`
        ],
        correctAnswer: `It forms a foundation for advanced topics`,
        explanation: `${topicTitle} is a crucial stepping stone in the curriculum.`,
        advice: `Remember how this concept helps build higher-level skills.`
      }
    ];
  }

  return rawList.slice(0, count).map((q) => ({
    ...q,
    options: shuffleArray(q.options)
  }));
}

export async function POST(req: Request) {
  try {
    const { topicTitle, chapterTitle, count = 5, difficulty = "medium" } = await req.json();

    if (!topicTitle) {
      return NextResponse.json({ error: 'topicTitle is required' }, { status: 400 });
    }

    const questionCount = typeof count === "number" && count > 0 ? count : 5;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('[Generate Topic Test] No GEMINI_API_KEY set, using fallback MCQs');
      return NextResponse.json({ questions: getFallbackQuestions(topicTitle, chapterTitle, questionCount) });
    }

    const prompt = `You are Maya, an expert AI tutor. Generate exactly ${questionCount} Multiple Choice Questions (MCQs) of "${difficulty}" difficulty for a practice quiz on the topic "${topicTitle}" in the chapter "${chapterTitle || 'General'}".

Ensure the questions test conceptual understanding, problem-solving, and applications of "${topicTitle}".

CRITICAL INSTRUCTION: Randomize the placement of the correct answer across option positions A, B, C, and D for every question. Do NOT place the correct answer at the same option position for consecutive questions.

You MUST return a raw JSON array of exactly ${questionCount} objects. Do NOT wrap it in Markdown backticks or any outer object.
Each object must have the following exact keys:
- "id": string (unique identifier like "q1", "q2", "q3", etc.)
- "question": string (The question text)
- "options": array of 4 strings (The multiple choice options)
- "correctAnswer": string (The exact text of the correct option matching one of the options)
- "explanation": string (A clear 1-2 sentence explanation of why the answer is correct)
- "advice": string (A helpful 1-2 sentence tip or advice from Maya to help the student solve this question)

Example format:
[
  {
    "id": "q1",
    "question": "What is 1/2 + 1/4?",
    "options": ["2/6", "3/4", "2/4", "1/6"],
    "correctAnswer": "3/4",
    "explanation": "Convert 1/2 to 2/4, then add 1/4 to get 3/4.",
    "advice": "Try finding a common denominator first before adding the numerators."
  }
]`;

    const candidateModels = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash"
    ];

    let rawText: string | null = null;
    let lastError: string | null = null;

    for (const model of candidateModels) {
      try {
        const resp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: "application/json" }
            })
          }
        );

        if (resp.ok) {
          const apiData = await resp.json();
          rawText = apiData.candidates?.[0]?.content?.parts?.[0]?.text || null;
          if (rawText) break;
        } else {
          lastError = `Model ${model} returned HTTP ${resp.status}`;
          console.warn(`[Generate Topic Test] ${lastError}`);
        }
      } catch (err: any) {
        lastError = err.message;
        console.warn(`[Generate Topic Test] Fetch error for model ${model}:`, err);
      }
    }

    if (!rawText) {
      console.warn('[Generate Topic Test] Gemini API failed or rate-limited, serving fallback questions:', lastError);
      return NextResponse.json({ questions: getFallbackQuestions(topicTitle, chapterTitle, questionCount) });
    }

    let parsedQuestions: any[] = [];
    try {
      // Clean rawText in case markdown formatting was returned
      const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      parsedQuestions = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.warn('[Generate Topic Test] JSON parse failed, serving fallback questions');
      return NextResponse.json({ questions: getFallbackQuestions(topicTitle, chapterTitle, questionCount) });
    }
    
    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      throw new Error("Invalid output format from AI model");
    }

    // Format questions and shuffle options so position A, B, C, D is randomized
    const questions = parsedQuestions.map((q, idx) => {
      const rawOptions = Array.isArray(q.options) ? q.options : ["Option A", "Option B", "Option C", "Option D"];
      const cAns = q.correctAnswer || rawOptions[0];

      // Make sure correct answer is in options array
      if (!rawOptions.includes(cAns)) {
        rawOptions[0] = cAns;
      }

      // Shuffle options randomly
      const shuffledOptions = shuffleArray(rawOptions);

      return {
        id: q.id || `q${idx + 1}`,
        question: q.question || q.questionText || `Question ${idx + 1}`,
        options: shuffledOptions,
        correctAnswer: cAns,
        explanation: q.explanation || "Correct answer based on topic rules.",
        advice: q.advice || "Read the question carefully and eliminate incorrect options."
      };
    });

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error('[Generate Topic Test] Error:', error);
    return NextResponse.json({ questions: getFallbackQuestions('Topic', 'General', 5) });
  }
}


