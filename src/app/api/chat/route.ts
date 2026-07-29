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
      return "A mixed number combines a whole number and a fraction (like $1\\frac{1}{2}$). To convert it to an improper fraction, how many parts do you think are in the whole number? Try multiplying the whole number by the denominator!";
    }
    if (msg.includes("denominator")) {
      return "The denominator is the number on the bottom of a fraction. It tells us the total number of equal parts that make up a whole. For example, if a pizza is cut into 8 slices, what is the denominator?";
    }
    if (msg.includes("numerator")) {
      return "The numerator is the number on top of a fraction. It tells us how many parts of the whole we actually have. If you eat 3 slices of an 8-slice pizza, what is the numerator?";
    }
    if (msg.includes("equivalent")) {
      return "Equivalent fractions represent the exact same value or size, even if they look different (like $1/2$ and $2/4$). If we multiply both top and bottom of $3/4$ by 2, what fraction do we get?";
    }
    if (msg.includes("recap") || msg.includes("explain")) {
      return "Let's review! A fraction has two parts: the numerator (how many parts we have) and the denominator (how many total parts in a whole). Can you tell me what the numerator is in $5/6$?";
    }
    return "Hi there! 👋 We are working on Fractions today. What concepts are you trying to solve right now?";
  }

  if (topic.includes("decimal") || topic.includes("compare")) {
    return "Decimals represent fractions of ten. When comparing decimals, align the decimal points and check the tenths place first. What digit is in the tenths place of 0.45?";
  }

  if (topic.includes("photosynthesis") || topic.includes("equation")) {
    return "Photosynthesis is how plants create energy from sunlight, water, and carbon dioxide. What gas do plants release during this process that we need to breathe?";
  }

  if (subject.includes("history") || subject.includes("social") || topic.includes("rowlatt") || topic.includes("bagh") || topic.includes("dyer")) {
    return "That's a vital part of history. The events around 1919 in India showed a major shift in the freedom struggle. What do you think led to the protests against the Rowlatt Act?";
  }
  
  return `That's an interesting question! Let's think: what is the key concept of "${topicName || "Fractions"}" that you are working with? How does it relate to ${subjectName || "Mathematics"}?`;
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

    const candidateModels = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
    let replyText: string | null = null;
    let lastErrorStatus = "";

    for (const model of candidateModels) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
