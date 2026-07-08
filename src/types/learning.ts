export interface Message {
  id: string;
  sender: "USER" | "AI";
  text: string;
  createdAt: string;
}

export interface Weakness {
  id: string;
  skillName: string;
  score: number; // Accuracy score between 0.0 and 1.0
  notes: string;
}

export interface RecoverySession {
  id: string;
  conceptId: string;
  stepIndex: number;
  estDurationMins: number;
}
