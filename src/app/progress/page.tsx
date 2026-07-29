"use client";

import React, { useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import { useLearning } from "@/context/LearningContext";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import { createClient } from "@/lib/supabase/client";
import {
  calculateSubjectTopicProgress,
  type SubjectTopicProgress,
} from "@/features/progress";

const englishText = (text: string) => text;

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

type SubjectRow = {subject_id: string; name: string; icon?: string};
type ChapterRow = {chapter_id: string; subject_id: string};
type TopicRow = {topic_id: string; chapter_id: string};
type ProgressRow = {topic_id: string; is_completed?: boolean; completed?: boolean};

export default function ProgressTrackerPage() {
  const labels = {
    title: englishText("Progress Tracker"), subtitle: englishText("__NAME__'s topic-wise learning progress overview"),
    currentClass: englishText("Current Class"), grade: englishText("Grade __GRADE__"),
    topicsCompleted: englishText("Topics Completed"), topicsCount: englishText("__COMPLETED__ / __TOTAL__ Topics"),
    learningCompletion: englishText("Learning Completion"), subjectWiseTitle: englishText("Subject-wise Topic Completion"),
    subjectWiseHelp: englishText("Select a subject to view completed and remaining topics by chapter."), topicProgress: englishText("Topic Progress"),
    compactTopicsCount: englishText("__COMPLETED__/__TOTAL__ Topics"), completed: englishText("Completed"),
    hindi: englishText("Hindi"), evs: englishText("Environmental Studies"), maths: englishText("Mathematics"), english: englishText("English"),
  };
  const router = useRouter();
  const { studentName, studentGrade, subjectProficiencies } = useLearning();

  const [subjectsProgress, setSubjectsProgress] = useState<SubjectTopicProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSystemTopics, setTotalSystemTopics] = useState(0);
  const [totalCompletedTopics, setTotalCompletedTopics] = useState(0);

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
          const { data: chaptersData } = await supabase.from("chapters").select("chapter_id, subject_id");
          const { data: topicsData } = await supabase.from("topics").select("topic_id, chapter_id");
          const { data: progressData } = await supabase
            .from("user_topic_progress")
            .select("*")
            .eq("user_id", user.id);

          const subjects = (subjectsData || []) as SubjectRow[];
          const chapters = (chaptersData || []) as ChapterRow[];
          const topics = (topicsData || []) as TopicRow[];
          const progress = (progressData || []) as ProgressRow[];

          if (subjects.length > 0) {
            const list = calculateSubjectTopicProgress(subjects, chapters, topics, progress);
            const overallTotal = list.reduce((total, subject) => total + subject.totalTopics, 0);
            const overallDone = list.reduce((total, subject) => total + subject.completedTopics, 0);

            setSubjectsProgress(list);
            setTotalSystemTopics(overallTotal);
            setTotalCompletedTopics(overallDone);
          }
        }
      } catch (error) {
        console.error("Error fetching progress tracker data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [studentGrade]);

  const fallbackOverallPct = totalSystemTopics > 0 
    ? Math.round((totalCompletedTopics / totalSystemTopics) * 100) 
    : 0;
  const gradeNumber = Number.parseInt(studentGrade.match(/\d+/)?.[0] ?? "5", 10);
  const localizedSubjectName = (name: string) => {
    const normalized = name.trim().toLowerCase();
    if (normalized === "hindi") return labels.hindi;
    if (normalized === "evs" || normalized.includes("environment")) return labels.evs;
    if (normalized === "maths" || normalized === "mathematics") return labels.maths;
    if (normalized === "english") return labels.english;
    return name;
  };

  if (loading) {
    return (
      <PageContainer>
        <Topbar
          title={labels.title}
          subtitle={labels.subtitle.replace("__NAME__", studentName)}
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
        title={labels.title}
        subtitle={labels.subtitle.replace("__NAME__", studentName)}
        showBack={true}
      />

      <main className="p-4 md:p-8 max-w-[1100px] mx-auto w-full space-y-6 overflow-hidden">

        {/* ── Summary Stats ─────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "school", label: labels.currentClass, value: labels.grade.replace("__GRADE__", String(gradeNumber)), color: "text-primary", bg: "bg-primary/8" },
            { icon: "checklist", label: labels.topicsCompleted, value: labels.topicsCount.replace("__COMPLETED__", String(totalCompletedTopics)).replace("__TOTAL__", String(totalSystemTopics)), color: "text-emerald-600", bg: "bg-emerald-50" },
            { icon: "donut_large", label: labels.learningCompletion, value: `${fallbackOverallPct}%`, color: "text-violet-600", bg: "bg-violet-50" },
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

        {/* ── Subject Topic Progress ───────────────────────── */}
        <div className="bg-white rounded-[28px] border border-outline-variant/15 shadow-sm p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm text-on-surface">{labels.subjectWiseTitle}</h3>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">{labels.subjectWiseHelp}</p>
            </div>
            <span className="text-[11px] font-bold text-primary bg-primary/8 px-3 py-1 rounded-full w-fit">
              {labels.topicProgress}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjectsProgress.map((sub, idx) => {
              const colorClass = subjectProficiencies.find(p => p.name === sub.name)?.colorClass || "bg-primary";
              const subjectId = sub.subject_id || subjectIdMap[sub.name];
              const icon = sub.icon || subjectIcons[sub.name] || "book";

              return (
                <div
                  key={idx}
                  onClick={() => subjectId && router.push(`/progress/${subjectId}`)}
                  className="bg-slate-50 rounded-2xl border border-slate-100 p-5 space-y-4 hover:border-primary/25 hover:bg-primary/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                      {labels.compactTopicsCount.replace("__COMPLETED__", String(sub.completedTopics)).replace("__TOTAL__", String(sub.totalTopics))}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-on-surface">{localizedSubjectName(sub.name)}</p>
                    <div className="mt-2 w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${colorClass} rounded-full transition-all duration-700`} style={{ width: `${sub.completionPct}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-on-surface">{sub.completionPct}%</p>
                      <p className="text-[10px] text-on-surface-variant font-medium">{labels.completed}</p>
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
