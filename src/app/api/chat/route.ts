import { NextResponse } from "next/server";
import { buildTutorSystemPrompt } from "@/features/maya";

type ConversationMessage = {sender: "USER" | "AI"; text: string};
type ChatRequest = {
  message?: unknown;
  preferredLanguage?: unknown;
  grade?: unknown;
  subject?: unknown;
  chapter?: unknown;
  topic?: unknown;
  conversationHistory?: unknown;
  history?: unknown;
};

// Fallback rule-based Socratic responses if no API key is specified
// Fallback rule-based Socratic responses if no API key is specified
const getLocalSocraticReply = (message: string, topicName?: string, subjectName?: string): string => {
  const msg = message.toLowerCase();
  const topic = (topicName || "Fractions").toLowerCase();
  const subject = (subjectName || "Mathematics").toLowerCase();
  
  if (topic.includes("fraction") || topic.includes("mixed")) {
    if (msg.includes("mixed number") || msg.includes("mixed fraction")) {
      return "A mixed number combines a whole number and a fraction (like **1 1/2**). To convert it to an improper fraction, multiply the whole number by the denominator and add the numerator!";
    }
    if (msg.includes("denominator")) {
      return "The **denominator** is the bottom number of a fraction. It tells us the total number of equal parts in a whole. For example, if a pizza is cut into 8 slices, 8 is the denominator.";
    }
    if (msg.includes("numerator")) {
      return "The **numerator** is the top number of a fraction. It tells us how many parts we have. If you eat 3 slices out of 8, 3 is the numerator.";
    }
    if (msg.includes("equivalent")) {
      return "Equivalent fractions represent the exact same value (like **1/2** and **2/4**). If we multiply both top and bottom of **3/4** by 2, we get **6/8**!";
    }
    if (msg.includes("recap") || msg.includes("explain")) {
      return "Let's review! A fraction has two parts:\n- **Numerator**: top number (parts we have)\n- **Denominator**: bottom number (total parts)\n\nIn **5/6**, **5** is the numerator!";
    }
    return "Hi there! 👋 We are studying **Fractions** today. What concept would you like to explore?";
  }

  if (topic.includes("decimal") || topic.includes("compare")) {
    return "Decimals represent parts of ten. When comparing decimals, align the decimal points and check the tenths place first. In **0.45**, 4 is in the tenths place!";
  }

  if (topic.includes("photosynthesis") || topic.includes("equation")) {
    return "Photosynthesis is how plants make food using sunlight:\n**6 CO₂ + 6 H₂O + Light Energy ➔ C₆H₁₂O₆ + 6 O₂**";
  }

  if (subject.includes("history") || subject.includes("social") || topic.includes("rowlatt") || topic.includes("bagh") || topic.includes("dyer")) {
    return "That's a key part of history! Protests against the Rowlatt Act in 1919 marked a major turning point in India's struggle for independence.";
  }
  
  return `That's a great question! Let's explore **${topicName || "Fractions"}** together. What part would you like to understand first?`;
};

export async function POST(req: Request) {
  try {
    const body = await req.json() as ChatRequest;
    const {
      message,
      preferredLanguage,
      grade,
      subject,
      chapter,
      topic,
      conversationHistory,
      history
    } = body;

    if (typeof message !== "string" || !message.trim() || message.length > 10_000) {
      return NextResponse.json({error: "invalid_message"}, {status: 400});
    }

    const cleanString = (value: unknown) => typeof value === "string" ? value.slice(0, 500) : undefined;
    const responseLanguage = preferredLanguage === "hi" ? "hi" : "en";
    const rawHistory = conversationHistory ?? history;
    const activeHistory: ConversationMessage[] = Array.isArray(rawHistory)
      ? rawHistory.filter((item: unknown): item is ConversationMessage => {
          if (!item || typeof item !== "object") return false;
          const candidate = item as Partial<ConversationMessage>;
          return (candidate.sender === "USER" || candidate.sender === "AI") && typeof candidate.text === "string";
        }).slice(-12)
      : [];

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "placeholder" || apiKey === "") {
      // Fallback Socratic reply
      const fallbackText = getLocalSocraticReply(message, cleanString(topic), cleanString(subject));
      return NextResponse.json({ text: fallbackText });
    }

    const systemPrompt = `${buildTutorSystemPrompt({
      preferredLanguage: responseLanguage,
      grade: cleanString(grade) || "5",
      subject: cleanString(subject),
      topic: cleanString(topic)
    })}

${chapter ? `Active Chapter Context: ${cleanString(chapter)}` : ""}

Conversation history:
${activeHistory.map((h) => `${h.sender === "USER" ? "Student" : "Maya"}: ${h.text.slice(0, 2_000)}`).join("\n")}
`;

    let replyText: string | null = null;
    let lastErrorStatus = "";

    // Try Groq API first if key is available
    if (process.env.GROQ_API_KEY) {
      try {
        console.log("[AI Chat] Generating reply via Groq API...");
        const Groq = (await import("groq-sdk")).default;
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const groqModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

        const completion = await groq.chat.completions.create({
          model: groqModel,
          messages: [
            { role: "system", content: systemPrompt },
            ...activeHistory.map((h) => ({
              role: h.sender === "USER" ? ("user" as const) : ("assistant" as const),
              content: h.text
            })),
            { role: "user", content: message }
          ],
          temperature: 0.7,
          max_completion_tokens: 1024,
        });

        replyText = completion.choices[0]?.message?.content || null;
        if (replyText) console.log("[AI Chat] Successfully generated reply via Groq API");
      } catch (groqErr: any) {
        console.warn("[AI Chat] Groq API failed, falling back to Gemini:", groqErr?.message || groqErr);
      }
    }

    // Fallback to Gemini if Groq did not return output
    if (!replyText) {
      const candidateModels = [process.env.GEMINI_MODEL || "gemini-3.6-flash", "gemini-3.6-flash", "gemini-3.7-flash"];
      for (const model of candidateModels) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              signal: AbortSignal.timeout(10000),
              body: JSON.stringify({
                contents: [
                  {
                    role: "user",
                    parts: [{ text: systemPrompt + "\nStudent: " + message }]
                  }
                ]
              })
            }
          );

          if (response.ok) {
            const data = await response.json();
            const textCandidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textCandidate) {
              replyText = textCandidate;
              break;
            }
          } else {
            lastErrorStatus = `${response.status} ${response.statusText}`;
            console.warn(`[AI Chat] Model ${model} returned error:`, lastErrorStatus);
          }
        } catch (err: any) {
          console.warn(`[AI Chat] Error calling model ${model}:`, err?.message);
        }
      }
    }

    if (!replyText) {
      console.warn("Gemini API returned errors for all models, falling back to Socratic engine:", lastErrorStatus);
      replyText = getLocalSocraticReply(message, cleanString(topic), cleanString(subject));
    }

    return NextResponse.json({ text: replyText });
  } catch (error) {
    console.error("Error in AI Chat Route:", error);
    return NextResponse.json({ text: "I had a tiny hiccup. What specific part of this topic are you looking at right now?" });
  }
}
