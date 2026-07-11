"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import EmptyState from "@/components/layout/EmptyState";
import { mockChapters } from "@/lib/mock/chapters";
import { mockSubjects } from "@/lib/mock/subjects";
import { useLearning } from "@/context/LearningContext";
import { getChapterQuiz } from "@/lib/mock/chapterQuizzes";

interface ChapterDetailPageProps {
  params: Promise<{ chapterId: string }>;
}

export default function ChapterDetailPage({ params }: ChapterDetailPageProps) {
  const router = useRouter();
  const { chapterId } = use(params);

  const { setActiveChapter, setActiveSubject } = useLearning();
  const [checkingPrereq, setCheckingPrereq] = useState(true);
  const [prereqScore, setPrereqScore] = useState<number | null>(null);

  // Search for the chapter across all subjects
  let foundChapter: any = null;
  let subjectId = "";

  for (const subId in mockChapters) {
    const ch = mockChapters[subId].find((c) => c.id === chapterId);
    if (ch) {
      foundChapter = ch;
      subjectId = subId;
      break;
    }
  }

  useEffect(() => {
    if (foundChapter) {
      setActiveChapter(foundChapter.title);
      const subject = mockSubjects.find((s) => s.id === subjectId);
      if (subject) {
        setActiveSubject(subject.name);
      }
    }
  }, [foundChapter, subjectId, setActiveChapter, setActiveSubject]);

  useEffect(() => {
    if (!foundChapter) return;

    const quizData = getChapterQuiz(chapterId);
    if (!foundChapter.hasPrerequisite || !quizData || !quizData.prerequisite || quizData.prerequisite.length === 0) {
      setCheckingPrereq(false);
      return;
    }

    // Check if they passed the prerequisite recovery retest
    const recoveryPassed = sessionStorage.getItem(`prereq_recovery_passed_${chapterId}`) === "true";
    if (recoveryPassed) {
      setCheckingPrereq(false);
      return;
    }

    const raw = sessionStorage.getItem(`prereq_results_${chapterId}`);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        const results = data.results ?? [];
        const total = results.length;
        const correct = results.filter((r: any) => r.isCorrect).length;
        const score = total > 0 ? Math.round((correct / total) * 100) : 0;
        if (score >= 70) {
          setCheckingPrereq(false);
          return;
        } else {
          // Redirect them to results page to review lessons
          router.replace(`/prerequisite/${chapterId}/results`);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    router.replace(`/prerequisite/${chapterId}`);
  }, [chapterId, router, foundChapter]);

  useEffect(() => {
    const raw = sessionStorage.getItem(`prereq_results_${chapterId}`);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        const results = data.results ?? [];
        const total = results.length;
        const correct = results.filter((r: any) => r.isCorrect).length;
        const score = total > 0 ? Math.round((correct / total) * 100) : 0;
        setPrereqScore(score);
      } catch (e) {
        console.error(e);
      }
    }
  }, [chapterId]);

  if (!foundChapter) {
    return (
      <PageContainer>
        <Topbar title="Chapter Roadmap" />
        <main className="p-8">
          <EmptyState 
            title="Chapter Not Found" 
            description="The selected chapter study roadmap could not be loaded." 
            icon="error"
          />
        </main>
      </PageContainer>
    );
  }

  if (checkingPrereq) {
    return (
      <PageContainer>
        <Topbar title="Loading..." subtitle="Checking prerequisites" />
        <main className="p-8 flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Topbar 
        title={foundChapter.title} 
        subtitle="Complete topics to unlock the next chapter milestones" 
      />

      <main className="p-8 max-w-[1200px] mx-auto w-full space-y-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push(`/subjects/${subjectId}/chapters`)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <span className="text-xs font-bold text-outline uppercase tracking-wider">Back to Chapters</span>
        </div>

        {prereqScore !== null && (
          <div className="bg-white p-5 rounded-[24px] border border-emerald-100 bg-emerald-50/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-on-surface">Prerequisite Test Cleared!</h4>
                <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">
                  You scored <span className="font-bold text-emerald-600">{prereqScore}%</span> on the entry test. You can review your detailed breakdown anytime.
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push(`/prerequisite/${chapterId}/results`)}
              className="px-4 py-2 border border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-600 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">analytics</span>
              <span>Review Results</span>
            </button>
          </div>
        )}

        {/* Topics outline list */}
        <section className="bg-white p-6 rounded-[28px] border border-outline-variant/15 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-on-surface mb-2 pl-1">Syllabus Outline</h3>
          
          <div className="space-y-3 select-none">
             {foundChapter.topics.map((top: any, idx: number) => (
              <div 
                key={top.id}
                onClick={() => router.push(`/learning/${top.slug}`)}
                className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-primary-container/5 rounded-2xl border border-outline-variant/10 hover:border-primary/20 transition-all cursor-pointer group active:scale-[0.99]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-on-surface group-hover:text-primary transition-colors">
                      {top.title}
                    </h4>
                    <p className="text-[10px] text-outline font-semibold uppercase tracking-wider mt-0.5">Socrates Enabled</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-all text-[20px]">
                  chevron_right
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PageContainer>
  );
}
