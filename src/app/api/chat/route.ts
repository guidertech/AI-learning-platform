import { NextResponse } from "next/server";

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
    const { message, history, subject, topic, persona } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "placeholder" || apiKey === "") {
      // Fallback response
      const fallbackText = getLocalSocraticReply(message, topic, subject);
      return NextResponse.json({ text: fallbackText });
    }

    let coreInstructions = "";
    if (persona === "Direct") {
      coreInstructions = `1. Speak strictly in clean, friendly Hindi using the Devanagari script. You can use common technical terms in English, but the overall language and script of the response must be Devanagari Hindi.
2. Explain concepts directly, give step-by-step solutions, and provide direct answers when the student asks for help.
3. Keep your replies brief, clear, and easy to read (max 2-3 sentences).`;
    } else if (persona === "Friendly") {
      coreInstructions = `1. Speak strictly in clean, friendly Hindi using the Devanagari script. You can use common technical terms in English, but the overall language and script of the response must be Devanagari Hindi.
2. Use very simple words, fun analogies (like cartoon characters, pizza, or games), and highly motivating praise.
3. Be gentle, warm, and encourage the student at every step. Keep your replies brief (max 2-3 sentences).`;
    } else {
      // Socratic (default)
      coreInstructions = `1. Speak strictly in clean, friendly Hindi using the Devanagari script (e.g. "चलिए, fractions को समझते हैं...", "क्या आप तैयार हैं?"). You can use common technical terms (like fractions, numerator, science, maths, history) in English, but the overall language and script of the response must be Devanagari Hindi.
2. Teach the topic step-by-step. In each response, explain one small sub-concept of the topic clearly in Devanagari Hindi, and then immediately ask a simple question in Hindi to test the student's understanding before moving on.
3. NEVER give the direct answer to any problem or academic question. Instead, guide the student step-by-step by asking scaffolding questions and giving encouraging feedback in Hindi.
4. Keep your replies brief, highly conversational, and engaging.`;
    }

    const systemPrompt = `You are Maya, an encouraging, friendly 3D AI Tutor on the ClassOrbit platform.
You are helping Grade 5 students learn ${subject || "Mathematics"}, specifically the topic "${topic || "Fractions"}".
You are currently teaching in the style of the "${persona || "Socratic"}" persona.

CRITICAL GUIDELINES FOR YOUR RESPONSES:
${coreInstructions}

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
      return NextResponse.json({ text: getLocalSocraticReply(message, topic, subject) });
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || getLocalSocraticReply(message, topic, subject);
    
    return NextResponse.json({ text: replyText });
  } catch (error) {
    console.error("Error in AI Chat Route:", error);
    return NextResponse.json({ text: "I had a tiny hiccup. What specific part of this topic are you looking at right now?" });
  }
}
