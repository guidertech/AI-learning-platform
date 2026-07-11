"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import { mockSubjects } from "@/lib/mock/subjects";
import { mockChapters } from "@/lib/mock/chapters";
import { mockSubjectProficiencies } from "@/lib/mock/progress";
import { useLearning } from "@/context/LearningContext";

// Mock per-topic completion status (in a real app, comes from DB)
const mockTopicCompletion: Record<string, boolean> = {
  "place-values": true,
  "comparing-decimals": true,
  "column-addition": true,
  "remainder-division": false,
  "fractions-intro": true,
  "equivalent-fractions": true,
  "mixed-numbers": false,
  "equation": true,
  "background-and-rowlatt-act": true,
  "jallianwala-bagh-massacre-event": true,
  "general-dyer-actions": false,
  "impact-on-freedom-movement": false,
  "national-and-international-reactions": false,
};

// Map subject id → sub id used in mockChapters
const subjectChapterKey: Record<string, string> = {
  "sub-math": "sub-math",
  "sub-sci": "sub-sci",
  "sub-hist": "sub-hist",
  "sub-eng": "sub-eng",
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

export default function SubjectReportPage({ params }: SubjectReportPageProps) {
  const router = useRouter();
  const { weaknesses } = useLearning();
  const { subjectId } = use(params);

  const subject = mockSubjects.find((s) => s.id === subjectId);
  if (!subject) { router.push("/progress"); return null; }

  const theme = subjectTheme[subjectId] || subjectTheme["sub-math"];
  const chapters = mockChapters[subjectChapterKey[subjectId]] || [];
  const proficiency = mockSubjectProficiencies.find((p) => p.name === subject.name);

  interface TestLogEntry {
    chapterId: string;
    chapterTitle: string;
    type: "Prerequisite" | "Chapter-End";
    score: number;
    total: number;
    correct: number;
    passed: boolean;
    link: string;
  }

  const [testHistory, setTestHistory] = useState<TestLogEntry[]>([]);

  useEffect(() => {
    const history: TestLogEntry[] = [];
    chapters.forEach((ch) => {
      // 1. Check Prerequisite Test
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
            passed: score >= 70,
            link: `/prerequisite/${ch.id}/results`
          });
        } catch (e) {
          console.error(e);
        }
      }

      // 2. Check Chapter-End Test
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
            passed: score >= 70,
            link: `/quiz/chapter/${ch.id}/results`
          });
        } catch (e) {
          console.error(e);
        }
      }
    });
    setTestHistory(history);
  }, [chapters]);

  // Compute chapter/topic stats
  const allTopics = chapters.flatMap((ch) => ch.topics);
  const completedTopics = allTopics.filter((t) => mockTopicCompletion[t.slug]);
  const completionPct = allTopics.length > 0 ? Math.round((completedTopics.length / allTopics.length) * 100) : 0;

  // Filter weaknesses relevant to this subject
  const subjectWeaknesses = weaknesses.filter((w) => {
    const name = w.skillName?.toLowerCase() || "";
    if (subjectId === "sub-math") return name.includes("fraction") || name.includes("decimal") || name.includes("number") || name.includes("division") || name.includes("addition");
    if (subjectId === "sub-sci") return name.includes("photosynthesis") || name.includes("plant") || name.includes("science");
    if (subjectId === "sub-hist") return name.includes("rowlatt") || name.includes("bagh") || name.includes("history") || name.includes("dyer");
    return false;
  });

  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference - ((proficiency?.score ?? 0) / 100) * circumference;

  return (
    <PageContainer>
      <Topbar
        title={`${subject.name} — Subject Report`}
        subtitle="Detailed chapter progress, topic completion, and weak areas"
        showBack={true}
      />

      <main className="p-4 md:p-8 max-w-[1200px] mx-auto w-full space-y-6 overflow-hidden">

        {/* ── Hero Banner ─────────────────────────────────── */}
        <div className={`bg-gradient-to-r ${theme.gradient} rounded-[28px] p-7 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-white text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>{subject.icon}</span>
            </div>
            <div>
              <p className="text-white/70 text-xs font-bold uppercase tracking-wider">Subject Report</p>
              <h1 className="text-2xl font-bold">{subject.name}</h1>
              <p className="text-white/80 text-sm mt-0.5">{chapters.length} chapters · {allTopics.length} topics</p>
            </div>
          </div>

          <div className="flex gap-6">
            {[
              { label: "Topics Done", value: `${completedTopics.length}/${allTopics.length}` },
              { label: "Proficiency", value: `${proficiency?.score ?? 0}%` },
              { label: "Chapters", value: `${chapters.length}` },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Row 2: Score Ring + Chapter Progress ────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Score Ring */}
          <div className="lg:col-span-4 min-w-0 bg-white rounded-[28px] border border-outline-variant/15 shadow-sm p-6 flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-[10px] text-outline font-bold uppercase tracking-wider">Overall Proficiency</p>

            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="40" fill="transparent"
                  stroke="url(#subjGradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="subjGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-on-surface">{proficiency?.score ?? 0}%</span>
                <span className="text-[10px] text-on-surface-variant font-medium">proficiency</span>
              </div>
            </div>

            <div className="w-full space-y-2 border-t border-slate-100 pt-4">
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant font-medium">Topic Completion</span>
                <span className="font-bold text-on-surface">{completionPct}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${proficiency?.colorClass ?? "bg-primary"}`}
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <p className="text-[10px] text-on-surface-variant">{completedTopics.length} of {allTopics.length} topics completed</p>
            </div>
          </div>

          {/* Chapter breakdown */}
          <div className="lg:col-span-8 min-w-0 bg-white rounded-[28px] border border-outline-variant/15 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-sm text-on-surface">Chapter-wise Progress</h3>

            {chapters.length === 0 ? (
              <p className="text-xs text-on-surface-variant py-8 text-center">No chapters available for this subject yet.</p>
            ) : (
              <div className="space-y-4">
                {chapters.map((chapter) => {
                  const done = chapter.topics.filter((t) => mockTopicCompletion[t.slug]).length;
                  const total = chapter.topics.length;
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

                  return (
                    <div key={chapter.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg ${theme.light} ${theme.border} border flex items-center justify-center`}>
                            <span className={`material-symbols-outlined ${theme.text} text-[14px]`}>menu_book</span>
                          </div>
                          <span className="text-xs font-bold text-on-surface">{chapter.title}</span>
                        </div>
                        <span className={`text-xs font-bold ${theme.text}`}>{done}/{total}</span>
                      </div>

                      <div className="ml-9 space-y-2">
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${proficiency?.colorClass ?? "bg-primary"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        {/* Topic chips */}
                        <div className="flex flex-wrap gap-1.5">
                          {chapter.topics.map((topic) => {
                            const done = mockTopicCompletion[topic.slug];
                            return (
                              <button
                                key={topic.id}
                                onClick={() => router.push(`/learning/${topic.slug}`)}
                                className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${done
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                  : "bg-slate-50 text-on-surface-variant border-slate-200 hover:bg-slate-100"
                                  }`}
                              >
                                <span className="mr-1">{done ? "✓" : "○"}</span>
                                {topic.title}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Row 3: Weak Areas for this subject ──────────── */}
        {subjectWeaknesses.length > 0 && (
          <div className="bg-white rounded-[28px] border border-outline-variant/15 shadow-sm p-6 space-y-5">
            <div>
              <h3 className="font-bold text-sm text-on-surface">Maya-Identified Weak Areas</h3>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">Topics where more practice is recommended</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjectWeaknesses.map((w) => (
                <div key={w.id} className="flex items-center gap-4 p-4 bg-rose-50/60 border border-rose-100 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-white border border-rose-100 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-rose-400 text-[18px]">priority_high</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-on-surface truncate">{w.skillName}</p>
                    <div className="mt-1.5 w-full bg-rose-100 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-400 rounded-full" style={{ width: `${w.score}%` }} />
                    </div>
                    <p className="text-[10px] text-rose-500 font-semibold mt-0.5">{w.score}% proficiency</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Test History Log ─────────────────────────── */}
        <div className="bg-white rounded-[28px] border border-outline-variant/15 shadow-sm p-6 space-y-5">
          <div>
            <h3 className="font-bold text-sm text-on-surface">Test & Quiz Performance History</h3>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">Track your entry checks and chapter mastery milestones</p>
          </div>

          {testHistory.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-outline-variant/15">
              <span className="material-symbols-outlined text-[36px] text-outline/60">history_edu</span>
              <p className="text-xs text-on-surface-variant font-semibold mt-2">No tests completed for this subject yet.</p>
              <p className="text-[10px] text-outline font-medium mt-1">Start studying topics and attempt prerequisites or chapter-end tests to log results.</p>
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
                        Completed: {test.correct} of {test.total} correct answers
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
                    
                    <button
                      onClick={() => router.push(test.link)}
                      className="px-3.5 py-1.5 bg-white border border-outline-variant/30 text-on-surface hover:bg-primary/5 hover:border-primary/20 hover:text-primary font-bold rounded-xl text-[10px] flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[14px]">analytics</span>
                      <span>Review Details</span>
                    </button>
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
