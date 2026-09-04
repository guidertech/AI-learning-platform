"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import EmptyState from "@/components/layout/EmptyState";
import { useLearning } from "@/context/LearningContext";
import FormattedMarkdown from "@/components/common/FormattedMarkdown";

interface PrereqRecoveryPageProps {
  params: Promise<{ chapterId: string }>;
}

export default function PrereqRecoveryPage({ params }: PrereqRecoveryPageProps) {
  const router = useRouter();
  const { chapterId } = use(params);
  const { initializeChatForTopic } = useLearning();

  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [chapterTitle, setChapterTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const [lessonData, setLessonData] = useState<any>(null);
  const [lessonLoading, setLessonLoading] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(`prereq_results_${chapterId}`);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        setChapterTitle(data.chapterTitle ?? "");
        const results = data.results ?? [];

        // Group results by topic to determine accuracy
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
          return pct < 70; // Weak topic threshold
        });

        setWeakTopics(weak);
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, [chapterId]);

  const currentTopic = weakTopics[currentIdx];

  // Fetch or retrieve lesson explanation
  useEffect(() => {
    if (!currentTopic) return;

    // Generate dynamic lesson from API
    async function loadDynamicLesson() {
      setLessonLoading(true);
      try {
        const studentGrade = localStorage.getItem("classorbit_student_grade") || "5";
        const res = await fetch(`/api/generate-prereq-lesson?topic=${encodeURIComponent(currentTopic)}&chapterId=${chapterId}&grade=${encodeURIComponent(studentGrade)}`);
        if (!res.ok) throw new Error("Failed to load lesson");
        const data = await res.json();
        setLessonData(data);
      } catch (err) {
        console.error(err);
        setLessonData({
          topic: currentTopic,
          title: `🌟 ${currentTopic} – Foundational Overview`,
          explanation: `Welcome! Below is a guide covering the fundamental concepts of **${currentTopic}** to prepare you for the chapter.`,
          example: `Step-by-step example for **${currentTopic}**.`,
          imageSrc: ""
        });
      } finally {
        setLessonLoading(false);
      }
    }

    loadDynamicLesson();
  }, [currentTopic, chapterId]);

  // Initialize Maya Chat when current topic or lessonData changes
  useEffect(() => {
    if (currentTopic && lessonData) {
      const promptText = `Hello! I noticed you had a bit of trouble with '${currentTopic}'. Let's break it down together! Feel free to ask me any questions about it!`;
      initializeChatForTopic(
        `Prerequisite Support: ${currentTopic}`,
        promptText
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTopic, lessonData]);

  if (loading) {
    return (
      <PageContainer>
        <Topbar title="Preparing Recovery..." />
        <main className="p-8 flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
      </PageContainer>
    );
  }

  if (weakTopics.length === 0) {
    return (
      <PageContainer>
        <Topbar title="Prerequisite Unlocked" subtitle={chapterTitle} />
        <main className="p-8 max-w-xl mx-auto text-center space-y-6">
          <EmptyState
            title="All Prerequisites Cleared!"
            description="You don't have any weak prerequisite topics for this chapter. You can proceed directly to the chapter roadmap."
            icon="workspace_premium"
          />
          <button
            onClick={() => router.push(`/chapters/${chapterId}`)}
            className="w-full h-12 bg-primary text-white font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Go to Chapter Roadmap</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </main>
      </PageContainer>
    );
  }

  const handleNext = () => {
    if (currentIdx + 1 < weakTopics.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Go to Recovery Test
      router.push(`/prerequisite/${chapterId}/recovery/test`);
    }
  };

  return (
    <PageContainer>
      <Topbar
        title="Concept Recovery Loop"
        subtitle={`Reviewing weak topics for ${chapterTitle}`}
        showBack={true}
      />

      <main className="flex flex-col h-[calc(100dvh-64px)] md:h-[calc(100dvh-80px)] overflow-hidden">
        <div className="flex-grow overflow-y-auto bg-[#f8f9ff] px-4 py-6 md:px-10 md:py-8">
          <div className="max-w-[720px] mx-auto space-y-6">

            {/* Recovery Progress Header */}
            <div className="bg-white rounded-2xl p-4 border border-outline-variant/15 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-outline uppercase tracking-wider">
                <span>Studying weak topic</span>
                <span className="text-primary">{currentIdx + 1} of {weakTopics.length}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${((currentIdx + 1) / weakTopics.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Lesson Card */}
            {lessonLoading ? (
              <section className="bg-white rounded-[28px] p-8 border border-outline-variant/15 shadow-sm flex flex-col items-center justify-center space-y-4 min-h-[300px]">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping"></div>
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-bold text-on-surface">Maya is preparing your support lesson...</p>
                  <p className="text-xs font-semibold text-outline">Generating custom explanation with clean markdown and tables for &quot;{currentTopic}&quot;.</p>
                </div>
              </section>
            ) : lessonData ? (
              <section className="bg-white rounded-[28px] p-6 md:p-8 border border-outline-variant/15 shadow-sm space-y-5">
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 text-primary uppercase tracking-wide">
                      📖 Support Lesson
                    </span>
                    <h2 className="font-display font-bold text-xl text-on-surface mt-1.5 flex items-center gap-2">
                      {lessonData.title}
                    </h2>
                  </div>
                </div>

                <div className="space-y-4">
                  <FormattedMarkdown content={lessonData.explanation} />

                  {lessonData.example && (
                    <div className="bg-slate-50 border border-outline-variant/20 p-4 rounded-2xl space-y-2 mt-4">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">Solved Example</span>
                      <FormattedMarkdown content={lessonData.example} />
                    </div>
                  )}
                </div>
              </section>
            ) : (
              <section className="bg-white rounded-[28px] p-6 border border-outline-variant/15 shadow-sm text-center">
                <p className="text-xs text-on-surface-variant font-medium">Preparing support lessons for {currentTopic}...</p>
              </section>
            )}

            {/* Action button */}
            <button
              onClick={handleNext}
              disabled={lessonLoading}
              className={`w-full h-12 bg-primary text-white font-bold rounded-2xl shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] hover:opacity-95 transition-all ${lessonLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              <span>{currentIdx + 1 < weakTopics.length ? "Next Weak Topic" : "Start Recovery Test"}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>

            <div className="h-28" />
          </div>
        </div>
      </main>
    </PageContainer>
  );
}
