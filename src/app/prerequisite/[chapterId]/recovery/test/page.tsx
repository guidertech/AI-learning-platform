"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import EmptyState from "@/components/layout/EmptyState";
import { getChapterQuiz, MCQ } from "@/lib/mock/chapterQuizzes";

interface RecoveryTestPageProps {
  params: Promise<{ chapterId: string }>;
}

type QuestionResult = {
  question: MCQ;
  selectedIndex: number | null;
  isCorrect: boolean;
};

export default function PrereqRecoveryTestPage({ params }: RecoveryTestPageProps) {
  const router = useRouter();
  const { chapterId } = use(params);

  const quizData = getChapterQuiz(chapterId);
  const allPrereqQuestions = quizData?.prerequisite ?? [];

  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [testFinished, setTestFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = sessionStorage.getItem(`prereq_results_${chapterId}`);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        const results = data.results ?? [];

        // Identify weak topics
        const topicMap: Record<string, { total: number; correct: number }> = {};
        results.forEach((r: any) => {
          const t = r.question.topic;
          if (!topicMap[t]) topicMap[t] = { total: 0, correct: 0 };
          topicMap[t].total += 1;
          if (r.isCorrect) topicMap[t].correct += 1;
        });

        const weak = Object.keys(topicMap).filter((topic) => {
          const stats = topicMap[topic];
          const pct = Math.round((stats.correct / stats.total) * 100);
          return pct < 70;
        });

        setWeakTopics(weak);

        // Filter diagnostic questions to ONLY include weak topics
        const weakQuestions = allPrereqQuestions.filter((q) => weak.includes(q.topic));
        
        // Shuffle the filtered questions
        const shuffled = [...weakQuestions].sort(() => 0.5 - Math.random());
        setQuestions(shuffled);
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, [chapterId, allPrereqQuestions]);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIdx];

  const handleSelect = (idx: number) => {
    setSelectedIndex(idx);
  };

  const handleNext = () => {
    if (selectedIndex === null || !currentQuestion) return;

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
      setResults(newResults);
      setTestFinished(true);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Topbar title="Preparing Test..." />
        <main className="p-8 flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
      </PageContainer>
    );
  }

  if (totalQuestions === 0) {
    return (
      <PageContainer>
        <Topbar title="Recovery Test" />
        <main className="p-8 max-w-xl mx-auto text-center space-y-6">
          <EmptyState
            title="No Test Needed"
            description="You have no weak topics to test. You can proceed directly to the chapter roadmap."
            icon="workspace_premium"
          />
          <button
            onClick={() => {
              sessionStorage.setItem(`prereq_recovery_passed_${chapterId}`, "true");
              router.push(`/chapters/${chapterId}`);
            }}
            className="w-full h-12 bg-primary text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Go to Chapter Roadmap</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </main>
      </PageContainer>
    );
  }

  if (testFinished) {
    const correctCount = results.filter((r) => r.isCorrect).length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= 70;

    if (passed) {
      sessionStorage.setItem(`prereq_recovery_passed_${chapterId}`, "true");
    }

    return (
      <PageContainer>
        <Topbar title="Recovery Test Completed" />
        <main className="flex-grow flex items-center justify-center p-8 bg-[#f8f9ff]">
          <div className="bg-white p-8 rounded-[32px] border border-outline-variant/15 shadow-md w-full max-w-xl text-center space-y-6">
            <div className={`w-20 h-20 rounded-[24px] flex items-center justify-center mx-auto shadow-sm select-none ${passed ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500"}`}>
              <span className="material-symbols-outlined text-[40px]">
                {passed ? "workspace_premium" : "sentiment_dissatisfied"}
              </span>
            </div>
            
            <h1 className="font-display font-bold text-2xl text-on-surface">
              {passed ? "Prerequisite Cleared!" : "Need More Review"}
            </h1>
            
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
              {passed 
                ? "Excellent! You scored well in the weak topics. Prerequisite constraints are unlocked." 
                : "You didn't reach the 70% passing score on the weak topics. Please review the lessons again."}
            </p>

            <div className="bg-slate-50 border border-slate-100 p-6 rounded-[24px] w-full space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-outline-variant/20">
                <span className="text-xs font-semibold text-on-surface-variant">Prerequisite Topics Tested</span>
                <span className="font-bold text-xs text-on-surface">{weakTopics.join(", ")}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-outline-variant/20">
                <span className="text-xs font-semibold text-on-surface-variant">Correct Answers</span>
                <span className={`font-bold text-sm ${passed ? "text-emerald-600" : "text-red-500"}`}>{correctCount} / {totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-on-surface-variant">Retest Accuracy Score</span>
                <span className={`font-bold text-base ${passed ? "text-emerald-600" : "text-red-500"}`}>{score}%</span>
              </div>
            </div>

            {passed ? (
              <button
                onClick={() => router.push(`/chapters/${chapterId}`)}
                className="w-full h-12 bg-primary text-white font-bold rounded-xl active:scale-[0.98] transition-all shadow-md cursor-pointer"
              >
                <span>Continue to Chapter</span>
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/prerequisite/${chapterId}/recovery`)}
                  className="w-full h-12 bg-primary text-white font-bold rounded-xl active:scale-[0.98] transition-all shadow-md cursor-pointer"
                >
                  <span>Review Lessons Again</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentIdx(0);
                    setSelectedIndex(null);
                    setResults([]);
                    setTestFinished(false);
                  }}
                  className="w-full h-12 bg-white border border-outline-variant/30 text-on-surface font-bold rounded-xl active:scale-[0.98] transition-all cursor-pointer hover:bg-slate-50"
                >
                  <span>Retake Test</span>
                </button>
              </div>
            )}
          </div>
        </main>
      </PageContainer>
    );
  }

  const progressPercent = Math.round((currentIdx / totalQuestions) * 100);
  const optionLabels = ["A", "B", "C", "D"];

  return (
    <PageContainer>
      <Topbar
        title="Recovery Test"
        subtitle={`Retesting weak prerequisite topics`}
      />

      <main className="p-4 md:p-8 max-w-[900px] mx-auto w-full space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <span className="text-xs font-bold text-outline uppercase tracking-wider">Exit Test</span>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-4 border border-outline-variant/15 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-outline uppercase tracking-wider">
            <span>Retest Progress</span>
            <span className="text-primary">{currentIdx + 1} / {totalQuestions}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        {currentQuestion && (
          <div className="bg-white p-6 rounded-[28px] border border-outline-variant/15 shadow-sm space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/8 rounded-full">
              <span className="material-symbols-outlined text-primary text-[14px]">label</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{currentQuestion.topic}</span>
            </div>

            <h2 className="font-bold text-base text-on-surface leading-relaxed">
              {currentQuestion.question}
            </h2>

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

            <div className="pt-2">
              <button
                onClick={handleNext}
                disabled={selectedIndex === null}
                className={`w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  selectedIndex !== null
                    ? "bg-primary text-white shadow-md shadow-primary/20 active:scale-[0.98] cursor-pointer"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <span>{currentIdx + 1 < totalQuestions ? "Next Question" : "Submit Retest"}</span>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </PageContainer>
  );
}
