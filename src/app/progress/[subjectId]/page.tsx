"use client";

import React, { use, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import { useLearning } from "@/context/LearningContext";
import { createClient } from "@/lib/supabase/client";
import SubjectIcon from "@/components/SubjectIcon";

// Fallback topic completion map for demonstration/mock topics
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

interface SubjectProgressPageProps {
  params: Promise<{ subjectId: string }>;
}

export default function SubjectProgressPage({ params }: SubjectProgressPageProps) {
  const router = useRouter();
  const { subjectProficiencies } = useLearning();
  const { subjectId } = use(params);

  const [subject, setSubject] = useState<any>(null);
  const [dbChapters, setDbChapters] = useState<any[]>([]);
  const [completedTopicIds, setCompletedTopicIds] = useState<Set<string>>(new Set());
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
              const { data: topicProgress } = await supabase
                .from("user_topic_progress")
                .select("*")
                .eq("user_id", user.id);

              const ids = new Set<string>(
                (topicProgress || [])
                  .filter((row: any) => row.is_completed === true || row.completed === true)
                  .map((row: any) => String(row.topic_id)),
              );
              setCompletedTopicIds(ids);
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
          router.push("/progress");
        }
      } catch (error) {
        console.error("Error loading subject progress:", error);
      } finally {
        setLoading(false);
      }
    }
    void loadSubject();
  }, [subjectId, router]);

  const mappedMockId = subject ? subjectNameMap[subject.name] : null;
  const theme = mappedMockId ? subjectTheme[mappedMockId] : subjectTheme["sub-math"];

  const chapters = useMemo(() => {
    return dbChapters.map(ch => {
      const sortedDbTopics = [...(ch.topics || [])].sort((a: any, b: any) => a.order_index - b.order_index);
      const chTopics = sortedDbTopics.map((t: any) => ({
        ...t,
        title: t.topic_name,
        slug: t.topic_id?.toString()
      }));
      return {
        id: ch.id,
        chapterCode: ch.chapter_id,
        title: ch.name,
        topics: chTopics
      };
    });
  }, [dbChapters]);

  const proficiency = subject ? subjectProficiencies.find((p) => p.name === subject.name) : undefined;

  // Compute chapter/topic stats
  const allTopics = chapters.flatMap((ch) => ch.topics);

  const isTopicDone = (topic: any) => {
    if (completedTopicIds.has(topic.slug) || completedTopicIds.has(topic.id?.toString())) {
      return true;
    }
    if (topic.slug && mockTopicCompletion[topic.slug]) {
      return true;
    }
    return false;
  };

  const completedTopicsCount = allTopics.filter(isTopicDone).length;
  const completionPct = allTopics.length > 0 ? Math.round((completedTopicsCount / allTopics.length) * 100) : 0;

  if (loading) {
    return (
      <PageContainer>
        <Topbar
          title="Progress Tracker"
          subtitle="Topic-wise learning progress details"
          showBack={true}
        />
        <main className="p-4 md:p-8 max-w-[1200px] mx-auto w-full flex justify-center items-center h-64">
          <p className="text-on-surface-variant text-sm font-medium">Loading topic progress...</p>
        </main>
      </PageContainer>
    );
  }

  if (!subject) return null;

  return (
    <PageContainer>
      <Topbar
        title={`${subject.name} — Progress Tracker`}
        subtitle="Detailed topic completion status for each chapter"
        showBack={true}
      />

      <main className="p-4 md:p-8 max-w-[1200px] mx-auto w-full space-y-6 overflow-hidden">

        {/* ── Hero Banner ─────────────────────────────────── */}
        <div className={`bg-gradient-to-r ${theme?.gradient || 'from-slate-500 to-slate-400'} rounded-[28px] p-7 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
              <SubjectIcon 
                icon={subject.icon} 
                sizeClassName="text-[54px]" 
                className={theme?.text || "text-primary"} 
              />
            </div>
            <div>
              <p className="text-white/70 text-xs font-bold uppercase tracking-wider">Topic Progress Tracker</p>
              <h1 className="text-2xl font-bold">{subject.name}</h1>
              <p className="text-white/80 text-sm mt-0.5">{chapters.length} chapters · {allTopics.length} total topics</p>
            </div>
          </div>

          <div className="flex gap-6">
            {[
              { label: "Topics Completed", value: `${completedTopicsCount}/${allTopics.length}` },
              { label: "Completion Pct", value: `${completionPct}%` },
              { label: "Chapters", value: `${chapters.length}` },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Chapter-wise Topic Progress Checklist ────────────────────────── */}
        <div className="bg-white rounded-[28px] border border-outline-variant/15 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="font-bold text-base text-on-surface">Chapter-wise Topics Checklist</h3>
            <p className="text-xs text-on-surface-variant font-medium mt-0.5">
              Review completed topics (<span className="text-emerald-600 font-bold">✓ Completed</span>) and pending topics (<span className="text-amber-600 font-bold">○ Pending</span>). Click any topic to study!
            </p>
          </div>

          {chapters.length === 0 ? (
            <p className="text-xs text-on-surface-variant py-8 text-center">No chapters available for this subject yet.</p>
          ) : (
            <div className="space-y-6">
              {chapters.map((chapter) => {
                const doneCount = chapter.topics.filter(isTopicDone).length;
                const totalCount = chapter.topics.length;
                const chPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

                return (
                  <div key={chapter.id} className="bg-slate-50/60 rounded-2xl border border-slate-100 p-5 space-y-4">
                    {/* Chapter Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${theme.light} ${theme.border} border flex items-center justify-center`}>
                          <span className={`material-symbols-outlined ${theme.text} text-[18px]`}>menu_book</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-on-surface">{chapter.title}</h4>
                          <p className="text-[11px] text-on-surface-variant font-medium">
                            {doneCount} of {totalCount} topics completed ({chPct}%)
                          </p>
                        </div>
                      </div>

                      <div className="w-full sm:w-48 bg-slate-200 h-2 rounded-full overflow-hidden self-center">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${proficiency?.colorClass ?? "bg-primary"}`}
                          style={{ width: `${chPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Topics Grid */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Topics in this chapter:</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {chapter.topics.map((topic) => {
                          const done = isTopicDone(topic);
                          return (
                            <div
                              key={topic.id}
                              onClick={() => router.push(`/learning/${topic.slug}`)}
                              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer group ${
                                done
                                  ? "bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100/80"
                                  : "bg-white border-slate-200 hover:border-primary/30 hover:bg-primary/5"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                  done ? "bg-emerald-600 text-white" : "border-2 border-slate-300 text-slate-400 group-hover:border-primary group-hover:text-primary"
                                }`}>
                                  <span className="material-symbols-outlined text-[14px]">
                                    {done ? "check" : "radio_button_unchecked"}
                                  </span>
                                </div>
                                <div>
                                  <p className={`text-xs font-bold ${done ? "text-emerald-900" : "text-on-surface"}`}>
                                    {topic.title}
                                  </p>
                                  <p className="text-[10px] text-on-surface-variant/80 font-medium mt-0.5">
                                    {done ? "Completed" : "Not studied yet — Click to learn"}
                                  </p>
                                </div>
                              </div>

                              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                                done
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                  : "bg-slate-100 text-slate-600 border-slate-200 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20"
                              }`}>
                                {done ? "Completed ✓" : "Start Learning →"}
                              </span>
                            </div>
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

      </main>
    </PageContainer>
  );
}
