import { NextResponse } from "next/server";

// Fallback rule-based Socratic responses if no API key is specified
const getLocalSocraticReply = (message: string): string => {
  const msg = message.toLowerCase();
  
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
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
    return "Hi there! 👋 I'm Maya, your Socratic AI Tutor. We are learning about fractions today. What concepts are you working on right now?";
  }
  
  return "That's an interesting question! Let's think: what is the denominator (the bottom part) of the fraction you are working with? How does it relate to the whole?";
};

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "placeholder" || apiKey === "") {
      // Fallback response
      const fallbackText = getLocalSocraticReply(message);
      return NextResponse.json({ text: fallbackText });
    }

    const systemPrompt = `You are Maya, an encouraging, friendly 3D Socratic AI Tutor on the ClassOrbit platform.
You are helping Grade 5 students learn Mathematics, specifically Chapter 4: Fractions.
CRITICAL GUIDELINE: Never give the direct answer to math problems. Instead, guide the student step-by-step by asking scaffolding questions and giving encouraging feedback. Keep your answers brief, friendly, and easy to understand for a 10-year old.

Conversation history:
${history.map((h: any) => `${h.sender === "USER" ? "Student" : "Maya"}: ${h.text}`).join("\n")}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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

    if (!response.ok) {
      console.warn("Gemini API returned an error, falling back to Socratic engine:", response.statusText);
      return NextResponse.json({ text: getLocalSocraticReply(message) });
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || getLocalSocraticReply(message);
    
    return NextResponse.json({ text: replyText });
  } catch (error) {
    console.error("Error in AI Chat Route:", error);
    return NextResponse.json({ text: "I had a tiny hiccup. Let's think: what denominator are we looking at right now?" });
  }
}
