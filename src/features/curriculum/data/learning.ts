import { Message, Weakness } from "@/types/learning";

export const initialChatMessages: Message[] = [
  {
    id: "msg-init-1",
    sender: "AI",
    text: "Hello! I'm Maya, your learning companion. We are studying Chapter 4: Fractions today. What can I help you understand?",
    createdAt: new Date().toISOString()
  }
];

export const mockWeaknesses: Weakness[] = [
  {
    id: "weak-1",
    skillName: "Dividing Mixed Numbers",
    score: 0.65,
    notes: "Frequently forgets to multiply the whole number by the denominator before adding the numerator."
  }
];
