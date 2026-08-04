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
import SubjectIcon from "@/components/SubjectIcon";

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
  const { studentName, studentGrade, studentSchool, subjectProficiencies } = useLearning();

  const [subjectsProgress, setSubjectsProgress] = useState<SubjectTopicProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSystemTopics, setTotalSystemTopics] = useState(0);
  const [totalCompletedTopics, setTotalCompletedTopics] = useState(0);
  const [xp, setXp] = useState(0);
  const [completedChaptersCount, setCompletedChaptersCount] = useState(0);

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

            // Filter out completed topics
            const completedTopicIds = new Set(
              progress
                .filter((p: any) => p.completed === true || p.is_completed === true)
                .map((p: any) => p.topic_id)
            );

            // Group topics by chapter_id
            const chapterTopicMap = new Map<string, string[]>();
            topics.forEach((t: any) => {
              const list = chapterTopicMap.get(t.chapter_id) || [];
              list.push(t.topic_id);
              chapterTopicMap.set(t.chapter_id, list);
            });

            // Count chapters that are fully completed (all topics completed)
            let doneChaptersCount = 0;
            chapterTopicMap.forEach((topicIds, chapterId) => {
              if (topicIds.length > 0) {
                const allCompleted = topicIds.every((tid) => completedTopicIds.has(tid));
                if (allCompleted) {
                  doneChaptersCount++;
                }
              }
            });

            const computedXp = completedTopicIds.size * 5 + doneChaptersCount * 20;
            setXp(computedXp);
            setCompletedChaptersCount(doneChaptersCount);
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

        {/* Helper function to compute level details */}
        {(() => {
          const calculateLevelAndProgress = (xpVal: number) => {
            if (xpVal < 40) {
              return {
                level: 0,
                xpInCurrentLevel: xpVal,
                xpRequiredForNextLevel: 40,
                percentage: Math.round((xpVal / 40) * 100),
              };
            }
            const level = Math.floor(Math.log2(xpVal / 40)) + 1;
            const currentLevelThreshold = 40 * Math.pow(2, level - 1);
            const nextLevelThreshold = 40 * Math.pow(2, level);
            const range = nextLevelThreshold - currentLevelThreshold;
            const progress = xpVal - currentLevelThreshold;
            const percentage = Math.round((progress / range) * 100);
            return {
              level,
              xpInCurrentLevel: progress,
              xpRequiredForNextLevel: range,
              percentage,
            };
          };

          const levelInfo = calculateLevelAndProgress(xp);

          return (
            <div className="space-y-6">
              
              {/* Sleek Horizontal Level Header Bar (Not a Card) */}
              <div className="bg-slate-50 border border-slate-200/50 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-3xs select-none">
                
                {/* Glowing Golden Round Level Badge */}
                <div className="relative shrink-0 w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 p-[3px] shadow-[0_8px_24px_rgba(245,158,11,0.18)] flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center text-primary font-bold">
                    <span className="text-[10px] text-amber-600 font-extrabold uppercase tracking-widest leading-none">Level</span>
                    <span className="text-2xl font-black text-slate-800 leading-none mt-1">{levelInfo.level}</span>
                  </div>
                  <span className="absolute -top-3 text-[18px] animate-bounce">👑</span>
                </div>

                {/* Progress Details & Bar */}
                <div className="grow w-full space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h3 className="font-bold text-sm text-slate-800">Learning Level & Experience</h3>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                        Keep completing topics and chapters to unlock new levels!
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-xs font-black text-primary block">{xp} XP Total</span>
                      <span className="text-[9px] text-slate-400 font-bold block">
                        {levelInfo.xpInCurrentLevel} / {levelInfo.xpRequiredForNextLevel} XP to Level {levelInfo.level + 1}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal visual progress bar */}
                  <div className="relative w-full bg-slate-200/80 h-3 rounded-full overflow-hidden border border-slate-300/10 shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(245,158,11,0.25)]" 
                      style={{ width: `${levelInfo.percentage}%` }} 
                    />
                  </div>
                </div>

              </div>

              {/* Summary Stats Grid (Reverted back to clean 3 columns) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 select-none">
                {[
                  { 
                    icon: "school", 
                    label: labels.currentClass, 
                    value: labels.grade.replace("__GRADE__", String(gradeNumber)), 
                    subText: studentSchool || "No school specified",
                    cardStyle: "bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-400/80 shadow-[0_8px_20px_rgba(59,130,246,0.12)] text-white" 
                  },
                  { 
                    icon: "checklist", 
                    label: labels.topicsCompleted, 
                    value: labels.topicsCount.replace("__COMPLETED__", String(totalCompletedTopics)).replace("__TOTAL__", String(totalSystemTopics)), 
                    subText: `${completedChaptersCount} chapters fully completed`,
                    cardStyle: "bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400/80 shadow-[0_8px_20px_rgba(16,185,129,0.12)] text-white" 
                  },
                  { 
                    icon: "donut_large", 
                    label: labels.learningCompletion, 
                    value: `${fallbackOverallPct}%`, 
                    subText: "Syllabus completed",
                    cardStyle: "bg-gradient-to-br from-purple-500 to-indigo-600 border-purple-400/80 shadow-[0_8px_20px_rgba(139,92,246,0.12)] text-white" 
                  },
                ].map((s) => (
                  <div key={s.label} className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 ${s.cardStyle}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/25 flex items-center justify-center shrink-0 text-white">
                        <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider">{s.label}</p>
                        <p className="text-base font-bold text-white">{s.value}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-white/80 font-medium truncate mt-4 pt-1.5 border-t border-white/10">
                      {s.subText}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          );
        })()}

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
                    <div className="w-18 h-18 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                      <SubjectIcon icon={sub.icon} sizeClassName="text-[60px]" fallbackIcon={subjectIcons[sub.name] || "book"} />
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
