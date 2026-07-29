"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import { QuestionResult } from "../page";
import { saveQuizAttempt } from "@/features/curriculum";
import { createClient } from "@/lib/supabase/client";

interface ChapterEndResultsPageProps {
  params: Promise<{ chapterId: string }>;
}

type TopicSummary = {
  topic: string;
  total: number;
  correct: number;
};

export default function ChapterEndResultsPage({ params }: ChapterEndResultsPageProps) {
  const router = useRouter();
  const { chapterId } = use(params);

  const [results, setResults] = useState<QuestionResult[]>([]);
  const [chapterTitle, setChapterTitle] = useState("");
  const [activeTab, setActiveTab] = useState<"questions" | "topics">("topics");
  const [dbStatus, setDbStatus] = useState<{ status: 'saving' | 'saved' | 'failed' | null; message?: string }>({ status: null });

  useEffect(() => {
    const raw = sessionStorage.getItem(`chapter_end_results_${chapterId}`);
    if (raw) {
      const data = JSON.parse(raw);
      const parsedResults: QuestionResult[] = data.results ?? [];
      setResults(parsedResults);
      setChapterTitle(data.chapterTitle ?? "");

      // Record the attempt in the database if not already saved to prevent duplicates on refresh
      if (!data.savedToDb) {
        setDbStatus({ status: 'saving' });
        const total = parsedResults.length;
        const correct = parsedResults.filter((r) => r.isCorrect).length;

        async function performSave() {
          try {
            let code = data.chapterCode ? Number(data.chapterCode) : null;
            
            // Fallback: If chapterCode is not in sessionStorage, fetch it from chapters table in DB
            if (!code || isNaN(code)) {
              console.log("[ChapterEndResults] ChapterCode not found in session storage. Fetching from database...");
              const supabase = createClient();
              const { data: dbChapter, error: chapterError } = await supabase
                .from("chapters")
                .select("chapter_id")
                .eq("id", chapterId)
                .maybeSingle();

              if (chapterError) {
                throw chapterError;
              }
              if (dbChapter?.chapter_id) {
                code = Number(dbChapter.chapter_id);
              }
            }

            if (!code || isNaN(code)) {
              throw new Error("Could not resolve database chapter_id integer code");
            }

            const res = await saveQuizAttempt(code, total, correct);
            if (res.success) {
              console.log("[ChapterEndResults] Successfully recorded attempt in database.");
              data.savedToDb = true;
              sessionStorage.setItem(`chapter_end_results_${chapterId}`, JSON.stringify(data));
              setDbStatus({ status: 'saved' });
            } else {
              console.warn("[ChapterEndResults] Failed to record attempt in database:", res.error);
              setDbStatus({ status: 'failed', message: res.error });
            }
          } catch (err: any) {
            console.warn("[ChapterEndResults] Error invoking saveQuizAttempt:", err);
            setDbStatus({ status: 'failed', message: err.message || String(err) });
          }
        }

        void performSave();
      } else {
        setDbStatus({ status: 'saved' });
      }
    }
  }, [chapterId]);

  const totalQuestions = results.length;
  const correctCount = results.filter((r) => r.isCorrect).length;
  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Group by topic to analyze Strong/Weak areas
  const topicMap: Record<string, TopicSummary> = {};
  results.forEach((r) => {
    const t = r.question.topic;
    if (!topicMap[t]) topicMap[t] = { topic: t, total: 0, correct: 0 };
    topicMap[t].total += 1;
    if (r.isCorrect) topicMap[t].correct += 1;
  });
  const topicSummaries = Object.values(topicMap);

  const scoreColor =
    score >= 70 ? "text-emerald-600" : score >= 40 ? "text-amber-500" : "text-red-500";
  const scoreBg =
    score >= 70 ? "bg-emerald-50 border-emerald-200" : score >= 40 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <PageContainer>
      <Topbar title="Chapter Test Results" subtitle={chapterTitle} />

      <main className="p-4 md:p-8 max-w-[960px] mx-auto w-full space-y-6">

        {/* Database Sync Status */}
        {dbStatus.status === 'saving' && (
          <div className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-semibold shadow-sm animate-pulse">
            <span className="animate-spin material-symbols-outlined text-[18px]">sync</span>
            <span>saving attempt to database...</span>
          </div>
        )}
        {dbStatus.status === 'failed' && (
          <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-2xl flex flex-col gap-1.5 text-xs font-semibold shadow-sm">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-red-600">error</span>
              <span>Could not save results to database: {dbStatus.message}</span>
            </div>
            <p className="text-[10px] text-red-600 font-medium pl-6">
              Please check your Supabase Row Level Security (RLS) policies, foreign key constraints, or authentication context.
            </p>
          </div>
        )}

        {/* Score Card Hero */}
        <section className="bg-white rounded-[28px] border border-outline-variant/15 shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-28 h-28 shrink-0 select-none">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" strokeWidth="8" className="text-slate-100 stroke-current" />
              <circle
                cx="50" cy="50" r="40" fill="transparent" strokeWidth="8"
                strokeLinecap="round"
                className={`stroke-current transition-all duration-1000 ${score >= 70 ? "text-emerald-500" : score >= 40 ? "text-amber-500" : "text-red-500"}`}
                style={{
                  strokeDasharray: 251.2,
                  strokeDashoffset: 251.2 - (score / 100) * 251.2,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-bold text-2xl ${scoreColor}`}>{score}%</span>
              <span className="text-[10px] text-outline font-semibold uppercase tracking-wider">Chapter Score</span>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h2 className="font-bold text-lg text-on-surface">
                {score >= 70 ? "Congratulations! You passed the chapter test!" : score >= 40 ? "Good try! A bit more review will get you a perfect score." : "Needs review. Try checking topic details below."}
              </h2>
              <p className="text-xs text-on-surface-variant mt-1">
                You correctly answered <strong className="text-on-surface">{correctCount} out of {totalQuestions}</strong> questions in the comprehensive chapter-end test for <strong className="text-on-surface">{chapterTitle}</strong>.
              </p>
            </div>

            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold w-fit ${scoreBg}`}>
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {score >= 70 ? "check_circle" : "warning"}
              </span>
              <span className={scoreColor}>
                {score >= 70 ? "Chapter mastered successfully!" : "Review recommended topics labeled as Weak"}
              </span>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-on-surface-variant font-medium">{correctCount} Correct</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs text-on-surface-variant font-medium">{totalQuestions - correctCount} Wrong</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tab switch */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("topics")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "topics" ? "bg-white text-primary shadow-sm" : "text-outline hover:text-on-surface"}`}
          >
            Strong & Weak Topics
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "questions" ? "bg-white text-primary shadow-sm" : "text-outline hover:text-on-surface"}`}
          >
            Review Questions
          </button>
        </div>

        {/* ─── TOPICS TAB ─────────────────────────────────────────── */}
        {activeTab === "topics" && (
          <section className="bg-white rounded-[28px] border border-outline-variant/15 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-sm text-on-surface">Topic Mastery Analysis</h3>
            <div className="space-y-3">
              {topicSummaries.map((ts) => {
                const pct = Math.round((ts.correct / ts.total) * 100);
                const isStrong = pct >= 70;
                return (
                  <div key={ts.topic} className="flex items-center gap-4 p-4 rounded-2xl border border-outline-variant/10 bg-slate-50/50">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isStrong ? "bg-emerald-100" : "bg-red-100"}`}>
                      <span
                        className={`material-symbols-outlined text-[20px] ${isStrong ? "text-emerald-600" : "text-red-500"}`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {isStrong ? "check_circle" : "cancel"}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-on-surface truncate">{ts.topic}</span>
                        <span className={`text-xs font-bold ml-2 shrink-0 ${isStrong ? "text-emerald-600" : "text-red-500"}`}>
                          {ts.correct}/{ts.total}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${isStrong ? "bg-emerald-500" : "bg-red-400"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${isStrong ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {isStrong ? "Strong" : "Weak"}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ─── QUESTIONS TAB ──────────────────────────────────────── */}
        {activeTab === "questions" && (
          <section className="space-y-4">
            {results.map((r, idx) => (
              <div
                key={r.question.id}
                className={`bg-white rounded-[24px] border shadow-sm p-5 space-y-4 ${r.isCorrect ? "border-emerald-200" : "border-red-200"}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${r.isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/8 px-2 py-0.5 rounded-full">
                        {r.question.topic}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${r.isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                        {r.isCorrect ? "✓ Correct" : "✗ Wrong"}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-on-surface leading-relaxed">{r.question.question}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-11">
                  {r.question.options.map((opt, optIdx) => {
                    const isCorrectOpt = optIdx === r.question.correctIndex;
                    const isUserChoice = optIdx === r.selectedIndex;
                    const isWrongChoice = isUserChoice && !isCorrectOpt;

                    let style = "bg-slate-50 border-slate-200 text-on-surface-variant opacity-60";
                    let labelStyle = "bg-slate-200 text-slate-500";

                    if (isCorrectOpt) {
                      style = "bg-emerald-50 border-emerald-300 text-emerald-800 opacity-100";
                      labelStyle = "bg-emerald-500 text-white";
                    } else if (isWrongChoice) {
                      style = "bg-red-50 border-red-300 text-red-800 opacity-100";
                      labelStyle = "bg-red-500 text-white";
                    }

                    return (
                      <div key={optIdx} className={`flex items-center gap-3 px-3 py-2 rounded-xl border text-xs font-semibold ${style}`}>
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${labelStyle}`}>
                          {optionLabels[optIdx]}
                        </span>
                        <span className="truncate">{opt}</span>
                        {isCorrectOpt && (
                          <span className="ml-auto material-symbols-outlined text-emerald-600 text-[16px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        )}
                        {isWrongChoice && (
                          <span className="ml-auto material-symbols-outlined text-red-500 text-[16px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pl-11">
                  <div className="flex gap-2 items-start bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-200">
                    <span className="material-symbols-outlined text-primary text-[16px] mt-0.5 shrink-0">lightbulb</span>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{r.question.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 pb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 h-12 bg-primary text-white font-bold rounded-2xl shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all"
          >
            <span>Finish & Go to Dashboard</span>
            <span className="material-symbols-outlined text-[18px]">home</span>
          </button>
          <button
            onClick={() => router.push(`/quiz/chapter/${chapterId}`)}
            className="flex-1 h-12 bg-white border border-outline-variant/30 text-on-surface font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            <span>Retake Test</span>
          </button>
        </div>
      </main>
    </PageContainer>
  );
}
