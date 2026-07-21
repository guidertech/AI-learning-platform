"use client";

import React, { useState, useEffect, use, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLearning } from "@/context/LearningContext";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import LearningStepCard from "@/components/learning/LearningStepCard";
import MayaPanel from "@/components/learning/MayaPanel";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import { topicContents } from "@/lib/mock/topicContent";
import { createClient } from "@/lib/supabase/client";
import {saveLastLearning} from "@/lib/lastLearning";

interface LearningWorkspacePageProps {
  params: Promise<{ conceptId: string }>;
}

export default function LearningWorkspacePage({ params }: LearningWorkspacePageProps) {
  const router = useRouter();
  const { conceptId } = use(params);

  const { incrementStudyTime, initializeChatForTopic, setActiveChapter } = useLearning();
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [dbTopic, setDbTopic] = useState<any>(null);
  const [dbChapter, setDbChapter] = useState<any>(null);
  const [nextTopicSlug, setNextTopicSlug] = useState<string | null>(null);
  const [isLastTopic, setIsLastTopic] = useState(false);
  const [topicContent, setTopicContent] = useState<any>(null);

  // AI Topic Test State
  const [showTestModal, setShowTestModal] = useState(false);
  const [testQuestions, setTestQuestions] = useState<any[]>([]);
  const [currentTestQ, setCurrentTestQ] = useState(0);
  const [testScore, setTestScore] = useState(0);
  const [testGenerating, setTestGenerating] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [testPassed, setTestPassed] = useState(false);
  const [isTopicCompleted, setIsTopicCompleted] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);

  // Dedicated useEffect to persist last_learning whenever user lands on topic page
  useEffect(() => {
    let active = true;
    async function recordLastLearning() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !active) return;

      try {
        let topic: any = null;

        // 1. Query by slug
        const { data: bySlug } = await supabase
          .from("topics")
          .select("*, chapters(*, subjects(*))")
          .eq("slug", conceptId)
          .maybeSingle();

        topic = bySlug;

        // 2. Query by numeric topic_id or id if not found
        if (!topic) {
          const numId = parseInt(String(conceptId), 10);
          if (!isNaN(numId)) {
            const { data: byTopicId } = await supabase
              .from("topics")
              .select("*, chapters(*, subjects(*))")
              .eq("topic_id", numId)
              .maybeSingle();

            if (byTopicId) {
              topic = byTopicId;
            } else {
              const { data: byId } = await supabase
                .from("topics")
                .select("*, chapters(*, subjects(*))")
                .eq("id", numId)
                .maybeSingle();
              topic = byId;
            }
          }
        }

        // 3. Query by topic_name similarity
        if (!topic && typeof conceptId === "string") {
          const searchName = conceptId.replace(/-/g, " ");
          const { data: byName } = await supabase
            .from("topics")
            .select("*, chapters(*, subjects(*))")
            .ilike("topic_name", `%${searchName}%`)
            .limit(1)
            .maybeSingle();
          topic = byName;
        }

        const classId = topic?.chapters?.subjects?.class_id || topic?.chapters?.class_id || 5;
        const subjectId = topic?.chapters?.subject_id || topic?.subject_id || 1;
        const chapterId = topic?.chapter_id || topic?.chapters?.id || 1;
        const topicId = topic?.topic_id || topic?.id || conceptId;

        console.log("[Dedicated recordLastLearning] Persisting for topic:", {
          userId: user.id,
          classId,
          subjectId,
          chapterId,
          topicId,
        });

        await saveLastLearning(supabase, user.id, {
          classId,
          subjectId,
          chapterId,
          topicId,
        });
      } catch (err) {
        console.error("Error in recordLastLearning effect:", err);
      }
    }

    if (conceptId) {
      void recordLastLearning();
    }

    return () => {
      active = false;
    };
  }, [conceptId]);

  useEffect(() => {
    async function loadTopic() {
      const supabase = createClient();
      try {
        let topicData: any = null;
        let chapterData: any = null;

        // 1. Query by slug
        const { data: bySlug } = await supabase
          .from("topics")
          .select("*")
          .eq("slug", conceptId)
          .maybeSingle();

        topicData = bySlug;

        // 2. Query by numeric topic_id or id if not found
        if (!topicData) {
          const numId = parseInt(conceptId, 10);
          if (!isNaN(numId)) {
            const { data: byTopicId } = await supabase
              .from("topics")
              .select("*")
              .eq("topic_id", numId)
              .maybeSingle();
            
            if (byTopicId) {
              topicData = byTopicId;
            } else {
              const { data: byId } = await supabase
                .from("topics")
                .select("*")
                .eq("id", numId)
                .maybeSingle();
              topicData = byId;
            }
          }
        }

        // 3. Query by topic_name similarity if still not found
        if (!topicData && typeof conceptId === "string") {
          const searchName = conceptId.replace(/-/g, " ");
          const { data: byName } = await supabase
            .from("topics")
            .select("*")
            .ilike("topic_name", `%${searchName}%`)
            .limit(1)
            .maybeSingle();
          if (byName) topicData = byName;
        }

        // 4. Fallback if still not in DB
        if (!topicData) {
          const humanName = String(conceptId)
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          topicData = {
            id: conceptId,
            topic_id: conceptId,
            topic_name: humanName,
            slug: conceptId
          };
        }

        setDbTopic(topicData);
        
        // Fetch chapter details manually
        if (topicData.chapter_id) {
          const { data: chRes } = await supabase
            .from("chapters")
            .select("*, subjects(*)")
            .eq("chapter_id", topicData.chapter_id)
            .maybeSingle();
            
          chapterData = chRes;
          setDbChapter(chapterData);

          // Fetch all topics for this chapter to find next topic
          const { data: allChapterTopics } = await supabase
            .from("topics")
            .select("*")
            .eq("chapter_id", topicData.chapter_id)
            .order("order_index", { ascending: true });

          if (allChapterTopics) {
            const currentIdx = allChapterTopics.findIndex(
              (t: any) => t.id === topicData.id || t.topic_id === topicData.topic_id
            );
            if (currentIdx !== -1 && currentIdx + 1 < allChapterTopics.length) {
              const nextT = allChapterTopics[currentIdx + 1];
              setNextTopicSlug(nextT.slug || nextT.topic_id?.toString() || nextT.id?.toString());
            } else {
              setIsLastTopic(true);
            }
          }
        }

        // Check if topic is completed in user_topic_progress
        const { data: { user } } = await supabase.auth.getUser();
        const rawTopicId = topicData.topic_id || topicData.id;
        const numTopicId = parseInt(String(rawTopicId), 10);
        if (user) {
          if (!isNaN(numTopicId)) {
            const { data: prog } = await supabase
              .from("user_topic_progress")
              .select("*")
              .eq("user_id", user.id)
              .eq("topic_id", numTopicId)
              .maybeSingle();
            if (prog && (prog.is_completed === true || prog.completed === true)) {
              setIsTopicCompleted(true);
            }
          }

          const currentClassId = chapterData?.subjects?.class_id || chapterData?.class_id || 5;
          const currentSubjectId = chapterData?.subject_id || topicData?.subject_id || 1;
          const currentChapterId = topicData?.chapter_id || chapterData?.chapter_id || chapterData?.id || 1;
          const currentTopicId = rawTopicId || conceptId || 1;

          console.log("[LearningPage] Invoking saveLastLearning:", {
            userId: user.id,
            classId: currentClassId,
            subjectId: currentSubjectId,
            chapterId: currentChapterId,
            topicId: currentTopicId,
          });

          void saveLastLearning(supabase, user.id, {
            classId: currentClassId,
            subjectId: currentSubjectId,
            chapterId: currentChapterId,
            topicId: currentTopicId,
          });
        }

        // Initialize Topic Content atomically
        const formattedTitle = topicData.topic_name || String(conceptId).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const chapterTitle = chapterData?.name || "Chapter";

        const defaultTopicContent = {
          title: formattedTitle,
          tutorWelcomeMessage: `Hi! I'm Maya. Today we are learning about "${formattedTitle}" in ${chapterTitle}. Feel free to ask me any questions!`,
          learnStep: {
            title: `Introduction to ${formattedTitle}`,
            durationText: "~1 min",
            imageSrc: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
            descriptionText: `In this lesson, we will explore the core concepts of "${formattedTitle}". Interact with the Socratic AI Panel on the right to study and solve your doubts together.`
          },
          exampleStep: {
            title: "Real Life Application",
            durationText: "~1 min",
            imageSrc: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&auto=format&fit=crop&q=60",
            descriptionText: `Understanding "${formattedTitle}" helps us solve real-world problems and build logical reasoning skills.`
          },
          thinkStep: {
            promptText: `Ready to test your understanding of ${formattedTitle}?`,
            options: ["Yes, let's start!", "Need a bit more review"],
            correctAnswerText: "Yes, let's start!"
          },
          quickReplies: [
            `What is ${formattedTitle}?`,
            `Give me an example of ${formattedTitle}`,
            `Why do we learn ${formattedTitle}?`
          ]
        };

        const loadedContent = topicContents[conceptId] || defaultTopicContent;
        setTopicContent(loadedContent);

      } catch (err) {
        console.error("Error loading topic:", err);
        const humanName = String(conceptId)
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        
        const fallbackTopic = {
          id: conceptId,
          topic_id: conceptId,
          topic_name: humanName,
          slug: conceptId
        };
        setDbTopic(fallbackTopic);

        const defaultTopicContent = {
          title: humanName,
          tutorWelcomeMessage: `Hi! I'm Maya. Today we are learning about "${humanName}". Feel free to ask me any questions!`,
          learnStep: {
            title: `Introduction to ${humanName}`,
            durationText: "~1 min",
            imageSrc: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
            descriptionText: `In this lesson, we will explore the core concepts of "${humanName}". Interact with the Socratic AI Panel on the right to study and solve your doubts together.`
          },
          exampleStep: {
            title: "Real Life Application",
            durationText: "~1 min",
            imageSrc: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&auto=format&fit=crop&q=60",
            descriptionText: `Understanding "${humanName}" helps us solve real-world problems and build logical reasoning skills.`
          },
          thinkStep: {
            promptText: `Ready to test your understanding of ${humanName}?`,
            options: ["Yes, let's start!", "Need a bit more review"],
            correctAnswerText: "Yes, let's start!"
          },
          quickReplies: [
            `What is ${humanName}?`,
            `Give me an example of ${humanName}`,
            `Why do we learn ${humanName}?`
          ]
        };

        setTopicContent(topicContents[conceptId] || defaultTopicContent);
      } finally {
        setLoading(false);
      }
    }
    void loadTopic();
  }, [conceptId]);

  const topicTitle = dbTopic?.topic_name || String(conceptId).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const activeChapterTitle = dbChapter?.name || "Chapter";

  const handleNextTopicClick = async () => {
    if (isLastTopic && dbChapter) {
      const supabase = createClient();
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && dbChapter.id) {
          const { data: quizAttempt } = await supabase
            .from("quiz_attempts")
            .select("*")
            .eq("user_id", user.id)
            .eq("chapter_id", dbChapter.id)
            .eq("quiz_type", "chapter_end")
            .maybeSingle();
            
          if (quizAttempt) {
            router.push(`/progress/${dbChapter.subject_id}`);
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      router.push(`/quiz/chapter/${dbChapter.id}`);
    } else if (nextTopicSlug) {
      router.push(`/learning/${nextTopicSlug}`);
    }
  };

  // Increment study time every minute
  useEffect(() => {
    const timer = setInterval(() => incrementStudyTime(1), 60000);
    return () => clearInterval(timer);
  }, [incrementStudyTime]);

  // Stop AI voice / TTS when topic test starts or test modal opens
  useEffect(() => {
    if (showTestModal) {
      if (typeof window !== "undefined") {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        window.dispatchEvent(new CustomEvent("stop-ai-speech"));
      }
    }
  }, [showTestModal]);

  // Stop ALL AI speech & voice calls immediately when leaving AI Workspace page (unmounting)
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        window.dispatchEvent(new CustomEvent("stop-ai-speech"));
      }
    };
  }, []);

  const handleTakeTest = async () => {
    if (typeof window !== "undefined") {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      window.dispatchEvent(new CustomEvent("stop-ai-speech"));
    }
    setShowTestModal(true);
    setTestGenerating(true);
    setTestFinished(false);
    setTestScore(0);
    setCurrentTestQ(0);
    try {
      const res = await fetch("/api/generate-topic-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicTitle,
          chapterTitle: activeChapterTitle
        })
      });
      const data = await res.json();
      if (data.questions) {
        setTestQuestions(data.questions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTestGenerating(false);
    }
  };

  const handleAnswerTest = async (option: string) => {
    const q = testQuestions[currentTestQ];
    let newScore = testScore;
    if (option === q.correctAnswer) {
      newScore += 1;
      setTestScore(newScore);
    }
    
    if (currentTestQ < testQuestions.length - 1) {
      setCurrentTestQ(currentTestQ + 1);
    } else {
      setTestFinished(true);
      const passed = newScore >= 2;
      setTestPassed(passed);
      
      if (passed && dbTopic) {
        setSavingProgress(true);
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          const { data: { session } } = await supabase.auth.getSession();

          const rawTopicId = dbTopic.topic_id || dbTopic.id;
          const numTopicId = parseInt(String(rawTopicId), 10);

          if (!isNaN(numTopicId)) {
            const currentUserId = user?.id || localStorage.getItem("classorbit_profile_id") || "profile-guest";

            // Local fallback persistence
            try {
              localStorage.setItem(`completed_topic_${numTopicId}`, "true");
              localStorage.setItem(`completed_topic_${currentUserId}_${numTopicId}`, "true");
            } catch (e) {
              console.error("LocalStorage save error:", e);
            }

            // Call server API route with session auth token
            const headers: Record<string, string> = { "Content-Type": "application/json" };
            if (session?.access_token) {
              headers["Authorization"] = `Bearer ${session.access_token}`;
            }

            const res = await fetch("/api/save-topic-progress", {
              method: "POST",
              headers,
              body: JSON.stringify({ userId: currentUserId, topicId: numTopicId })
            });

            const resData = await res.json();
            if (resData.success) {
              console.log("[saveTopicProgress] Successfully saved to user_topic_progress DB table:", resData.data);
              setIsTopicCompleted(true);
            } else {
              console.error("[saveTopicProgress] DB Save Failed:", resData.error);
              alert(`Progress could not be saved: ${resData.error}`);
            }
          }
        } catch (e) {
          console.error("Error saving topic progress:", e);
        } finally {
          setSavingProgress(false);
        }
      }
    }
  };

  useEffect(() => {
    if (topicContent) {
      const chapterTitle = dbChapter?.name || "Chapter";
      setActiveChapter(chapterTitle);
      initializeChatForTopic(topicContent.title || topicTitle, topicContent.tutorWelcomeMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicContent]);

  const defaultNoteImages = [
    "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60"
  ];
  const noteImages = topicContent?.noteImages || defaultNoteImages;

  return (
    <PageContainer>
      <Topbar
        title={`🤖 Maya Workspace: ${topicContent?.title || topicTitle}`}
        subtitle="Interact with Maya to master this topic"
        showBack={true}
      />

      {loading || !topicContent ? (
        <main className="p-4 md:p-8 max-w-300 mx-auto w-full">
          <LoadingSkeleton type="workspace" />
        </main>
      ) : (
        <div className="flex flex-col h-[calc(100dvh-64px)] md:h-[calc(100dvh-80px)] overflow-hidden">
          {/* Main workspace layout with right side panel */}
          <main className="flex-1 overflow-y-auto bg-[#f8f9ff] px-4 py-6 md:px-10 md:py-8">
            <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row gap-8">
              {/* Left Side: Lesson content (w-[65%]) */}
              <div className="flex-1 lg:w-[65%] space-y-6">
                <LearningStepCard
                  stepNumber={1}
                  title={topicContent.learnStep.title}
                  durationText={topicContent.learnStep.durationText}
                  imageSrc={topicContent.learnStep.imageSrc}
                  descriptionText={topicContent.learnStep.descriptionText}
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  {!isTopicCompleted ? (
                    <button
                      onClick={handleTakeTest}
                      className="flex-1 h-12 bg-white border border-outline-variant/30 text-on-surface font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 active:scale-[0.98] transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">quiz</span>
                      <span>Take Topic Test</span>
                    </button>
                  ) : (
                    <div className="flex-1 h-12 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded-2xl flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      <span>Topic Completed!</span>
                    </div>
                  )}

                  <button
                    onClick={handleNextTopicClick}
                    className="flex-1 h-12 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer hover:bg-primary/90 shadow-sm active:scale-[0.98] transition-all"
                  >
                    <span>{isLastTopic ? "Take Chapter-End Test" : "Next Topic"}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Right Side: Hand-written Visual Notes & Socratic AI Panel (w-[35%]) */}
              <div className="lg:w-[35%] space-y-6 shrink-0">
                {/* Hand-written Notes Gallery */}
                <div className="bg-white p-6 rounded-[28px] border border-outline-variant/20 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-on-surface">Hand-written Visual Notes</h4>
                      <p className="text-xs text-on-surface-variant font-medium mt-0.5">Click any note image to inspect closely</p>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-primary/10 text-primary rounded-full">
                      Visual Aid
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                    {noteImages.map((img: string, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className="group relative h-40 rounded-2xl overflow-hidden border border-outline-variant/20 cursor-pointer bg-slate-100"
                      >
                        <img
                          src={img}
                          alt={`Note ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-[24px]">zoom_in</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-[550px]">
                  <MayaPanel autoStartVoice={true} />
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* Image Modal Preview */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl">
            <img src={selectedImage} alt="Expanded Note" className="w-full h-auto max-h-[85vh] object-contain" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* AI Topic Test Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-bold text-base text-on-surface">Topic Mastery Quiz</h3>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5">{topicTitle}</p>
              </div>
              <button
                onClick={() => setShowTestModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {testGenerating ? (
              <div className="py-4 space-y-4 select-none">
                {/* Video Player Box */}
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900">
                  <video
                    src="/mcq_loading.mp4"
                    onError={(e) => {
                      (e.currentTarget as HTMLVideoElement).src = "/maya_avatar.mp4";
                    }}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ transform: "scale(1.2)", transformOrigin: "center center" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-primary/80 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                        ✨ AI Generating Questions
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-100">Creating custom test for "{topicTitle}"...</p>
                  </div>
                </div>

                <div className="space-y-2 text-center">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-pulse w-3/4 transition-all duration-1000" />
                  </div>
                  <p className="text-[11px] text-on-surface-variant font-medium">
                    Maya is analyzing key concepts to craft 3 personalized questions for you.
                  </p>
                </div>
              </div>
            ) : testFinished ? (
              <div className="py-6 text-center space-y-4">
                <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${testPassed ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                  <span className="material-symbols-outlined text-[36px]">{testPassed ? "emoji_events" : "replay"}</span>
                </div>

                <div>
                  <h4 className="font-extrabold text-lg text-on-surface">
                    {testPassed ? "Congratulations! 🎉" : "Keep Practicing! 💪"}
                  </h4>
                  <p className="text-xs text-on-surface-variant font-medium mt-1">
                    You scored {testScore} out of {testQuestions.length}
                  </p>
                </div>

                {testPassed ? (
                  <p className="text-xs text-emerald-700 font-bold bg-emerald-50 py-2 px-4 rounded-xl">
                    Topic marked as Completed!
                  </p>
                ) : (
                  <p className="text-xs text-rose-700 font-medium bg-rose-50 py-2 px-4 rounded-xl">
                    You need at least 2 correct answers to pass. Try again!
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleTakeTest}
                    className="flex-1 py-2.5 rounded-xl border text-xs font-bold text-on-surface hover:bg-slate-50"
                  >
                    Retake Test
                  </button>
                  <button
                    onClick={() => setShowTestModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : testQuestions.length > 0 ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant">
                  <span>Question {currentTestQ + 1} of {testQuestions.length}</span>
                  <span>Score: {testScore}</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-sm font-bold text-on-surface">{testQuestions[currentTestQ].question}</p>
                </div>

                <div className="space-y-2.5">
                  {testQuestions[currentTestQ].options.map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerTest(opt)}
                      className="w-full text-left p-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-on-surface hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-center text-on-surface-variant py-8">Could not load test questions. Please try again.</p>
            )}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
