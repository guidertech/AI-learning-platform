import { QuizQuestion } from "@/types/quiz";
import { chapterQuizzes } from "./chapterQuizzes";

export const mockQuizQuestions: Record<string, QuizQuestion[]> = {
  "top-4-3": [
    {
      id: "q1",
      questionText: "What is $2\\frac{1}{3}$ written as an improper fraction?",
      options: ["5/3", "7/3", "6/3", "8/3"],
      correctAnswer: "7/3",
      explanation: "Multiply the whole number 2 by the denominator 3 (which equals 6), and add the numerator 1 to get 7. So, the improper fraction is 7/3."
    },
    {
      id: "q2",
      questionText: "Convert $3\\frac{3}{4}$ to an improper fraction.",
      options: ["15/4", "9/4", "12/4", "13/4"],
      correctAnswer: "15/4",
      explanation: "Multiply 3 by 4 (which equals 12) and add 3 to get 15. The result is 15/4."
    },
    {
      id: "q3",
      questionText: "Which of the following is equivalent to $1\\frac{1}{2}$?",
      options: ["3/2", "4/2", "2/2", "5/2"],
      correctAnswer: "3/2",
      explanation: "Multiply 1 by 2 (which equals 2) and add 1 to get 3. The result is 3/2."
    }
  ]
};

// Normalize/Map activeTopic title to the topic keys in our MCQ database
export function getTopicKeywords(activeTopic: string): string[] {
  const norm = activeTopic.toLowerCase();
  
  if (norm.includes("place value")) return ["Place Values", "Large Numbers"];
  if (norm.includes("comparing decimal")) return ["Comparing Decimals"];
  if (norm.includes("column addition") || norm.includes("addition")) return ["Basic Addition", "Column Method"];
  if (norm.includes("division")) return ["Division with Remainders", "Division Basics"];
  if (norm.includes("introduction to fraction") || norm.includes("fraction basics")) return ["Fraction Basics"];
  if (norm.includes("equivalent fraction")) return ["Equivalent Fractions"];
  if (norm.includes("mixed number")) return ["Mixed Numbers"];
  if (norm.includes("photosynthesis equation")) return ["Photosynthesis Equation", "Photosynthesis Basics"];
  if (norm.includes("rowlatt act") || norm.includes("background")) return ["Rowlatt Act", "Location & Context"];
  if (norm.includes("jallianwala bagh massacre")) return ["Location & Context"];
  if (norm.includes("general dyer")) return ["General Dyer"];
  if (norm.includes("impact")) return ["Impact"];
  if (norm.includes("reaction") || norm.includes("investigation")) return ["Investigation", "Impact"];
  
  // Default fallback keywords matching the input topic title itself
  return [activeTopic];
}

export function getRandomQuizQuestionsForTopic(activeTopic: string): QuizQuestion[] {
  const keywords = getTopicKeywords(activeTopic);
  const pool: QuizQuestion[] = [];
  
  // 1. Gather from chapterQuizzes (both prerequisite and chapterEnd)
  chapterQuizzes.forEach((quiz) => {
    // Collect from prerequisites
    quiz.prerequisite.forEach((q) => {
      if (keywords.some((kw) => q.topic.toLowerCase().includes(kw.toLowerCase()) || kw.toLowerCase().includes(q.topic.toLowerCase()))) {
        pool.push({
          id: q.id,
          questionText: q.question,
          options: q.options,
          correctAnswer: q.options[q.correctIndex],
          explanation: q.explanation,
        });
      }
    });
    // Collect from chapterEnds
    quiz.chapterEnd.forEach((q) => {
      if (keywords.some((kw) => q.topic.toLowerCase().includes(kw.toLowerCase()) || kw.toLowerCase().includes(q.topic.toLowerCase()))) {
        pool.push({
          id: q.id,
          questionText: q.question,
          options: q.options,
          correctAnswer: q.options[q.correctIndex],
          explanation: q.explanation,
        });
      }
    });
  });

  // 2. Gather from mockQuizQuestions (e.g. top-4-3)
  if (activeTopic.toLowerCase().includes("mixed number")) {
    const mq = mockQuizQuestions["top-4-3"] || [];
    mq.forEach((q) => {
      if (!pool.some(p => p.id === q.id)) {
        pool.push(q);
      }
    });
  }

  // 3. Fallback: If pool is empty, grab any questions
  if (pool.length === 0) {
    chapterQuizzes.forEach((quiz) => {
      quiz.prerequisite.forEach((q) => {
        pool.push({
          id: q.id,
          questionText: q.question,
          options: q.options,
          correctAnswer: q.options[q.correctIndex],
          explanation: q.explanation,
        });
      });
    });
  }

  // Deduplicate pool
  const uniquePool = pool.filter((q, index, self) =>
    self.findIndex((t) => t.id === q.id) === index
  );

  // Shuffle pool
  const shuffled = [...uniquePool].sort(() => 0.5 - Math.random());
  
  // Return exactly 5 questions
  return shuffled.slice(0, 5);
}
