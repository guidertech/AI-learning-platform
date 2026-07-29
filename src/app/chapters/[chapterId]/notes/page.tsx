"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import { createClient } from "@/lib/supabase/client";
import { FlipBookViewer } from "@/features/learning";

interface ChapterNotesPageProps {
  params: Promise<{ chapterId: string }>;
}

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  type: "overview" | "concepts" | "examples" | "summary";
  points: string[];
  keyFormula?: string;
  highlightBox?: string;
}

export default function ChapterNotesPPTPage({ params }: ChapterNotesPageProps) {
  const router = useRouter();
  const { chapterId } = use(params);

  const [chapter, setChapter] = useState<any>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<"pdf" | "ppt">("pdf");

  useEffect(() => {
    async function loadChapterDetails() {
      const supabase = createClient();
      try {
        const isNumeric = /^\d+$/.test(chapterId);
        let query = supabase.from("chapters").select("*, subjects(name)");
        if (isNumeric) {
          query = query.eq("chapter_id", parseInt(chapterId, 10));
        } else {
          query = query.eq("id", chapterId);
        }

        const { data: dbChapter } = await query.maybeSingle();

        if (dbChapter) {
          setChapter(dbChapter);

          if (dbChapter.chapter_notes && dbChapter.chapter_notes.trim() !== "") {
            setActiveTab("pdf");
          }

          const { data: topicsData } = await supabase
            .from("topics")
            .select("*")
            .eq("chapter_id", dbChapter.chapter_id)
            .order("order_index", { ascending: true });

          if (topicsData) {
            setTopics(topicsData);
          }
        }
      } catch (err) {
        console.error("Error loading chapter for notes:", err);
      } finally {
        setLoading(false);
      }
    }

    void loadChapterDetails();
  }, [chapterId]);

  const chapterTitle = chapter?.name || "Chapter Notes";
  const subjectName = chapter?.subjects?.name || "Subject";
  const topicList = topics.map((t) => t.topic_name || t.title);
  const pdfNotesUrl = chapter?.chapter_notes?.trim() || null;

  // Dynamic PPT slides
  const slides: Slide[] = [
    {
      id: 1,
      title: `${chapterTitle} — Chapter Overview`,
      subtitle: `${subjectName} · Class Curriculum Notes`,
      type: "overview",
      points: [
        `Welcome to the presentation notes for "${chapterTitle}".`,
        `This chapter covers ${topicList.length > 0 ? topicList.length : 3} key study topics in ${subjectName}.`,
        `Topics covered: ${topicList.length > 0 ? topicList.join(", ") : "Fundamental concepts, real-life applications, and practice exercises"}.`,
        "Master these notes to prepare for your chapter-end test!"
      ],
      highlightBox: `💡 Study Tip: Read each slide carefully and take notes in your notebook for better retention.`
    },
    {
      id: 2,
      title: "Core Concepts & Key Definitions",
      subtitle: "Fundamental Principles",
      type: "concepts",
      points: [
        `Understand the foundational rules of ${chapterTitle}.`,
        "Break down complex problems into step-by-step logical components.",
        "Remember key terminology and standard formulas used throughout the lesson.",
        "Pay attention to units, conditions, and special edge cases during calculations."
      ],
      keyFormula: chapterTitle.toLowerCase().includes("fraction")
        ? "Fraction = Numerator / Denominator  (e.g., 3/4)"
        : chapterTitle.toLowerCase().includes("math") || chapterTitle.toLowerCase().includes("गणित")
          ? "Total = Part A + Part B | Percentage = (Part / Total) × 100"
          : `Key Relation: ${chapterTitle} Principle Model`,
      highlightBox: "⚠️ Common Mistake: Always simplify your final answers and check calculations twice."
    },
    {
      id: 3,
      title: "Real-World Examples & Applications",
      subtitle: "Practical Usage",
      type: "examples",
      points: [
        `How "${chapterTitle}" applies in everyday scenarios and daily life.`,
        "Example 1: Measuring quantities, calculating ratios, or observing natural phenomena.",
        "Example 2: Applying logical steps to solve structured real-life questions.",
        "Visualizing concepts through diagrams and step-by-step problem breakdown."
      ],
      highlightBox: "🎯 Application Tip: Relate each concept to something you see around you at home or school."
    },
    {
      id: 4,
      title: "Summary & Revision Checklist",
      subtitle: "Quick Exam Recap",
      type: "summary",
      points: [
        `✅ Reviewed all ${topicList.length > 0 ? topicList.length : 3} topic lessons in ${chapterTitle}.`,
        "✅ Understood core formulas, definitions, and problem-solving methods.",
        "✅ Solved practice examples and identified key patterns.",
        "🚀 You are ready to attempt the Chapter-End Test!"
      ],
      highlightBox: "🏆 Next Step: Click 'Start Roadmap' or 'Take Chapter Test' to evaluate your learning!"
    }
  ];

  const currentSlide = slides[currentSlideIdx];

  const handleNextSlide = () => {
    if (currentSlideIdx < slides.length - 1) {
      setCurrentSlideIdx(currentSlideIdx + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIdx > 0) {
      setCurrentSlideIdx(currentSlideIdx - 1);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Topbar title="Chapter Notes" subtitle="Loading notes..." showBack={true} />
        <main className="p-8 max-w-[1100px] mx-auto w-full flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-on-surface-variant font-medium text-sm">Loading chapter notes & presentation...</p>
          </div>
        </main>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="h-[calc(100vh-10px)] md:h-screen flex flex-col overflow-hidden p-2 md:p-3 space-y-2 select-none w-full">

        {/* Navigation & Actions Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-on-surface text-xs font-bold transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back</span>
            </button>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {subjectName}
              </span>
              <h2 className="font-bold text-xs md:text-sm text-on-surface mt-0.5">{chapterTitle}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/chapters/${chapterId}`)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">map</span>
              <span>Roadmap</span>
            </button>

            <button
              onClick={() => router.push(`/quiz/chapter/${chapterId}`)}
              className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs shadow-md shadow-primary/20 transition-all cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">quiz</span>
              <span>Chapter Test</span>
            </button>
          </div>
        </div>

        {/* 100% NON-SCROLLABLE MAIN STAGE */}
        <div className="flex-1 min-h-0 relative w-full h-full">
          {activeTab === "pdf" && (
            pdfNotesUrl ? (
              <FlipBookViewer
                pdfUrl={pdfNotesUrl}
                title={`${chapterTitle} — Chapter Notes`}
                subjectName={subjectName}
              />
            ) : (
              /* PDF NOT AVAILABLE BEAUTIFUL EMPTY STATE */
              <div className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-14 shadow-sm text-center flex flex-col items-center justify-center space-y-5 max-w-2xl mx-auto my-4 h-full">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500/10 via-amber-500/10 to-rose-500/5 text-rose-500 flex items-center justify-center border border-rose-200/60 shadow-inner">
                  <span className="material-symbols-outlined text-4xl">picture_as_pdf</span>
                </div>

                <div className="space-y-2 max-w-md">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                    PDF Notes Status
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800">
                    Abhi PDF Available Nahi Hai
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
                    Is chapter ke liye database me PDF file ka link abhi tak add nahi kiya gaya hai. Admin dwara jald hi official PDF notes upload kar diye jayenge.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => router.push(`/chapters/${chapterId}`)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">map</span>
                    <span>Chapter Roadmap</span>
                  </button>
                </div>
              </div>
            )
          )}
        </div>

      </div>
    </PageContainer>
  );
}
