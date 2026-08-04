"use client";

import React, { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLearning } from "@/context/LearningContext";
import { QuizQuestion } from "@/types/quiz";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import { QuizProgress, QuestionCard, OptionCard } from "@/features/curriculum";
import { createClient } from "@/lib/supabase/client";
import { getLastLearning } from "@/features/learning";
import Confetti from "@/components/layout/Confetti";
import SubjectIcon from "@/components/SubjectIcon";

interface QuizPageProps {
  params: Promise<{ quizId: string }>;
}

interface ExtendedQuizQuestion extends QuizQuestion {
  advice?: string;
}

const SUBJECT_COLORS = [
  "bg-primary text-white",
  "bg-[#0ea5e9] text-white",
  "bg-[#f59e0b] text-white",
  "bg-[#10b981] text-white",
  "bg-[#ec4899] text-white",
  "bg-[#8b5cf6] text-white",
];

const SUBJECT_GLOWS = [
  {
    hoverBorder: "hover:border-[#5341cd]/30",
    hoverBg: "hover:bg-[#5341cd]/2",
    hoverShadow: "hover:shadow-[0_16px_32px_rgba(83,65,205,0.14)]",
    textClass: "text-[#5341cd]"
  },
  {
    hoverBorder: "hover:border-[#0ea5e9]/30",
    hoverBg: "hover:bg-[#0ea5e9]/2",
    hoverShadow: "hover:shadow-[0_16px_32px_rgba(14,165,233,0.14)]",
    textClass: "text-[#0ea5e9]"
  },
  {
    hoverBorder: "hover:border-[#f59e0b]/30",
    hoverBg: "hover:bg-[#f59e0b]/2",
    hoverShadow: "hover:shadow-[0_16px_32px_rgba(245,158,11,0.14)]",
    textClass: "text-[#f59e0b]"
  },
  {
    hoverBorder: "hover:border-[#10b981]/30",
    hoverBg: "hover:bg-[#10b981]/2",
    hoverShadow: "hover:shadow-[0_16px_32px_rgba(16,185,129,0.14)]",
    textClass: "text-[#10b981]"
  },
  {
    hoverBorder: "hover:border-[#ec4899]/30",
    hoverBg: "hover:bg-[#ec4899]/2",
    hoverShadow: "hover:shadow-[0_16px_32px_rgba(236,72,153,0.14)]",
    textClass: "text-[#ec4899]"
  },
  {
    hoverBorder: "hover:border-[#8b5cf6]/30",
    hoverBg: "hover:bg-[#8b5cf6]/2",
    hoverShadow: "hover:shadow-[0_16px_32px_rgba(139,92,246,0.14)]",
    textClass: "text-[#8b5cf6]"
  }
];

export default function TopicQuizPage({ params }: QuizPageProps) {
  const router = useRouter();
  const { quizId } = use(params);

  const { activeTopic, activeChapter, submitQuizScore } = useLearning();

  const [topicName, setTopicName] = useState<string>("");
  const [chapterName, setChapterName] = useState<string>("");
  const [questions, setQuestions] = useState<ExtendedQuizQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasHistory, setHasHistory] = useState<boolean | null>(null);
  const [firstCurriculumTopic, setFirstCurriculumTopic] = useState<{ topicName: string; chapterName: string } | null>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Selection states
  const [step, setStep] = useState<"select" | "loading" | "quiz">("select");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<any | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<any | null>(null);
  const [loadingSubjects, setLoadingSubjects] = useState<boolean>(true);
  const [loadingChapters, setLoadingChapters] = useState<boolean>(false);
  const [lastLearning, setLastLearning] = useState<{ topicName: string; chapterName: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Difficulty States
  const [showDifficultyModal, setShowDifficultyModal] = useState<boolean>(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [pendingTopic, setPendingTopic] = useState<string>("");
  const [pendingChapter, setPendingChapter] = useState<string>("");

  const fetchMCQs = async (tName: string, cName: string, diff: string = "medium") => {
    setErrorMsg(null);
    try {
      const res = await fetch("/api/generate-topic-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicTitle: tName,
          chapterTitle: cName,
          count: 5,
          difficulty: diff
        })
      });

      if (!res.ok) {
        throw new Error(`Failed to generate questions. Status: ${res.status}`);
      }

      const data = await res.json();
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        const formattedQuestions: ExtendedQuizQuestion[] = data.questions.map((q: any, idx: number) => ({
          id: q.id || `q${idx + 1}`,
          questionText: q.question || q.questionText || `Question ${idx + 1}`,
          options: q.options || ["A", "B", "C", "D"],
          correctAnswer: q.correctAnswer || q.options?.[0] || "",
          explanation: q.explanation || "No explanation available.",
          advice: q.advice || "Read carefully and eliminate options that divide parts incorrectly."
        }));
        setQuestions(formattedQuestions);
      } else {
        throw new Error("No questions returned by the AI.");
      }
    } catch (e: any) {
      console.error("[PracticeQuiz] Error fetching AI questions:", e);
      setErrorMsg(e.message || "Failed to generate AI questions. Please try again.");
      setStep("select");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDifficultyModal = (tName: string, cName: string) => {
    setPendingTopic(tName);
    setPendingChapter(cName);
    setShowDifficultyModal(true);
  };

  const handleConfirmDifficulty = async () => {
    setShowDifficultyModal(false);
    setStep("loading");
    setTopicName(pendingTopic);
    setChapterName(pendingChapter);
    await fetchMCQs(pendingTopic, pendingChapter, selectedDifficulty);
    setStep("quiz");
  };

  const handleSelectSubject = async (sub: any) => {
    setSelectedSubject(sub);
    setSelectedChapter(null);
    setChapters([]);
    setLoadingChapters(true);

    const supabase = createClient();
    try {
      const { data: chaptersData, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("subject_id", sub.subject_id)
        .order("order_index", { ascending: true });

      if (error) throw error;
      if (chaptersData) {
        setChapters(chaptersData);
      }
    } catch (err) {
      console.error("Error loading chapters:", err);
    } finally {
      setLoadingChapters(false);
    }
  };

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      setLoadingSubjects(true);
      const supabase = createClient();
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user && active) {
          // 1. Fetch user class_id
          const { data: profile } = await supabase
            .from("users")
            .select("class_id")
            .eq("id", user.id)
            .maybeSingle();

          const classId = profile?.class_id || 1;

          // 2. Fetch subjects for that class
          const { data: dbSubjects } = await supabase
            .from("subjects")
            .select("*")
            .eq("class_id", classId);

          if (dbSubjects && dbSubjects.length > 0) {
            setSubjects(dbSubjects);
          } else {
            const { data: fallbackSubjects } = await supabase
              .from("subjects")
              .select("*");
            if (fallbackSubjects) {
              setSubjects(fallbackSubjects);
            }
          }

          // 3. Fetch last learning history for shortcut
          try {
            const lastRow = await getLastLearning(supabase, user.id);

            if (lastRow && lastRow.topic_id) {
              const rawTopicId = lastRow.topic_id;
              const numTopicId = parseInt(String(rawTopicId), 10);

              let topicDb: any = null;
              if (!isNaN(numTopicId)) {
                const { data } = await supabase
                  .from("topics")
                  .select("*, chapters(*)")
                  .or(`topic_id.eq.${numTopicId},id.eq.${numTopicId}`)
                  .maybeSingle();
                topicDb = data;
              }

              if (!topicDb && typeof rawTopicId === "string") {
                const { data } = await supabase
                  .from("topics")
                  .select("*, chapters(*)")
                  .eq("slug", rawTopicId)
                  .maybeSingle();
                topicDb = data;
              }

              if (topicDb && topicDb.topic_name) {
                setLastLearning({
                  topicName: topicDb.topic_name,
                  chapterName: topicDb.chapters?.name || "General",
                });
              }
            }
          } catch (err) {
            console.warn("[PracticeQuiz] Could not fetch last_learning for shortcut:", err);
          }
        }
      } catch (err) {
        console.error("[PracticeQuiz] Error loading initial data:", err);
      } finally {
        if (active) {
          setLoadingSubjects(false);
        }
      }
    }

    void loadInitialData();

    return () => {
      active = false;
    };
  }, []);

  if (step === "loading") {
    return (
      <PageContainer>
        <Topbar title="Practice Quiz" subtitle="Preparing your AI-powered practice drill" />
        <main className="p-8 flex flex-col items-center justify-center min-h-[65vh] space-y-6 text-center">
          <div className="relative w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-md">
            <span className="material-symbols-outlined text-primary text-[44px] animate-bounce">
              psychology
            </span>
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="font-bold text-lg text-on-surface">
              {topicName ? `Generating 5 MCQs for "${topicName}"` : "Preparing Practice Quiz..."}
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Maya AI is crafting 5 personalized practice questions based on the selected syllabus.
            </p>
          </div>
          <div className="w-48 bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse w-3/4" />
          </div>
        </main>
      </PageContainer>
    );
  }

  if (step === "select") {
    return (
      <PageContainer>
        <Topbar title="Practice Quiz" subtitle="Interactive AI-powered practice session" />
        <main className="p-4 md:p-8 max-w-[1000px] mx-auto w-full space-y-8 select-none">

          {/* Back button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-primary">arrow_back</span>
            </button>
            <span className="text-xs font-bold text-outline uppercase tracking-wider">Back to Dashboard</span>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 text-sm">
              <span className="material-symbols-outlined text-red-500">error</span>
              <p className="font-semibold">{errorMsg}</p>
            </div>
          )}

          {/* Quick Resume Option */}
          {lastLearning && (
            <div className="bg-gradient-to-r from-primary/10 to-indigo-600/5 border border-primary/20 rounded-3xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/15 rounded-2xl flex items-center justify-center text-primary shadow-xs shrink-0">
                  <span className="material-symbols-outlined text-[24px]">bolt</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-on-surface">Quick Resume Practice</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Generate a quiz on your last studied topic: <strong className="text-primary font-bold">{lastLearning.topicName}</strong> ({lastLearning.chapterName})
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleOpenDifficultyModal(lastLearning.topicName, lastLearning.chapterName)}
                className="px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl active:scale-[0.98] transition-all hover:bg-primary/95 cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                <span>Quick Start</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

            {/* Left: Subjects Selection - 5 cols */}
            <div className="md:col-span-5 space-y-4">
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-on-surface">1. Select Subject</h3>
                <p className="text-xs text-on-surface-variant">Choose a subject from your syllabus</p>
              </div>

              {loadingSubjects ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-20 bg-slate-100 animate-pulse rounded-2xl border border-slate-100" />
                  ))}
                </div>
              ) : subjects.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-2xl text-center text-on-surface-variant text-xs font-semibold">
                  No subjects assigned.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {subjects.map((sub, index) => {
                    const isSelected = selectedSubject?.subject_id === sub.subject_id;
                    const glow = SUBJECT_GLOWS[index % SUBJECT_GLOWS.length];

                    return (
                      <button
                        key={sub.subject_id}
                        onClick={() => handleSelectSubject(sub)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all cursor-pointer ${isSelected
                          ? "border-primary bg-primary/5 shadow-xs -translate-y-0.5"
                          : `bg-white border-outline-variant/15 ${glow.hoverBorder} ${glow.hoverBg} hover:shadow-xs active:scale-[0.99]`
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0`}>
                            <SubjectIcon icon={sub.icon} sizeClassName="text-[28px]" fallbackIcon="menu_book" className="text-primary" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-on-surface block">{sub.name}</span>
                            <span className="text-[10px] text-on-surface-variant font-medium">Syllabus Active</span>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Chapters Selection - 7 cols */}
            <div className="md:col-span-7 space-y-4">
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-on-surface">2. Select Chapter</h3>
                <p className="text-xs text-on-surface-variant">Choose a chapter to practice</p>
              </div>

              {!selectedSubject ? (
                <div className="bg-slate-50/50 border border-dashed border-outline-variant/20 rounded-[28px] p-8 text-center flex flex-col items-center justify-center h-64 text-on-surface-variant space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined">touch_app</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold">No Subject Selected</p>
                    <p className="text-[11px] text-slate-400 max-w-xs">Select a subject on the left to view and pick from its chapters.</p>
                  </div>
                </div>
              ) : loadingChapters ? (
                <div className="space-y-3">
                  {[1, 2].map((n) => (
                    <div key={n} className="h-24 bg-slate-100 animate-pulse rounded-[28px] border border-slate-100" />
                  ))}
                </div>
              ) : chapters.length === 0 ? (
                <div className="bg-slate-50/50 border border-dashed border-outline-variant/20 rounded-[28px] p-8 text-center flex flex-col items-center justify-center h-64 text-on-surface-variant space-y-2">
                  <span className="material-symbols-outlined text-[32px] text-slate-400">sentiment_dissatisfied</span>
                  <p className="text-xs font-bold">No Chapters Available</p>
                  <p className="text-[11px] text-slate-400">There are no study chapters assigned for this subject yet.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {chapters.map((ch) => {
                    const isSelected = selectedChapter?.id === ch.id;
                    return (
                      <button
                        key={ch.id}
                        onClick={() => setSelectedChapter(ch)}
                        className={`w-full flex flex-col items-start p-5 rounded-[28px] border text-left transition-all cursor-pointer ${isSelected
                          ? "border-primary bg-primary/5 shadow-xs font-semibold"
                          : "bg-white border-outline-variant/15 hover:border-primary/20 hover:bg-slate-50/40 active:scale-[0.99]"
                          }`}
                      >
                        <div className="flex w-full items-center justify-between">
                          <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Chapter {ch.order_index}</span>
                          {isSelected && (
                            <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-on-surface mt-1">{ch.name}</h4>
                        {ch.description && (
                          <p className="text-[11px] text-on-surface-variant font-medium mt-1 leading-relaxed line-clamp-2">
                            {ch.description}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Action buttons */}
          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => {
                if (!selectedSubject || !selectedChapter) return;
                handleOpenDifficultyModal(selectedChapter.name, selectedSubject.name);
              }}
              disabled={!selectedSubject || !selectedChapter}
              className={`h-12 px-8 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all ${selectedSubject && selectedChapter
                ? "bg-primary text-white hover:bg-primary/95 cursor-pointer active:scale-95"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
            >
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              <span>Generate Practice Quiz</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

        </main>

        {showDifficultyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none">
            <div className="bg-white rounded-[32px] border border-outline-variant/15 shadow-xl max-w-md w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">

              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-display font-extrabold text-xl text-on-surface">Select Quiz Difficulty</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Customize the difficulty of your AI practice quiz for <strong>"{pendingTopic}"</strong>.
                  </p>
                </div>
                <button
                  onClick={() => setShowDifficultyModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 cursor-pointer active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Difficulty Cards */}
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    key: "easy",
                    label: "Easy",
                    desc: "Simple and direct conceptual questions. Great for starting out.",
                    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
                    activeColor: "border-emerald-600 bg-emerald-50/70 text-emerald-900 shadow-[0_4px_12px_rgba(16,185,129,0.1)]",
                    icon: "sentiment_satisfied"
                  },
                  {
                    key: "medium",
                    label: "Medium",
                    desc: "Balanced application and problem-solving questions.",
                    color: "text-amber-700 bg-amber-50 border-amber-200",
                    activeColor: "border-amber-500 bg-amber-50/70 text-amber-900 shadow-[0_4px_12px_rgba(245,158,11,0.1)]",
                    icon: "sentiment_neutral"
                  },
                  {
                    key: "hard",
                    label: "Hard",
                    desc: "Challenging conceptual and multi-step math problems.",
                    color: "text-rose-700 bg-rose-50 border-rose-200",
                    activeColor: "border-rose-600 bg-rose-50/70 text-rose-900 shadow-[0_4px_12px_rgba(244,63,94,0.1)]",
                    icon: "sentiment_extremely_dissatisfied"
                  }
                ].map((diff) => {
                  const isActive = selectedDifficulty === diff.key;
                  return (
                    <button
                      key={diff.key}
                      onClick={() => setSelectedDifficulty(diff.key as any)}
                      className={`w-full flex items-start gap-4 p-4 rounded-2xl border text-left cursor-pointer transition-all ${isActive
                        ? `${diff.activeColor} border-2`
                        : "bg-white border-outline-variant/15 hover:bg-slate-50/60 active:scale-[0.99]"
                        }`}
                    >

                      <div className="space-y-0.5">
                        <span className="text-sm font-bold block">{diff.label}</span>
                        <span className="text-[10px] text-on-surface-variant font-medium leading-relaxed block">{diff.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowDifficultyModal(false)}
                  className="flex-1 h-12 border border-outline-variant/30 hover:bg-slate-50 text-on-surface font-bold text-xs rounded-xl active:scale-[0.98] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDifficulty}
                  className="flex-1 h-12 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl active:scale-[0.98] transition-all cursor-pointer shadow-xs"
                >
                  Start AI Quiz
                </button>
              </div>

            </div>
          </div>
        )}
      </PageContainer>
    );
  }


  if (loading || questions.length === 0) {
    return (
      <PageContainer>
        <Topbar title="Practice Quiz" subtitle="Preparing your AI-powered practice drill" />
        <main className="p-8 flex flex-col items-center justify-center min-h-[65vh] space-y-6 text-center">
          <div className="relative w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-md">
            <span className="material-symbols-outlined text-primary text-[44px] animate-bounce">
              psychology
            </span>
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="font-bold text-lg text-on-surface">
              {topicName ? `Generating 5 MCQs for "${topicName}"` : "Fetching your last learned topic..."}
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Maya AI is analyzing your last learning progress to craft 5 personalized practice questions.
            </p>
          </div>
          <div className="w-48 bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse w-3/4" />
          </div>
        </main>
      </PageContainer>
    );
  }

  const currentQuestion = questions[currentIdx];

  const handleSelectOption = (opt: string) => {
    if (checked) return;
    setSelectedOpt(opt);
  };

  const handleCheck = () => {
    if (!selectedOpt || !currentQuestion) return;

    setChecked(true);
    const correct = selectedOpt === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setChecked(false);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      const score = Math.round((correctCount / questions.length) * 100);
      submitQuizScore(score);
      setQuizFinished(true);
    }
  };

  const handleFinish = () => {
    router.push("/dashboard");
  };

  if (quizFinished) {
    const finalScore = Math.round((correctCount / questions.length) * 100);
    return (
      <PageContainer>
        <Confetti />
        <Topbar title="Quiz Results" subtitle="Detailed performance breakdown" />
        <main className="flex-grow flex items-center justify-center p-8 bg-[#f8f9ff]">
          <div className="bg-white p-8 rounded-[32px] border border-outline-variant/15 shadow-md w-full max-w-xl text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-[24px] flex items-center justify-center text-primary mx-auto shadow-[0_8px_16px_rgba(83,65,205,0.1)] select-none">
              <span className="material-symbols-outlined text-[40px]">workspace_premium</span>
            </div>
            <h1 className="font-display font-bold text-2xl text-on-surface">Quiz Completed!</h1>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
              You successfully completed the 5-question AI practice drill for <strong>{topicName}</strong>.
            </p>

            <div className="bg-[#F3F0FF] border border-primary/10 p-6 rounded-[24px] w-full space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-outline-variant/20">
                <span className="text-xs font-semibold text-on-surface-variant">Total Questions</span>
                <span className="font-bold text-sm text-on-surface">{questions.length}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-outline-variant/20">
                <span className="text-xs font-semibold text-on-surface-variant">Correct Answers</span>
                <span className="font-bold text-sm text-green-600">{correctCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-on-surface-variant">Accuracy Score</span>
                <span className="font-bold text-base text-primary">{finalScore}%</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full h-12 bg-primary text-white font-bold rounded-xl active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(83,65,205,0.2)] cursor-pointer"
            >
              Go to Dashboard
            </button>
          </div>
        </main>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Topbar
        title={`${topicName} Practice`}
        subtitle="AI-Generated 5 Practice MCQs"
        showSearch={true}
      />

      <main className="p-8 max-w-[1200px] mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-primary">arrow_back</span>
            </button>
            <span className="text-xs font-bold text-outline uppercase tracking-wider">Exit Quiz</span>
          </div>

          <div className="flex items-center gap-2 bg-primary/5 border border-primary/10 px-3.5 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold text-primary">
              Practice: {topicName}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Question Details - 7 cols */}
          <div className="lg:col-span-7 space-y-6">
            {currentQuestion && (
              <div className="bg-white p-6 rounded-[28px] border border-outline-variant/15 shadow-sm space-y-6">
                <QuizProgress currentQuestionIndex={currentIdx} totalQuestions={questions.length} />

                <QuestionCard
                  questionText={currentQuestion.questionText}
                  checked={checked}
                  explanation={currentQuestion.explanation}
                />

                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options.map((opt, idx) => {
                    const label = ["A", "B", "C", "D"][idx];
                    return (
                      <OptionCard
                        key={opt}
                        label={label}
                        optionText={opt}
                        isSelected={selectedOpt === opt}
                        checked={checked}
                        isCorrect={opt === currentQuestion.correctAnswer}
                        onClick={() => handleSelectOption(opt)}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: AI Tutor Dialogue - 5 cols */}
          <div className="lg:col-span-5 bg-white p-6 rounded-[28px] border border-outline-variant/15 shadow-sm flex flex-col justify-between h-fit min-h-[300px]">
            <div className="space-y-4">
              <div className="bg-[#f0ecf8] p-5 rounded-2xl border border-primary/5 flex gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 border border-primary/20">
                  <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
                </div>
                <div>
                  <h5 className="font-bold text-xs text-primary uppercase tracking-wider">Maya's Advice</h5>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    "{currentQuestion?.advice || 'Read carefully and try solving step-by-step. Eliminate options that do not make sense.'}"
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              {!checked ? (
                <button
                  onClick={handleCheck}
                  disabled={!selectedOpt}
                  className={`w-full h-12 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-1.5 transition-all ${selectedOpt
                    ? "bg-primary text-white cursor-pointer active:scale-95"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed opacity-60"
                    }`}
                >
                  <span>Check Answer</span>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full h-12 rounded-xl bg-primary text-white font-bold text-sm shadow-md flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>{currentIdx + 1 < questions.length ? "Next Question" : "Finish Quiz"}</span>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </main>
    </PageContainer>
  );
}


