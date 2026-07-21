"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLearning } from "@/context/LearningContext";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import ContinueLearningCard from "@/components/dashboard/ContinueLearningCard";
import QuickActions from "@/components/dashboard/QuickActions";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import { createClient } from "@/lib/supabase/client";
import { getLastLearning } from "@/lib/lastLearning";
import { calculateSubjectTopicProgress, SubjectTopicProgress } from "@/lib/subjectTopicProgress";

type ContinueLearningData = {
  subjectName: string;
  chapterTitle: string;
  topicTitle: string;
  percentComplete: number;
  resumeHref: string;
};

const subjectIdMap: Record<string, string> = {
  Mathematics: "sub-math",
  Science: "sub-sci",
  "Social Science": "sub-hist",
  English: "sub-eng",
  Hindi: "sub-hindi",
  "Environmental Studies": "sub-evs",
};

const getSubjectColor = (name: string, fallbackColor?: string) => {
  const norm = name.trim().toLowerCase();
  if (norm === "hindi") return "bg-primary";
  if (norm === "evs" || norm.includes("environment")) return "bg-[#0ea5e9]";
  if (norm === "maths" || norm.includes("math") || norm.includes("mathematics")) return "bg-[#f59e0b]";
  if (norm === "english") return "bg-[#10b981]";
  if (norm.includes("sci")) return "bg-purple-600";
  return fallbackColor || "bg-primary";
};

const getSubjectIconName = (name: string, icon?: string) => {
  if (icon) return icon;
  const norm = name.trim().toLowerCase();
  if (norm === "hindi") return "translate";
  if (norm === "evs" || norm.includes("environment")) return "eco";
  if (norm === "maths" || norm.includes("math") || norm.includes("mathematics")) return "calculate";
  if (norm === "english") return "menu_book";
  if (norm.includes("sci")) return "science";
  return "book";
};

const localizedSubjectName = (name: string) => {
  const norm = name.trim().toLowerCase();
  if (norm === "hindi") return "Hindi";
  if (norm === "evs" || norm.includes("environment")) return "Environmental Studies";
  if (norm === "maths" || norm.includes("math") || norm.includes("mathematics")) return "Mathematics";
  if (norm === "english") return "English";
  return name;
};

export default function DashboardPage() {
  const router = useRouter();
  const { studentName, percentComplete, activeSubject, activeChapter, activeTopic, subjectProficiencies, studentGrade } = useLearning();
  const [loading, setLoading] = useState(true);
  const [dbSubjects, setDbSubjects] = useState<SubjectTopicProgress[]>([]);
  const [lastLearning, setLastLearning] = useState<ContinueLearningData | null>(null);
  const [hasLearningHistory, setHasLearningHistory] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // 1. Fetch Subject Topics Progress (matching ProgressTrackerPage logic)
      try {
        const { data: dbUser } = await supabase.from("users").select("class_id").eq("id", user.id).maybeSingle();
        let classId = dbUser?.class_id;

        if (!classId && studentGrade) {
          const classMatch = studentGrade.match(/\d+/);
          if (classMatch) {
            classId = parseInt(classMatch[0], 10);
          }
        }
        if (!classId) classId = 5;

        const { data: subjectsData } = await supabase.from("subjects").select("*").eq("class_id", classId);
        const { data: chaptersData } = await supabase.from("chapters").select("chapter_id, subject_id");
        const { data: topicsData } = await supabase.from("topics").select("topic_id, chapter_id");
        const { data: progressData } = await supabase
          .from("user_topic_progress")
          .select("*")
          .eq("user_id", user.id);

        const subjects = (subjectsData || []) as any[];
        const chapters = (chaptersData || []) as any[];
        const topics = (topicsData || []) as any[];
        const progress = (progressData || []) as any[];

        if (subjects.length > 0) {
          const list = calculateSubjectTopicProgress(subjects, chapters, topics, progress);
          setDbSubjects(list);
        } else {
          const { data: fallbackSubjects } = await supabase.from("subjects").select("*");
          if (fallbackSubjects && fallbackSubjects.length > 0) {
            const list = calculateSubjectTopicProgress(fallbackSubjects, chapters, topics, progress);
            setDbSubjects(list);
          }
        }
      } catch (err) {
        console.error("Error fetching subject progress for dashboard:", err);
      }

      // 2. Fetch Last Learning Activity
      try {
        const lastLearningRow = await getLastLearning(supabase, user.id).catch(() => null);
        if (lastLearningRow) {
          setHasLearningHistory(true);
          let { data: lastSubject } = await supabase
            .from("subjects")
            .select("name")
            .eq("subject_id", lastLearningRow.subject_id)
            .maybeSingle();
          if (!lastSubject && !isNaN(Number(lastLearningRow.subject_id))) {
            const { data: subById } = await supabase
              .from("subjects")
              .select("name")
              .eq("id", Number(lastLearningRow.subject_id))
              .maybeSingle();
            lastSubject = subById;
          }

          let { data: lastChapter } = await supabase
            .from("chapters")
            .select("name")
            .eq("chapter_id", lastLearningRow.chapter_id)
            .maybeSingle();
          if (!lastChapter && !isNaN(Number(lastLearningRow.chapter_id))) {
            const { data: chById } = await supabase
              .from("chapters")
              .select("name")
              .eq("id", Number(lastLearningRow.chapter_id))
              .maybeSingle();
            lastChapter = chById;
          }

          let { data: lastTopic } = await supabase
            .from("topics")
            .select("topic_name, slug, topic_id")
            .eq("topic_id", lastLearningRow.topic_id)
            .maybeSingle();

          if (!lastTopic && !isNaN(Number(lastLearningRow.topic_id))) {
            const { data: topicById } = await supabase
              .from("topics")
              .select("topic_name, slug, topic_id")
              .eq("id", Number(lastLearningRow.topic_id))
              .maybeSingle();
            lastTopic = topicById;
          }

          if (lastSubject || lastChapter || lastTopic) {
            setLastLearning({
              subjectName: lastSubject?.name || activeSubject || "Curriculum",
              chapterTitle: lastChapter?.name || activeChapter || "Chapter Overview",
              topicTitle: lastTopic?.topic_name || activeTopic || "Topic Lesson",
              percentComplete: percentComplete || 0,
              resumeHref: lastTopic ? `/learning/${lastTopic.slug || lastTopic.topic_id}` : "/subjects",
            });
          }
        } else {
          setHasLearningHistory(false);
        }
      } catch (err) {
        console.error("Error fetching last learning:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [studentGrade]);

  const displaySubjects = dbSubjects.length > 0 ? dbSubjects : subjectProficiencies;

  return (
    <PageContainer>
      <Topbar
        title="Dashboard"
        subtitle={<>Welcome back, {studentName}!</>}
        showSearch={true}
      />

      <main className="p-4 md:p-8 max-w-300 mx-auto w-full space-y-6">
        {loading ? (
          <LoadingSkeleton type="dashboard" />
        ) : (
          <>
            {/* Continue Learning Card */}
            <ContinueLearningCard 
              subjectName={lastLearning?.subjectName ?? activeSubject}
              chapterTitle={lastLearning?.chapterTitle ?? activeChapter}
              topicTitle={lastLearning?.topicTitle ?? activeTopic}
              percentComplete={lastLearning?.percentComplete ?? percentComplete}
              resumeHref={lastLearning?.resumeHref ?? "/subjects"}
              hasLearningHistory={hasLearningHistory}
            />

            {/* Quick Actions Shortcuts */}
            <section className="space-y-3">
              <h3 className="font-bold text-sm text-on-surface pl-1">Quick Tools</h3>
              <QuickActions />
            </section>

            {/* Subject Analytics Overview section */}
            <section className="bg-white p-6 rounded-[28px] border border-outline-variant/15 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-on-surface">Subject Analytics Overview</h3>
                  <p className="text-xs text-on-surface-variant font-medium mt-0.5">Real-time topic progress per subject</p>
                </div>
                <button
                  onClick={() => router.push("/progress")}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View Detailed Progress <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
                {displaySubjects.map((sub: any, idx: number) => {
                  const score = sub.completionPct ?? sub.score ?? 0;
                  const colorClass = getSubjectColor(sub.name, subjectProficiencies.find(p => p.name === sub.name)?.colorClass);
                  const icon = getSubjectIconName(sub.name, sub.icon);
                  const subjectId = sub.subject_id || subjectIdMap[sub.name];
                  const hasTopicCounts = typeof sub.completedTopics === "number" && typeof sub.totalTopics === "number";

                  return (
                    <div
                      key={idx}
                      onClick={() => router.push(subjectId ? `/progress/${subjectId}` : "/progress")}
                      className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 space-y-3 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-center">
                        <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-xs">
                          <span className="material-symbols-outlined text-primary text-[18px]">{icon}</span>
                        </div>
                        {hasTopicCounts ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                            {sub.completedTopics}/{sub.totalTopics} Topics
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-primary bg-primary/8 px-2 py-0.5 rounded-full">
                            {score}%
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-bold text-on-surface truncate">{localizedSubjectName(sub.name)}</span>
                          <span className="text-xs font-bold text-on-surface">{score}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colorClass} rounded-full transition-all duration-700`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>
    </PageContainer>
  );
}


