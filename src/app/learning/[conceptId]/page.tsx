"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useLearning } from "@/context/LearningContext";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import LearningStepCard from "@/components/learning/LearningStepCard";
import MayaPanel from "@/components/learning/MayaPanel";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import { topicContents } from "@/lib/mock/topicContent";
import { mockChapters } from "@/lib/mock/chapters";

interface LearningWorkspacePageProps {
  params: Promise<{ conceptId: string }>;
}

export default function LearningWorkspacePage({ params }: LearningWorkspacePageProps) {
  const router = useRouter();
  const { conceptId } = use(params);

  const { incrementStudyTime, initializeChatForTopic, setActiveChapter } = useLearning();
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Search for the topic details in the chapters database
  let topicTitle = "Learning Workspace";
  let activeChapterTitle = "Chapter";
  let foundTopic: any = null;

  for (const subId in mockChapters) {
    for (const ch of mockChapters[subId]) {
      const t = ch.topics.find((tp) => tp.slug === conceptId);
      if (t) {
        foundTopic = t;
        topicTitle = t.title;
        activeChapterTitle = ch.title;
        break;
      }
    }
    if (foundTopic) break;
  }

  const defaultTopicContent = {
    title: topicTitle,
    tutorWelcomeMessage: `Hi! I'm Maya. Today we are learning about "${topicTitle}" in ${activeChapterTitle}. Feel free to ask me any questions!`,
    learnStep: {
      title: `Introduction to ${topicTitle}`,
      durationText: "~1 min",
      imageSrc: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
      descriptionText: `In this lesson, we will explore the core concepts of "${topicTitle}". Interact with the Socratic AI Panel on the right to study and solve your doubts together.`
    },
    exampleStep: {
      title: "Real Life Application",
      durationText: "~1 min",
      imageSrc: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&auto=format&fit=crop&q=60",
      descriptionText: `Understanding "${topicTitle}" helps us solve real-world problems and build logical reasoning skills.`
    },
    thinkStep: {
      promptText: `Ready to test your understanding of ${topicTitle}?`,
      options: ["Yes, let's start!", "Need a bit more review"],
      correctAnswerText: "Yes, let's start!"
    },
    quickReplies: [
      `What is ${topicTitle}?`,
      `Give me an example of ${topicTitle}`,
      `Why do we learn ${topicTitle}?`
    ]
  };

  const topicContent = topicContents[conceptId] || defaultTopicContent;

  // Find current chapter and next topic
  let currentChapterObj: any = null;
  let nextTopicSlug: string | null = null;
  let isLastTopic = false;

  for (const subId in mockChapters) {
    for (const ch of mockChapters[subId]) {
      const topicIdx = ch.topics.findIndex((t) => t.slug === conceptId);
      if (topicIdx !== -1) {
        currentChapterObj = ch;
        if (topicIdx + 1 < ch.topics.length) {
          nextTopicSlug = ch.topics[topicIdx + 1].slug;
        } else {
          isLastTopic = true;
        }
        break;
      }
    }
    if (currentChapterObj) break;
  }

  const handleNextTopicClick = () => {
    if (isLastTopic && currentChapterObj) {
      router.push(`/quiz/chapter/${currentChapterObj.id}`);
    } else if (nextTopicSlug) {
      router.push(`/learning/${nextTopicSlug}`);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Increment study time every minute
  useEffect(() => {
    const timer = setInterval(() => incrementStudyTime(1), 60000);
    return () => clearInterval(timer);
  }, []);

  // Initialize welcome message for Maya Panel based on the current topic
  useEffect(() => {
    if (topicContent) {
      const welcomeMsg = `चलिए आज हम "${activeChapterTitle}" का टॉपिक "${topicTitle}" पढ़ते हैं! 🚀\n\nमैं आपको इस टॉपिक के बारे में समझाऊँगी और आपसे कुछ मज़ेदार सवाल पूछूँगी। क्या आप शुरू करने के लिए तैयार हैं?`;
      initializeChatForTopic(topicTitle, welcomeMsg);
      setActiveChapter(activeChapterTitle);
      
      // Save checkpoint for "AI Workspace" sidebar resume action
      localStorage.setItem("last_studied_topic", conceptId);
      sessionStorage.setItem("last_studied_topic", conceptId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conceptId]);

  const defaultNoteImages = [
    "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1518133680790-398535021117?w=800&auto=format&fit=crop&q=60"
  ];
  const noteImages = topicContent?.noteImages || defaultNoteImages;

  return (
    <PageContainer>
      <Topbar
        title={`🤖 Maya Workspace: ${topicContent.title}`}
        subtitle="Interact with Maya to master this topic"
        showBack={true}
      />

      {loading ? (
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
                  <button
                    onClick={() => router.push("/quiz/topic-quiz")}
                    className="flex-1 h-12 bg-white border border-outline-variant/30 text-on-surface font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 active:scale-[0.98] transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">quiz</span>
                    <span>Test This Topic</span>
                  </button>

                  <button
                    onClick={handleNextTopicClick}
                    className="flex-1 h-12 bg-primary text-white font-bold rounded-2xl shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] hover:opacity-95 transition-all"
                  >
                    <span>{isLastTopic ? "Finish Chapter & Take Test" : "Next Topic"}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Right Side: Notes Sidebar (w-[35%]) */}
              <aside className="w-full lg:w-[35%] space-y-6">
                <div className="bg-white rounded-2xl p-5 border border-outline-variant/15 shadow-sm space-y-5">
                  <div className="flex items-center gap-2 border-b border-outline-variant/10 pb-3">
                    <span className="material-symbols-outlined text-primary text-[20px]">description</span>
                    <h3 className="font-bold text-sm text-on-surface">Notes</h3>
                  </div>

                  <div className="space-y-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant">
                      <span className="material-symbols-outlined text-[15px] text-outline">image</span>
                      <span>Images</span>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {noteImages.map((src, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImage(src)}
                          className="flex items-center justify-between p-3.5 rounded-xl border border-outline-variant/15 bg-slate-50 hover:bg-primary/5 hover:border-primary/20 text-left cursor-pointer transition-all active:scale-[0.98] group w-full"
                        >
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">
                              image
                            </span>
                            <span className="text-xs font-semibold text-on-surface-variant group-hover:text-primary transition-colors">
                              Image {idx === 0 ? "One" : "Two"}
                            </span>
                          </div>
                          <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[16px]">
                            visibility
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            </div>

            {/* Breathing space at bottom */}
            <div className="h-28" />
          </main>
        </div>
      )}

      {/* Floating Maya AI panel — FAB + bottom-sheet/slide-over */}
      {!loading && <MayaPanel autoStartVoice={true} />}

      {/* Note Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative bg-white rounded-2xl p-3 max-w-[90vw] max-h-[85vh] overflow-hidden border border-outline-variant/10 shadow-2xl flex flex-col items-center animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-all z-10"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {/* High-res Image */}
            <div className="rounded-xl overflow-hidden max-h-[75vh] w-full flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Selected Note Detail"
                className="max-w-full max-h-[75vh] object-contain select-none"
              />
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
