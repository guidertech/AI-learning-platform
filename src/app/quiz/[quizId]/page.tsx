"use client";

import React, { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLearning } from "@/context/LearningContext";
import { getRandomQuizQuestionsForTopic } from "@/lib/mock/quiz";
import { QuizQuestion } from "@/types/quiz";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import QuizProgress from "@/components/quiz/QuizProgress";
import QuestionCard from "@/components/quiz/QuestionCard";
import OptionCard from "@/components/quiz/OptionCard";

interface QuizPageProps {
  params: Promise<{ quizId: string }>;
}

export default function TopicQuizPage({ params }: QuizPageProps) {
  const router = useRouter();
  const { quizId } = use(params);
  
  const { activeTopic, submitQuizScore } = useLearning();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const list = getRandomQuizQuestionsForTopic(activeTopic);
    setQuestions(list);
  }, [activeTopic]);

  if (questions.length === 0) {
    return (
      <PageContainer>
        <Topbar title="Loading Quiz..." subtitle="Preparing your practice session" />
        <main className="p-8 flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
      </PageContainer>
    );
  }

  const currentQuestion = questions[currentIdx];

  const handleSelectOption = (opt: string) => {
    if (checked) return;
    setSelectedOpt(opt);
  };

  const handleCheck = () => {
    if (!selectedOpt || !currentQuestion) return;
    
    setChecked(true);
    const correct = selectedOpt === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setChecked(false);
    
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      const score = Math.round((correctCount / questions.length) * 100);
      submitQuizScore(score);
      setQuizFinished(true);
    }
  };

  const handleFinish = () => {
    router.push("/dashboard");
  };

  if (quizFinished) {
    const finalScore = Math.round((correctCount / questions.length) * 100);
    return (
      <PageContainer>
        <Topbar title="Quiz Results" subtitle="Detailed performance breakdown" />
        <main className="flex-grow flex items-center justify-center p-8 bg-[#f8f9ff]">
          <div className="bg-white p-8 rounded-[32px] border border-outline-variant/15 shadow-md w-full max-w-xl text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-[24px] flex items-center justify-center text-primary mx-auto shadow-[0_8px_16px_rgba(83,65,205,0.1)] select-none">
              <span className="material-symbols-outlined text-[40px]">workspace_premium</span>
            </div>
            <h1 className="font-display font-bold text-2xl text-on-surface">Quiz Completed!</h1>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
              You successfully completed the practice drill for <strong>{activeTopic}</strong>.
            </p>

            <div className="bg-[#F3F0FF] border border-primary/10 p-6 rounded-[24px] w-full space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-outline-variant/20">
                <span className="text-xs font-semibold text-on-surface-variant">Total Questions</span>
                <span className="font-bold text-sm text-on-surface">{questions.length}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-outline-variant/20">
                <span className="text-xs font-semibold text-on-surface-variant">Correct Answers</span>
                <span className="font-bold text-sm text-green-600">{correctCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-on-surface-variant">Accuracy Score</span>
                <span className="font-bold text-base text-primary">{finalScore}%</span>
              </div>
            </div>

            <button 
              onClick={handleFinish}
              className="w-full h-12 bg-primary text-white font-bold rounded-xl active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(83,65,205,0.2)] cursor-pointer"
            >
              Go to Dashboard
            </button>
          </div>
        </main>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Topbar 
        title={`${activeTopic} Practice`} 
        subtitle="Test your conceptual math speed" 
        showSearch={true} 
      />

      <main className="p-8 max-w-[1200px] mx-auto w-full space-y-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push("/learning/fractions")}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <span className="text-xs font-bold text-outline uppercase tracking-wider">Exit Quiz</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Question Details - 7 cols */}
          <div className="lg:col-span-7 space-y-6">
            {currentQuestion && (
              <div className="bg-white p-6 rounded-[28px] border border-outline-variant/15 shadow-sm space-y-6">
                <QuizProgress currentQuestionIndex={currentIdx} totalQuestions={questions.length} />
                
                <QuestionCard 
                  questionText={currentQuestion.questionText}
                  checked={checked}
                  explanation={currentQuestion.explanation}
                />

                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options.map((opt, idx) => {
                    const label = ["A", "B", "C", "D"][idx];
                    return (
                      <OptionCard 
                        key={opt}
                        label={label}
                        optionText={opt}
                        isSelected={selectedOpt === opt}
                        checked={checked}
                        isCorrect={opt === currentQuestion.correctAnswer}
                        onClick={() => handleSelectOption(opt)}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: AI Tutor Dialogue - 5 cols */}
          <div className="lg:col-span-5 bg-white p-6 rounded-[28px] border border-outline-variant/15 shadow-sm flex flex-col justify-between h-fit min-h-[300px]">
            <div className="space-y-4">
              <div className="bg-[#f0ecf8] p-5 rounded-2xl border border-primary/5 flex gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 border border-primary/20">
                  <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
                </div>
                <div>
                  <h5 className="font-bold text-xs text-primary uppercase tracking-wider">Maya's Advice</h5>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    "Read carefully and try multiplying the whole number first. Eliminate options that divide parts incorrectly."
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              {!checked ? (
                <button 
                  onClick={handleCheck}
                  disabled={!selectedOpt}
                  className={`w-full h-12 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-1.5 transition-all ${
                    selectedOpt 
                      ? "bg-primary text-white cursor-pointer active:scale-95" 
                      : "bg-slate-300 text-slate-500 cursor-not-allowed opacity-60"
                  }`}
                >
                  <span>Check Answer</span>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              ) : (
                <button 
                  onClick={handleNext}
                  className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm shadow-md flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>{currentIdx + 1 < questions.length ? "Next Question" : "Finish Quiz"}</span>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </main>
    </PageContainer>
  );
}
