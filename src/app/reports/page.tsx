"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLearning } from "@/context/LearningContext";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import { createClient } from "@/lib/supabase/client";

// Map display name → subject page id
const subjectIdMap: Record<string, string> = {
  Mathematics: "sub-math",
  Science: "sub-sci",
  "Social Science": "sub-hist",
  English: "sub-eng",
};

const subjectIcons: Record<string, string> = {
  Mathematics: "calculate",
  Science: "science",
  "Social Science": "public",
  English: "menu_book",
};

const gradeLabel = (score: number, hasAttempted: boolean) => {
  if (!hasAttempted) return { label: "Not Attempted", color: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200" };
  if (score >= 85) return { label: "Excellent", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" };
  if (score >= 65) return { label: "Good", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" };
  if (score >= 40) return { label: "Improving", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
  return { label: "Needs Work", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" };
};

interface SubjectTestScore {
  subject_id: string;
  name: string;
  icon?: string;
  avgScore: number;
  totalTests: number;
  hasAttempted: boolean;
}

export default function ReportsPage() {
  const router = useRouter();
  const { studentName, studentGrade, subjectProficiencies } = useLearning();

  const [subjectTestScores, setSubjectTestScores] = useState<SubjectTestScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallAvgScore, setOverallAvgScore] = useState<number | null>(null);
  const [totalAttemptsCount, setTotalAttemptsCount] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: dbUser } = await supabase.from("users").select("class_id").eq("id", user.id).maybeSingle();
        let classId = dbUser?.class_id;

        if (!classId && studentGrade) {
          const classMatch = studentGrade.match(/\d+/);
          if (classMatch) {
            classId = parseInt(classMatch[0], 10);
          }
        }

        if (classId) {
          const { data: subjectsData } = await supabase.from("subjects").select("*").eq("class_id", classId);
          const { data: chaptersData } = await supabase.from("chapters").select("chapter_id, subject_id, id");
          const { data: attempts } = await supabase
            .from("quiz_attempts")
            .select("chapter_id, obtain_marks, total_marks")
            .eq("user_id", user.id);

          const validChapterCodes = new Set((chaptersData || []).map((c: any) => c.chapter_id));
          const rawAttempts = (attempts || []).filter((a: any) => validChapterCodes.has(a.chapter_id));
          
          // Keep unique latest attempt per chapter_id
          const uniqueMap = new Map<number, any>();
          rawAttempts.forEach((a: any) => {
            uniqueMap.set(a.chapter_id, a);
          });
          const attemptsList = Array.from(uniqueMap.values());
          setTotalAttemptsCount(attemptsList.length);

          if (attemptsList.length > 0) {
            let totalObtained = 0;
            let totalMax = 0;
            attemptsList.forEach((a: any) => {
              totalObtained += a.obtain_marks || 0;
              totalMax += a.total_marks || 0;
            });
            if (totalMax > 0) {
              setOverallAvgScore(Math.round((totalObtained / totalMax) * 100));
            }
          }

          if (subjectsData && subjectsData.length > 0) {
            const list: SubjectTestScore[] = subjectsData.map((sub: any) => {
              const subChapters = (chaptersData || []).filter((c: any) => c.subject_id === sub.subject_id);
              const subChapterCodes = subChapters.map((c: any) => c.chapter_id);

              const subAttempts = attemptsList.filter((a: any) => subChapterCodes.includes(a.chapter_id));

              let obtainedSum = 0;
              let totalSum = 0;
              subAttempts.forEach((a: any) => {
                obtainedSum += a.obtain_marks || 0;
                totalSum += a.total_marks || 0;
              });

              const hasAttempted = subAttempts.length > 0;
              const score = totalSum > 0 ? Math.round((obtainedSum / totalSum) * 100) : 0;

              return {
                subject_id: sub.subject_id,
                name: sub.name,
                icon: sub.icon,
                avgScore: score,
                totalTests: subAttempts.length,
                hasAttempted
              };
            });

            setSubjectTestScores(list);
          }
        }
      } catch (error) {
        console.error("Error fetching report test scores:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [studentGrade]);

  const displayAvgScore = overallAvgScore !== null ? overallAvgScore : 0;

  if (loading) {
    return (
      <PageContainer>
        <Topbar
          title="Test & Exam Reports"
          subtitle={`${studentName}'s chapter-end test score results`}
          showBack={true}
        />
        <main className="p-4 md:p-8 max-w-[1100px] mx-auto w-full space-y-6 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-2xl" />
            ))}
          </div>
          <div className="bg-white rounded-[28px] border border-outline-variant/15 p-6 space-y-5 animate-pulse">
            <div className="h-6 w-48 bg-slate-100 rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-44 bg-slate-100 rounded-2xl" />
              ))}
            </div>
          </div>
        </main>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Topbar
        title="Test & Exam Reports"
        subtitle={`${studentName}'s chapter-end test score results`}
        showBack={true}
      />

      <main className="p-4 md:p-8 max-w-[1100px] mx-auto w-full space-y-6 overflow-hidden">

        {/* ── Summary Cards ─────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "person", label: "Class", value: studentGrade, color: "text-primary", bg: "bg-primary/8" },
            { icon: "quiz", label: "Tests Attempted", value: `${totalAttemptsCount} Tests Completed`, color: "text-violet-600", bg: "bg-violet-50" },
            { icon: "star", label: "Avg. Test Score", value: `${displayAvgScore}%`, color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-outline-variant/15 shadow-sm p-5 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                <span className={`material-symbols-outlined ${s.color} text-[20px]`} style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">{s.label}</p>
                <p className="text-base font-bold text-on-surface">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Subject Test Scores Performance ───────────────────────── */}
        <div className="bg-white rounded-[28px] border border-outline-variant/15 shadow-sm p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm text-on-surface">Subject-wise Chapter End Test Score</h3>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">Click any subject to view detailed chapter end test results & scores</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 w-fit">
              Test & Exam Report
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjectTestScores.map((sub, idx) => {
              const score = sub.avgScore;
              const colorClass = subjectProficiencies.find(p => p.name === sub.name)?.colorClass || "bg-primary";
              
              const grade = gradeLabel(score, sub.hasAttempted);
              const subjectId = sub.subject_id || subjectIdMap[sub.name];
              const icon = sub.icon || subjectIcons[sub.name] || "book";
              
              return (
                <div
                  key={idx}
                  onClick={() => subjectId && router.push(`/reports/${subjectId}`)}
                  className="bg-slate-50 rounded-2xl border border-slate-100 p-5 space-y-4 hover:border-primary/25 hover:bg-primary/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${grade.color} ${grade.bg} ${grade.border}`}>
                      {grade.label}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-on-surface">{sub.name}</p>
                    <div className="mt-2 w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${colorClass} rounded-full transition-all duration-700`} style={{ width: `${sub.hasAttempted ? score : 0}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-on-surface">
                        {sub.hasAttempted ? `${score}%` : "0%"}
                      </p>
                      <p className="text-[10px] text-on-surface-variant font-medium">
                        {sub.totalTests > 0 ? `${sub.totalTests} Tests Logged` : "No test taken yet"}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-outline text-[18px] group-hover:text-primary transition-colors">arrow_forward</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </PageContainer>
  );
}
