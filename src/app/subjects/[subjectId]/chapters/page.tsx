"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import EmptyState from "@/components/layout/EmptyState";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";

import { useLearning } from "@/context/LearningContext";
import { createClient } from "@/lib/supabase/client";

import { getChapterQuiz } from "@/features/curriculum/data/chapterQuizzes";

interface ChaptersPageProps {
  params: Promise<{ subjectId: string }>;
}



export default function SubjectChaptersPage({ params }: ChaptersPageProps) {
  const router = useRouter();
  const { subjectId } = use(params);
  const { setActiveSubject } = useLearning();

  const [subject, setSubject] = useState<any>(null);
  const [dbChapters, setDbChapters] = useState<any[]>([]);
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
          setActiveSubject(dbSubject.name);
          
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
              
            const chaptersWithTopics = chaptersData.map((ch: any) => ({
              ...ch,
              topics: dbTopics?.filter((t: any) => t.chapter_id === ch.chapter_id) || []
            }));
            
            setDbChapters(chaptersWithTopics);
          } else if (chaptersData) {
            setDbChapters(chaptersData.map((ch: any) => ({ ...ch, topics: [] })));
          }
        }
      } catch (error) {
        console.error("Error loading subject:", error);
      } finally {
        setLoading(false);
      }
    }
    void loadSubject();
  }, [subjectId, setActiveSubject]);

  const subjectName = subject?.name || "Subject Details";
  
  const chapters = dbChapters.map((ch: any) => {
    const sortedDbTopics = [...(ch.topics || [])].sort((a: any, b: any) => a.order_index - b.order_index);
    const chTopics = sortedDbTopics.map((t: any) => ({
      ...t,
      title: t.topic_name,
      slug: t.topic_id?.toString()
    }));
    return {
      id: ch.id,
      title: ch.name,
      description: ch.description,
      hasPrerequisite: ch.requires_prerequisite,
      prerequisiteCompleted: ch.prerequisite_completed,
      chapter_notes: ch.chapter_notes,
      topics: chTopics
    };
  });

  const handleChapterClick = (chId: string) => {
    const chObj = chapters.find((c) => c.id === chId);
    const quizData = getChapterQuiz(chId);
    
    if (chObj?.hasPrerequisite) {
      if (chObj.prerequisiteCompleted) {
        router.push(`/chapters/${chId}`);
        return;
      }

      const recoveryPassed = sessionStorage.getItem(`prereq_recovery_passed_${chId}`) === "true";
      if (recoveryPassed) {
        router.push(`/chapters/${chId}`);
        return;
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
            router.push(`/chapters/${chId}`);
            return;
          } else {
            router.push(`/prerequisite/${chId}/results`);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      router.push(`/prerequisite/${chId}`);
    } else {
      router.push(`/chapters/${chId}`);
    }
  };

  return (
    <PageContainer>
      <Topbar 
        title={`${subjectName} Chapters`} 
        subtitle="Select a chapter to review its study roadmap" 
        showSearch={true} 
      />

      <main className="p-8 max-w-[1200px] mx-auto w-full space-y-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push("/subjects")}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <span className="text-xs font-bold text-outline uppercase tracking-wider">Back to subjects</span>
        </div>

        {loading ? (
          <LoadingSkeleton type="chapters" />
        ) : chapters.length === 0 ? (
          <EmptyState 
            title="No Chapters Available" 
            description="There are currently no chapters or topics assigned to this subject curriculum." 
            icon="menu_book"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
            {chapters.map((ch) => (
              <div 
                key={ch.id}
                onClick={() => handleChapterClick(ch.id)}
                className="bg-white p-6 rounded-3xl border border-outline-variant/15 hover:border-primary/40 shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98] flex flex-col justify-between h-44 group"
              >
                <div>
                  <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Roadmap Syllabus</span>
                  <h3 className="font-bold text-base text-on-surface mt-1 group-hover:text-primary transition-colors">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium mt-1 leading-relaxed line-clamp-2">
                    {ch.description}
                  </p>
                </div>
                <div className="flex justify-between items-center border-t border-slate-50 pt-3 gap-2">
                  <span className="text-[10px] text-outline font-semibold">{ch.topics.length} Study Topics</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/chapters/${ch.id}/notes`);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200/60 text-xs font-bold transition-all cursor-pointer active:scale-95"
                      title="View Chapter Notes & PPT"
                    >
                      <span className="material-symbols-outlined text-[15px]">slideshow</span>
                      <span>Notes (PPT)</span>
                    </button>

                    <span className="text-xs text-primary font-bold flex items-center gap-1">
                      Start Roadmap <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </PageContainer>
  );
}
