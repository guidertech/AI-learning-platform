import { QuizQuestion } from "@/types/quiz";

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
