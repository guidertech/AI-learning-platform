"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useLearning } from "@/context/LearningContext";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import { mockSubjectProficiencies } from "@/lib/mock/progress";

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

const gradeLabel = (score: number) => {
  if (score >= 85) return { label: "Excellent", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" };
  if (score >= 65) return { label: "Good", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" };
  if (score >= 40) return { label: "Improving", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
  return { label: "Needs Work", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" };
};

export default function ProgressPage() {
  const router = useRouter();
  const { studentName, studentGrade, percentComplete, weaknesses } = useLearning();

  const avgScore = Math.round(
    mockSubjectProficiencies.reduce((s, p) => s + p.score, 0) / mockSubjectProficiencies.length
  );

  return (
    <PageContainer>
      <Topbar
        title="Progress & Reports"
        subtitle={`${studentName}'s learning progress overview`}
        showBack={true}
      />

      <main className="p-4 md:p-8 max-w-[1100px] mx-auto w-full space-y-6 overflow-hidden">

        {/* ── Summary Cards ─────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "person", label: "Class", value: studentGrade, color: "text-primary", bg: "bg-primary/8" },
            { icon: "trending_up", label: "Overall Progress", value: `${percentComplete}%`, color: "text-violet-600", bg: "bg-violet-50" },
            { icon: "star", label: "Avg. Score", value: `${avgScore}%`, color: "text-emerald-600", bg: "bg-emerald-50" },
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

        {/* ── Subject Proficiency ───────────────────────── */}
        <div className="bg-white rounded-[28px] border border-outline-variant/15 shadow-sm p-6 space-y-5">
          <div>
            <h3 className="font-bold text-sm text-on-surface">Subject-wise Performance</h3>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">Click any subject to view detailed chapter report</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockSubjectProficiencies.map((sub, idx) => {
              const grade = gradeLabel(sub.score);
              const subjectId = subjectIdMap[sub.name];
              return (
                <div
                  key={idx}
                  onClick={() => subjectId && router.push(`/progress/${subjectId}`)}
                  className="bg-slate-50 rounded-2xl border border-slate-100 p-5 space-y-4 hover:border-primary/25 hover:bg-primary/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-primary text-[20px]">{subjectIcons[sub.name] || "book"}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${grade.color} ${grade.bg} ${grade.border}`}>
                      {grade.label}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-on-surface">{sub.name}</p>
                    <div className="mt-2 w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${sub.colorClass} rounded-full transition-all duration-700`} style={{ width: `${sub.score}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-on-surface">{sub.score}<span className="text-xs text-on-surface-variant font-medium">%</span></p>
                    <span className="material-symbols-outlined text-outline text-[18px] group-hover:text-primary transition-colors">arrow_forward</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Weak Areas ───────────────────────────────── */}
        {weaknesses.length > 0 && (
          <div className="bg-white rounded-[28px] border border-outline-variant/15 shadow-sm p-6 space-y-5">
            <div>
              <h3 className="font-bold text-sm text-on-surface">Areas Needing Attention</h3>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">Maya has identified these topics where more practice is recommended</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {weaknesses.map((w) => (
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

      </main>
    </PageContainer>
  );
}
