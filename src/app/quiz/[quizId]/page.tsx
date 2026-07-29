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

interface QuizPageProps {
  params: Promise<{ quizId: string }>;
}

interface ExtendedQuizQuestion extends QuizQuestion {
  advice?: string;
}

export default function TopicQuizPage({ params }: QuizPageProps) {
  const router = useRouter();
  const { quizId } = use(params);
  
  const { activeTopic, activeChapter, submitQuizScore } = useLearning();

  const [topicName, setTopicName] = useState<string>("");
  const [chapterName, setChapterName] = useState<string>("");
  const [questions, setQuestions] = useState<ExtendedQuizQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasHistory, setHasHistory] = useState<boolean | null>(null);
  const [firstCurriculumTopic, setFirstCurriculumTopic] = useState<{ topicName: string; chapterName: string } | null>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const fetchMCQs = async (tName: string, cName: string) => {
    try {
      const res = await fetch("/api/generate-topic-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicTitle: tName,
          chapterTitle: cName,
          count: 5
        })
      });

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
      }
    } catch (e) {
      console.error("[PracticeQuiz] Error fetching AI questions:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    async function loadLastLearningAndQuiz() {
      setLoading(true);
      const supabase = createClient();
      let targetTopic: string | null = null;
      let targetChapter: string | null = null;
      let foundHistory = false;

      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const lastRow = await getLastLearning(supabase, user.id);

          if (lastRow && lastRow.topic_id) {
            const rawTopicId = lastRow.topic_id;
            const numTopicId = parseInt(String(rawTopicId), 10);

            // 1. Fetch topic details from DB
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

            if (topicDb) {
              if (topicDb.topic_name) targetTopic = topicDb.topic_name;
              if (topicDb.chapters?.name) targetChapter = topicDb.chapters.name;
              foundHistory = true;
            }
          }
        }
      } catch (err) {
        console.warn("[PracticeQuiz] Could not fetch last_learning:", err);
      }

      // Fetch first topic from curriculum DB as fallback
      let fallbackTopicName = "Fractions Basics";
      let fallbackChapterName = "Fractions";
      try {
        const { data: firstTopicDb } = await supabase
          .from("topics")
          .select("*, chapters(*)")
          .order("id", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (firstTopicDb?.topic_name) fallbackTopicName = firstTopicDb.topic_name;
        if (firstTopicDb?.chapters?.name) fallbackChapterName = firstTopicDb.chapters.name;
      } catch (dbErr) {
        console.warn("[PracticeQuiz] Error fetching first curriculum topic:", dbErr);
      }

      if (!active) return;

      setFirstCurriculumTopic({
        topicName: fallbackTopicName,
        chapterName: fallbackChapterName,
      });

      if (foundHistory && targetTopic) {
        setHasHistory(true);
        setTopicName(targetTopic);
        setChapterName(targetChapter || "General");
        await fetchMCQs(targetTopic, targetChapter || "General");
      } else if (activeTopic && activeTopic !== "Mixed Numbers") {
        // Active session topic exists
        setHasHistory(true);
        setTopicName(activeTopic);
        setChapterName(activeChapter || "General");
        await fetchMCQs(activeTopic, activeChapter || "General");
      } else {
        // User is brand new (no last_learning history in DB)
        setHasHistory(false);
        setLoading(false);
      }
    }

    void loadLastLearningAndQuiz();

    return () => {
      active = false;
    };
  }, [activeTopic, activeChapter, quizId]);

  // Brand New User State (No Learning History Found)
  if (hasHistory === false && !loading && questions.length === 0) {
    return (
      <PageContainer>
        <Topbar title="Practice Quiz" subtitle="Interactive AI-powered topic drill" />
        <main className="p-4 md:p-8 max-w-xl mx-auto w-full min-h-[60vh] flex flex-col items-center justify-center text-center">
          <div className="bg-white p-8 rounded-[32px] border border-outline-variant/15 shadow-md w-full space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-[24px] flex items-center justify-center text-primary mx-auto shadow-[0_8px_16px_rgba(83,65,205,0.1)] select-none">
              <span className="material-symbols-outlined text-[40px]">auto_stories</span>
            </div>

            <div className="space-y-2">
              <h2 className="font-display font-bold text-2xl text-on-surface">No Learning History Found</h2>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                You haven't studied any topic yet! Explore your curriculum subjects to start your first lesson, or try a practice quiz on <strong>"{firstCurriculumTopic?.topicName || 'First Topic'}"</strong>.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => router.push("/subjects")}
                className="w-full h-12 bg-primary text-white font-bold text-sm rounded-xl active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(83,65,205,0.2)] cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">import_contacts</span>
                <span>Start Learning (Explore Subjects)</span>
              </button>

              <button
                onClick={async () => {
                  if (firstCurriculumTopic) {
                    setLoading(true);
                    setTopicName(firstCurriculumTopic.topicName);
                    setChapterName(firstCurriculumTopic.chapterName);
                    await fetchMCQs(firstCurriculumTopic.topicName, firstCurriculumTopic.chapterName);
                    setHasHistory(true);
                  }
                }}
                className="w-full h-12 bg-white border border-outline-variant/30 hover:bg-slate-50 text-on-surface font-bold text-xs rounded-xl active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">quiz</span>
                <span>Practice Sample Topic ({firstCurriculumTopic?.topicName || "First Topic"})</span>
              </button>
            </div>
          </div>
        </main>
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
        subtitle="AI-Generated 5 Practice MCQs based on your last learning" 
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
              Last Learning: {topicName}
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
                  className={`w-full h-12 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-1.5 transition-all ${
                    selectedOpt 
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


