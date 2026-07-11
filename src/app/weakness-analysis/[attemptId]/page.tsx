"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLearning } from "@/context/LearningContext";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import EmptyState from "@/components/layout/EmptyState";
import { mockChapters } from "@/lib/mock/chapters";
import { mockSubjects } from "@/lib/mock/subjects";

interface WeaknessAnalysisPageProps {
  params: Promise<{ attemptId: string }>;
}

export default function WeaknessAnalysisPage({ params }: WeaknessAnalysisPageProps) {
  const router = useRouter();
  const { attemptId } = use(params);

  const { studentName, weaknesses } = useLearning();
  const [activeTab, setActiveTab] = useState<"insights" | "records">("insights");

  const handleFixThis = () => {
    router.push("/recovery/mixed-numbers");
  };

  // Look up prerequisite status for each chapter
  const getPrereqStatus = (chId: string, hasPrereq?: boolean) => {
    if (!hasPrereq) return { label: "N/A", color: "bg-slate-100 text-slate-400 border-slate-200" };

    const recoveryPassed = sessionStorage.getItem(`prereq_recovery_passed_${chId}`) === "true";
    if (recoveryPassed) {
      return { label: "Cleared (via Recovery)", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    }

    const raw = sessionStorage.getItem(`prereq_results_${chId}`);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        const results = data.results ?? [];
        const total = results.length;
        const correct = results.filter((r: any) => r.isCorrect).length;
        const score = total > 0 ? Math.round((correct / total) * 100) : 0;
        if (score >= 70) {
          return { label: `Passed (${score}%)`, color: "bg-green-50 text-green-700 border-green-200" };
        } else {
          return { label: `Review Needed (${score}%)`, color: "bg-orange-50 text-orange-700 border-orange-200", action: true };
        }
      } catch (e) {
        console.error(e);
      }
    }

    return { label: "Not Attempted", color: "bg-slate-50 text-slate-500 border-slate-200" };
  };

  // Look up Chapter-End Test status for each chapter
  const getChapterEndStatus = (chId: string) => {
    const raw = sessionStorage.getItem(`chapter_end_results_${chId}`);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        const results = data.results ?? [];
        const total = results.length;
        const correct = results.filter((r: any) => r.isCorrect).length;
        const score = total > 0 ? Math.round((correct / total) * 100) : 0;
        if (score >= 70) {
          return { label: `Passed (${score}%)`, color: "bg-emerald-100 text-emerald-800 border-emerald-300" };
        } else {
          return { label: `Review Needed (${score}%)`, color: "bg-rose-100 text-rose-800 border-rose-300" };
        }
      } catch (e) {
        console.error(e);
      }
    }
    return { label: "Not Attempted", color: "bg-slate-50 text-slate-400 border-slate-200" };
  };

  // Flatten all chapters with subject info
  const allChaptersList: any[] = [];
  mockSubjects.forEach((sub) => {
    const chapters = mockChapters[sub.id] || [];
    chapters.forEach((ch) => {
      allChaptersList.push({
        ...ch,
        subjectName: sub.name,
        subjectId: sub.id
      });
    });
  });

  return (
    <PageContainer>
      <Topbar 
        title="🧠 Learning Gaps & Progress Tracker" 
        subtitle="Maya's study diagnosis based on latest diagnostic checks and chapter tests" 
      />

      <main className="p-8 max-w-[1200px] mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push("/dashboard")}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-primary">arrow_back</span>
            </button>
            <span className="text-xs font-bold text-outline uppercase tracking-wider">Back to Dashboard</span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 select-none">
            <button
              onClick={() => setActiveTab("insights")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "insights" ? "bg-white text-primary shadow-sm" : "text-outline hover:text-on-surface"
              }`}
            >
              Active Gaps & AI Insights
            </button>
            <button
              onClick={() => setActiveTab("records")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === "records" ? "bg-white text-primary shadow-sm" : "text-outline hover:text-on-surface"
              }`}
            >
              Prereq & Mastery Records
            </button>
          </div>
        </div>

        {activeTab === "insights" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
            
            {/* Left Column: Lists - 7 cols */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Strong Topics */}
              <section className="bg-white p-6 rounded-2xl border border-outline-variant/15 shadow-sm space-y-4">
                <div className="flex justify-between items-center select-none">
                  <h3 className="font-bold text-sm text-on-surface">Strong Topics</h3>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase">Mastered</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-xs text-on-surface-variant">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </div>
                    <span>Equivalent Fractions Concepts</span>
                  </li>
                  <li className="flex items-center gap-3 text-xs text-on-surface-variant">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </div>
                    <span>Simplifying Fractions</span>
                  </li>
                </ul>
              </section>

              {/* Focus Areas */}
              <section className="bg-white p-6 rounded-2xl border border-outline-variant/15 shadow-sm space-y-4">
                <div className="flex justify-between items-center select-none">
                  <h3 className="font-bold text-sm text-on-surface">Focus Areas</h3>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 uppercase">Review Needed</span>
                </div>
                {weaknesses.length === 0 ? (
                  <EmptyState 
                    title="No Focus Areas Identified" 
                    description="Great work! You have closed all identified learning gaps." 
                    icon="verified"
                  />
                ) : (
                  <ul className="space-y-4">
                    {weaknesses.map((w) => (
                      <li key={w.id} className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full border border-orange-400 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                          </div>
                          <span className="font-bold text-on-surface">{w.skillName}</span>
                        </div>
                        <p className="text-[11px] text-orange-700 bg-orange-50 p-2.5 rounded-lg ml-7 leading-relaxed font-medium">
                          Why it's tricky: {w.notes}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            {/* Right Column: Insights & Actions - 5 cols */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Insights card */}
              <section className="bg-[#F3F0FF] p-6 rounded-[28px] border border-primary/10 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/20">
                    <img 
                      alt="Maya" 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAX59yUFIdkA2OyIV-0z7-13MBmtWophJHBh2E0i2iSyPSELxOhpbB8fouRH2GTOMoFEA3lsR3fimuOyy6cp1c0Rxme0q6KXTAjNw6NS3cYtk4SyaMN7OTWiO99_55RllMsJtUecrAni7Jw1txtIb8tZjeCS0dtF59X-v-4QVkiEdQgVZsC8esS5cTwf4cTV-g1aSoUlEwBrTFgasyBp1DHnQR0XfQD1fu4Q6W_Brf22Mhjm4clHh1KuIIy1cMpBIp3IISLyxDLSeg"
                    />
                  </div>
                  <span className="font-bold text-sm text-primary">Maya's Insights</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  "Hi {studentName}! I noticed you're doing amazing with Equivalent Fractions, but you're getting a bit tripped up on how whole numbers and denominators multiply when solving Mixed Numbers. Let's practice with some visual pizza cut models!"
                </p>
              </section>

              {/* Let's Fix This Action Card */}
              {weaknesses.length > 0 && (
                <section className="bg-[#f0ecf8] p-6 rounded-[28px] border border-white space-y-4 text-center">
                  <h3 className="font-bold text-sm text-primary">Suggested Revision Plan</h3>
                  <div className="text-left bg-white/60 rounded-xl p-4 space-y-2 text-xs">
                    <p className="font-bold text-primary uppercase text-[9px] tracking-wider">Plan Outline:</p>
                    <ul className="text-on-surface-variant space-y-1.5">
                      <li>1. Pizza Sharing Analogy (3m)</li>
                      <li>2. Interactive Slice Quiz (2m)</li>
                    </ul>
                    <p className="font-bold text-[10px] text-on-surface mt-2">Total time: ~5 mins</p>
                  </div>
                  <button 
                    onClick={handleFixThis}
                    className="w-full h-12 bg-primary hover:bg-primary-container text-white font-bold rounded-xl active:scale-[0.98] transition-all flex flex-col items-center justify-center shadow-md cursor-pointer"
                  >
                    <span className="font-bold text-sm">Let's Fix This Together</span>
                    <span className="text-[9px] opacity-90 font-medium">Revise Now</span>
                  </button>
                </section>
              )}
            </div>

          </div>
        ) : (
          /* Tab 2: Prerequisite & Mastery Records Table */
          <div className="bg-white rounded-3xl border border-outline-variant/15 shadow-sm p-6 space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2 select-none">
              <div>
                <h3 className="font-bold text-sm text-on-surface">Curriculum Progress Records</h3>
                <p className="text-[10px] text-outline font-semibold uppercase mt-0.5">Track your Prerequisite Diagnostic Results and Chapter-End Mastery Levels</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/15 text-[10px] font-bold text-outline uppercase tracking-wider select-none">
                    <th className="pb-3 pl-2">Subject</th>
                    <th className="pb-3">Chapter</th>
                    <th className="pb-3 text-center">Prerequisite Diagnostic</th>
                    <th className="pb-3 text-center">Chapter-End Test</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-xs">
                  {allChaptersList.map((ch) => {
                    const prereq = getPrereqStatus(ch.id, ch.hasPrerequisite);
                    const chapterEnd = getChapterEndStatus(ch.id);

                    return (
                      <tr key={ch.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 pl-2 font-bold text-primary">{ch.subjectName}</td>
                        <td className="py-4">
                          <p className="font-bold text-on-surface">{ch.title}</p>
                          <p className="text-[10px] text-outline font-medium truncate max-w-[250px]">{ch.description}</p>
                        </td>
                        <td className="py-4 text-center">
                          <div className="inline-flex flex-col items-center gap-1.5">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-bold border ${prereq.color}`}>
                              {prereq.label}
                            </span>
                            {prereq.action && (
                              <button
                                onClick={() => router.push(`/prerequisite/${ch.id}/results`)}
                                className="text-[9px] font-bold text-primary hover:underline cursor-pointer"
                              >
                                View Weak Topics
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-bold border ${chapterEnd.color}`}>
                            {chapterEnd.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </PageContainer>
  );
}
