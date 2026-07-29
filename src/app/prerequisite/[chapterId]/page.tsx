"use client";

import React, { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getChapterQuiz, MCQ } from "@/features/curriculum/data/chapterQuizzes";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import EmptyState from "@/components/layout/EmptyState";
import { createClient } from "@/lib/supabase/client";

interface PrerequisitePageProps {
  params: Promise<{ chapterId: string }>;
}

export type QuestionResult = {
  question: MCQ;
  selectedIndex: number | null;
  isCorrect: boolean;
};

export default function PrerequisiteQuizPage({ params }: PrerequisitePageProps) {
  const router = useRouter();
  const { chapterId } = use(params);

  const [loading, setLoading] = useState(true);
  const [chapterTitle, setChapterTitle] = useState("");
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = questions[currentIdx];
  const totalQuestions = questions.length;

  useEffect(() => {
    async function initQuiz() {
      try {
        const supabase = createClient();
        
        // 1. Fetch chapter from database to see if prerequisite is required
        const { data: chapter, error: dbError } = await supabase
          .from("chapters")
          .select("id, name, requires_prerequisite")
          .eq("id", chapterId)
          .maybeSingle();

        if (dbError) {
          throw dbError;
        }

        if (!chapter) {
          setError("Chapter not found");
          setLoading(false);
          return;
        }

        setChapterTitle(chapter.name);

        // If it doesn't require prerequisite, redirect immediately
        if (!chapter.requires_prerequisite) {
          console.log("[Prerequisite] Chapter does not require prerequisite. Redirecting to chapter...");
          router.replace(`/chapters/${chapterId}`);
          return;
        }

        // 2. Fetch dynamically generated questions from API
        const response = await fetch(`/api/generate-prereq-quiz?chapterId=${chapterId}`);
        if (!response.ok) {
          console.warn("[Prerequisite] API returned non-OK status, falling back to mock data.");
          loadMockFallback();
          return;
        }

        const data = await response.json();
        
        if (data.requiresPrerequisite === false) {
          router.replace(`/chapters/${chapterId}`);
          return;
        }

        if (data.fallback || !data.questions || data.questions.length === 0) {
          console.warn("[Prerequisite] Falling back to mock quiz data.");
          loadMockFallback();
        } else {
          setQuestions(data.questions);
          setLoading(false);
        }

      } catch (err: any) {
        console.error("[Prerequisite] Error initializing quiz:", err);
        loadMockFallback();
      }
    }

    function loadMockFallback() {
      const mockData = getChapterQuiz(chapterId);
      if (mockData && mockData.prerequisite && mockData.prerequisite.length > 0) {
        setChapterTitle(mockData.chapterTitle);
        setQuestions(mockData.prerequisite);
      } else {
        setError("No prerequisite questions found.");
      }
      setLoading(false);
    }

    void initQuiz();
  }, [chapterId, router]);

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
      // Save to sessionStorage and navigate to results page
      sessionStorage.setItem(
        `prereq_results_${chapterId}`,
        JSON.stringify({
          chapterId,
          chapterTitle: chapterTitle || "Chapter Prerequisite",
          results: newResults,
        })
      );
      router.push(`/prerequisite/${chapterId}/results`);
    }
  };

  const progressPercent = totalQuestions > 0 ? Math.round((currentIdx / totalQuestions) * 100) : 0;
  const optionLabels = ["A", "B", "C", "D"];

  if (loading) {
    return (
      <PageContainer>
        <Topbar title="Prerequisite Test" subtitle="Loading..." />
        <main className="p-8 max-w-[900px] mx-auto w-full flex flex-col items-center justify-center min-h-[400px] space-y-6">
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* Pulsing AI ring */}
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping"></div>
            <div className="absolute inset-2 rounded-full border-4 border-primary/40 animate-pulse"></div>
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined text-white text-[28px] animate-spin">sync</span>
            </div>
          </div>
          <div className="text-center space-y-2 max-w-sm">
            <h3 className="font-bold text-lg text-on-surface">Maya is preparing your test...</h3>
            <p className="text-xs font-semibold text-outline leading-relaxed animate-pulse">
              Generating 5 custom diagnostic questions based on the prerequisite topics of this chapter.
            </p>
          </div>
        </main>
      </PageContainer>
    );
  }

  if (error || totalQuestions === 0) {
    return (
      <PageContainer>
        <Topbar title="Prerequisite Test" subtitle={chapterTitle} />
        <main className="p-8 max-w-[900px] mx-auto w-full flex flex-col items-center justify-center min-h-[400px] space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[32px]">cloud_off</span>
          </div>
          <div className="text-center space-y-2 max-w-md">
            <h3 className="font-bold text-lg text-on-surface">AI Quiz Temporarily Unavailable</h3>
            <p className="text-xs font-semibold text-outline leading-relaxed">
              Maya&apos;s AI engine is temporarily rate-limited. Please wait a moment and try again.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-white font-bold text-sm rounded-xl shadow-md shadow-primary/20 cursor-pointer active:scale-95 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            <span>Retry</span>
          </button>
          <button
            onClick={() => router.back()}
            className="text-xs font-bold text-outline hover:text-primary cursor-pointer transition-colors"
          >
            ← Go Back to Chapters
          </button>
        </main>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Topbar
        title="Prerequisite Test"
        subtitle={chapterTitle}
      />

      <main className="p-4 md:p-8 max-w-[900px] mx-auto w-full space-y-6">
        {/* Header bar */}
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
            {/* Topic badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/8 rounded-full">
              <span className="material-symbols-outlined text-primary text-[14px]">label</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{currentQuestion.topic}</span>
            </div>

            {/* Question text */}
            <h2 className="font-bold text-base text-on-surface leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* Options */}
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
