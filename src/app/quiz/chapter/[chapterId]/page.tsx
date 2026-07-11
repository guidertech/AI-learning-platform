"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { getChapterQuiz, MCQ } from "@/lib/mock/chapterQuizzes";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import EmptyState from "@/components/layout/EmptyState";

interface ChapterEndQuizPageProps {
  params: Promise<{ chapterId: string }>;
}

export type QuestionResult = {
  question: MCQ;
  selectedIndex: number | null;
  isCorrect: boolean;
};

export default function ChapterEndQuizPage({ params }: ChapterEndQuizPageProps) {
  const router = useRouter();
  const { chapterId } = use(params);

  const quizData = getChapterQuiz(chapterId);
  const questions = quizData?.chapterEnd ?? [];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [results, setResults] = useState<QuestionResult[]>([]);

  const currentQuestion = questions[currentIdx];
  const totalQuestions = questions.length;

  if (!quizData || totalQuestions === 0) {
    return (
      <PageContainer>
        <Topbar title="Chapter Test" />
        <main className="p-8">
          <EmptyState title="No Test Found" description="No chapter test is available for this chapter." icon="quiz" />
        </main>
      </PageContainer>
    );
  }

  const handleSelect = (idx: number) => {
    setSelectedIndex(idx);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;

    const newResult: QuestionResult = {
      question: currentQuestion,
      selectedIndex,
      isCorrect: selectedIndex === currentQuestion.correctIndex,
    };
    const newResults = [...results, newResult];

    if (currentIdx + 1 < totalQuestions) {
      setResults(newResults);
      setCurrentIdx((prev) => prev + 1);
      setSelectedIndex(null);
    } else {
      // Save results and navigate to results page
      sessionStorage.setItem(
        `chapter_end_results_${chapterId}`,
        JSON.stringify({
          chapterId,
          chapterTitle: quizData.chapterTitle,
          results: newResults,
        })
      );
      router.push(`/quiz/chapter/${chapterId}/results`);
    }
  };

  const progressPercent = Math.round((currentIdx / totalQuestions) * 100);
  const optionLabels = ["A", "B", "C", "D"];

  return (
    <PageContainer>
      <Topbar
        title="Chapter Test"
        subtitle={quizData.chapterTitle}
      />

      <main className="p-4 md:p-8 max-w-[900px] mx-auto w-full space-y-6">
        {/* Exit bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <span className="text-xs font-bold text-outline uppercase tracking-wider">Exit Test</span>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-2xl p-4 border border-outline-variant/15 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-outline tracking-wider">Question Progress</span>
            <span className="text-xs font-bold text-primary">{currentIdx + 1} / {totalQuestions}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <div className="bg-white p-6 rounded-[28px] border border-outline-variant/15 shadow-sm space-y-5">
            {/* Topic label badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/8 rounded-full">
              <span className="material-symbols-outlined text-primary text-[14px]">label</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{currentQuestion.topic}</span>
            </div>

            {/* Question */}
            <h2 className="font-bold text-base text-on-surface leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* Options list */}
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedIndex === idx;

                let optStyle = "border-outline-variant/20 bg-slate-50 hover:bg-primary/5 hover:border-primary/30";
                let labelStyle = "bg-slate-200 text-on-surface-variant";

                if (isSelected) {
                  optStyle = "border-primary bg-primary/8";
                  labelStyle = "bg-primary text-white";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left cursor-pointer active:scale-[0.99] ${optStyle}`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${labelStyle}`}>
                      {optionLabels[idx]}
                    </span>
                    <span className="text-sm font-semibold text-on-surface">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Action button */}
            <div className="pt-2">
              <button
                onClick={handleNext}
                disabled={selectedIndex === null}
                className={`w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  selectedIndex !== null
                    ? "bg-primary text-white shadow-md shadow-primary/20 cursor-pointer active:scale-[0.98]"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <span>{currentIdx + 1 < totalQuestions ? "Next Question" : "Submit Test"}</span>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </PageContainer>
  );
}
