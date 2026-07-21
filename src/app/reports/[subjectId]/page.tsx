"use client";

import React, { use, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import { useLearning } from "@/context/LearningContext";
import { createClient } from "@/lib/supabase/client";

const subjectNameMap: Record<string, string> = {
  "Mathematics": "sub-math",
  "Science": "sub-sci",
  "Social Science": "sub-hist",
  "English": "sub-eng",
};

const subjectTheme: Record<string, { gradient: string; light: string; border: string; text: string }> = {
  "sub-math": { gradient: "from-violet-600 to-primary", light: "bg-primary/8", border: "border-primary/20", text: "text-primary" },
  "sub-sci": { gradient: "from-sky-500 to-cyan-400", light: "bg-sky-50", border: "border-sky-200", text: "text-sky-600" },
  "sub-eng": { gradient: "from-emerald-500 to-teal-400", light: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600" },
  "sub-hist": { gradient: "from-amber-500 to-orange-400", light: "bg-amber-50", border: "border-amber-200", text: "text-amber-600" },
};

interface SubjectReportPageProps {
  params: Promise<{ subjectId: string }>;
}

export default function DetailedSubjectReportPage({ params }: SubjectReportPageProps) {
  const router = useRouter();
  const { subjectProficiencies } = useLearning();
  const { subjectId } = use(params);

  const [subject, setSubject] = useState<any>(null);
  const [dbChapters, setDbChapters] = useState<any[]>([]);
  const [dbTestHistory, setDbTestHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubject() {
      const supabase = createClient();
      try {
        const { data: dbSubject } = await supabase
          .from("subjects")
          .select("*")
          .eq("subject_id", subjectId)
          .maybeSingle();

        if (dbSubject) {
          setSubject(dbSubject);

          const { data: chaptersData } = await supabase
            .from("chapters")
            .select("*")
            .eq("subject_id", dbSubject.subject_id)
            .order("order_index", { ascending: true });

          if (chaptersData && chaptersData.length > 0) {
            const chapterIds = chaptersData.map((ch: any) => ch.chapter_id);
            const { data: dbTopics } = await supabase
              .from("topics")
              .select("*")
              .in("chapter_id", chapterIds);

            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const { data: attempts } = await supabase
                .from("quiz_attempts")
                .select("*")
                .in("chapter_id", chapterIds)
                .eq("user_id", user.id);
              if (attempts) setDbTestHistory(attempts);
            }

            const chaptersWithTopics = chaptersData.map((ch: any) => ({
              ...ch,
              topics: dbTopics?.filter((t: any) => t.chapter_id === ch.chapter_id) || []
            }));

            setDbChapters(chaptersWithTopics);
          } else if (chaptersData) {
            setDbChapters(chaptersData.map((ch: any) => ({ ...ch, topics: [] })));
          }
        } else {
          router.push("/reports");
        }
      } catch (error) {
        console.error("Error loading subject test report:", error);
      } finally {
        setLoading(false);
      }
    }
    void loadSubject();
  }, [subjectId, router]);

  const mappedMockId = subject ? subjectNameMap[subject.name] : null;
  const theme = mappedMockId ? subjectTheme[mappedMockId] : subjectTheme["sub-math"];

  const chapters = useMemo(() => {
    return dbChapters.map(ch => ({
      id: ch.id,
      chapterCode: ch.chapter_id,
      title: ch.name,
      topics: ch.topics || []
    }));
  }, [dbChapters]);

  interface TestLogEntry {
    chapterId: string;
    chapterTitle: string;
    type: "Prerequisite" | "Chapter-End";
    score: number;
    total: number;
    correct: number;
    passed: boolean;
    attemptedAt?: string;
  }

  const [testHistory, setTestHistory] = useState<TestLogEntry[]>([]);

  useEffect(() => {
    const history: TestLogEntry[] = [];
    chapters.forEach((ch) => {
      // 1. Check Prerequisite Test results in sessionStorage
      const prereqRaw = sessionStorage.getItem(`prereq_results_${ch.id}`);
      if (prereqRaw) {
        try {
          const data = JSON.parse(prereqRaw);
          const results = data.results ?? [];
          const total = results.length;
          const correct = results.filter((r: any) => r.isCorrect).length;
          const score = total > 0 ? Math.round((correct / total) * 100) : 0;
          history.push({
            chapterId: ch.id,
            chapterTitle: ch.title,
            type: "Prerequisite",
            score,
            total,
            correct,
            passed: score >= 70
          });
        } catch (e) {
          console.error(e);
        }
      }

      // 2. Check Chapter-End Test in DB or sessionStorage
      const dbAttempt = dbTestHistory.find((a: any) => a.chapter_id === ch.chapterCode);
      if (dbAttempt) {
        const total = dbAttempt.total_marks || 20;
        const correct = dbAttempt.obtain_marks || 0;
        const score = total > 0 ? Math.round((correct / total) * 100) : 0;
        history.push({
          chapterId: ch.id,
          chapterTitle: ch.title,
          type: "Chapter-End",
          score,
          total,
          correct,
          passed: score >= 70,
          attemptedAt: dbAttempt.attempted_at
        });
      } else {
        const endRaw = sessionStorage.getItem(`chapter_end_results_${ch.id}`);
        if (endRaw) {
          try {
            const data = JSON.parse(endRaw);
            const results = data.results ?? [];
            const total = results.length;
            const correct = results.filter((r: any) => r.isCorrect).length;
            const score = total > 0 ? Math.round((correct / total) * 100) : 0;
            history.push({
              chapterId: ch.id,
              chapterTitle: ch.title,
              type: "Chapter-End",
              score,
              total,
              correct,
              passed: score >= 70
            });
          } catch (e) {
            console.error(e);
          }
        }
      }
    });
    setTestHistory(history);
  }, [chapters, dbTestHistory]);

  // Calculate subject overall test score average
  const chapterEndTests = testHistory.filter(t => t.type === "Chapter-End");
  const overallAvgScore = chapterEndTests.length > 0
    ? Math.round(chapterEndTests.reduce((acc, curr) => acc + curr.score, 0) / chapterEndTests.length)
    : 0;

  if (loading) {
    return (
      <PageContainer>
        <Topbar
          title="Subject Test Report"
          subtitle="Detailed chapter-end test score results"
          showBack={true}
        />
        <main className="p-4 md:p-8 max-w-[1200px] mx-auto w-full flex justify-center items-center h-64">
          <p className="text-on-surface-variant text-sm font-medium">Loading test report...</p>
        </main>
      </PageContainer>
    );
  }

  if (!subject) return null;

  return (
    <PageContainer>
      <Topbar
        title={`${subject.name} — Test Report`}
        subtitle="Chapter end test performance, scores, and pass status"
        showBack={true}
      />

      <main className="p-4 md:p-8 max-w-[1200px] mx-auto w-full space-y-6 overflow-hidden">

        {/* ── Hero Banner ─────────────────────────────────── */}
        <div className={`bg-gradient-to-r ${theme?.gradient || 'from-slate-500 to-slate-400'} rounded-[28px] p-7 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-white text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>{subject.icon || "calculate"}</span>
            </div>
            <div>
              <p className="text-white/70 text-xs font-bold uppercase tracking-wider">Subject Test Report</p>
              <h1 className="text-2xl font-bold">{subject.name}</h1>
              <p className="text-white/80 text-sm mt-0.5">{chapters.length} Chapters · {testHistory.length} Total Tests Attempted</p>
            </div>
          </div>

          <div className="flex gap-6">
            {[
              { label: "Avg Test Score", value: chapterEndTests.length > 0 ? `${overallAvgScore}%` : "0%" },
              { label: "Tests Attempted", value: `${chapterEndTests.length}/${chapters.length}` },
              { label: "Cleared", value: `${chapterEndTests.filter(t => t.passed).length}` },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Chapter-wise Test Results List ────────────────────────── */}
        <div className="bg-white rounded-[28px] border border-outline-variant/15 shadow-sm p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-base text-on-surface">Chapter-End Test Performance</h3>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                Check score & result for each chapter end test
              </p>
            </div>
          </div>

          {chapters.length === 0 ? (
            <p className="text-xs text-on-surface-variant py-8 text-center">No chapters available for this subject yet.</p>
          ) : (
            <div className="space-y-4">
              {chapters.map((chapter) => {
                const chapterTest = testHistory.find(t => t.chapterId === chapter.id && t.type === "Chapter-End");
                const hasScore = chapterTest !== undefined;
                const score = chapterTest?.score ?? 0;
                const passed = chapterTest?.passed ?? false;

                return (
                  <div key={chapter.id} className="bg-slate-50/60 rounded-2xl border border-slate-100 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className={`w-10 h-10 rounded-xl ${theme.light} ${theme.border} border flex items-center justify-center shrink-0`}>
                        <span className={`material-symbols-outlined ${theme.text} text-[20px]`}>quiz</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-on-surface">{chapter.title}</h4>
                        <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                          {hasScore
                            ? `Score: ${chapterTest.correct} / ${chapterTest.total} marks (${score}%)`
                            : "Chapter End Test not attempted yet"
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between w-full md:w-auto">
                      {hasScore ? (
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                            passed
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}>
                            {passed ? "Cleared ✓" : "Needs Work (!)"}
                          </span>
                          <span className="text-xl font-black text-on-surface">{score}%</span>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          Not Attempted
                        </span>
                      )}

                      <button
                        onClick={() => router.push(`/quiz/chapter/${chapter.id}`)}
                        className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                          hasScore
                            ? "bg-white text-primary border-primary/20 hover:bg-primary/5"
                            : "bg-primary text-white border-transparent hover:bg-primary/90 shadow-sm"
                        }`}
                      >
                        {hasScore ? "Retake Test" : "Attempt Test →"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Test Attempts History Log ─────────────────────────── */}
        <div className="bg-white rounded-[28px] border border-outline-variant/15 shadow-sm p-6 space-y-5">
          <div>
            <h3 className="font-bold text-sm text-on-surface">Complete Test & Quiz Attempt Log</h3>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">All logged test attempts for {subject.name}</p>
          </div>

          {testHistory.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-outline-variant/15">
              <span className="material-symbols-outlined text-[36px] text-outline/60">history_edu</span>
              <p className="text-xs text-on-surface-variant font-semibold mt-2">No test attempts logged yet.</p>
              <p className="text-[10px] text-outline font-medium mt-1">Take chapter end tests to track your scores here.</p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/10 border border-outline-variant/10 rounded-2xl overflow-hidden">
              {testHistory.map((test, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/20 hover:bg-slate-50 transition-all gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      test.type === "Prerequisite" ? "bg-amber-500/10 text-amber-600" : "bg-primary/10 text-primary"
                    }`}>
                      <span className="material-symbols-outlined text-[18px]">
                        {test.type === "Prerequisite" ? "assignment_turned_in" : "fact_check"}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-xs text-on-surface">{test.chapterTitle}</h4>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                          test.type === "Prerequisite"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-primary/5 text-primary border-primary/10"
                        }`}>
                          {test.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant font-medium mt-1">
                        Result: {test.correct} of {test.total} correct answers
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end shrink-0">
                    <div className="text-right">
                      <p className={`text-base font-black ${test.passed ? "text-emerald-600" : "text-amber-600"}`}>
                        {test.score}%
                      </p>
                      <p className="text-[9px] text-outline font-bold uppercase tracking-wider mt-0.5">
                        {test.passed ? "Cleared" : "Needs Review"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </PageContainer>
  );
}
