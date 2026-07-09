"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useLearning } from "@/context/LearningContext";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import LearningStepCard from "@/components/learning/LearningStepCard";
import RealLifeExampleCard from "@/components/learning/RealLifeExampleCard";
import ThinkCard from "@/components/learning/ThinkCard";
import LearningProgress from "@/components/learning/LearningProgress";
import MayaPanel from "@/components/learning/MayaPanel";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import { topicContents } from "@/lib/mock/topicContent";

interface LearningWorkspacePageProps {
  params: Promise<{ conceptId: string }>;
}

export default function LearningWorkspacePage({ params }: LearningWorkspacePageProps) {
  const router = useRouter();
  const { conceptId } = use(params);

  const { incrementStudyTime, initializeChatForTopic } = useLearning();
  const [activeStep, setActiveStep] = useState<"learn" | "example" | "think" | "quiz">("learn");
  const [selectedThinkOpt, setSelectedThinkOpt] = useState<string | null>(null);
  const [thinkChecked, setThinkChecked] = useState(false);
  const [thinkCorrect, setThinkCorrect] = useState(false);
  const [loading, setLoading] = useState(true);

  const topicContent = topicContents[conceptId] || topicContents["fractions-intro"];

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
      initializeChatForTopic(topicContent.title, topicContent.tutorWelcomeMessage);
    }
  }, [conceptId, topicContent]);

  const handleThinkSelect = (opt: string) => {
    if (thinkChecked) return;
    setSelectedThinkOpt(opt);
  };

  const handleCheckThink = () => {
    if (!selectedThinkOpt) return;
    setThinkChecked(true);
    setThinkCorrect(selectedThinkOpt === topicContent.thinkStep.correctAnswerText);
  };

  const handleStepChange = (step: "learn" | "example" | "think" | "quiz") => {
    if (step === "quiz") {
      router.push("/quiz/topic-quiz");
    } else {
      setActiveStep(step);
    }
  };

  return (
    <PageContainer>
      <Topbar
        title={`🤖 Maya Workspace: ${topicContent.title}`}
        subtitle="Spend active minutes in workspace to solve today's goals"
        showBack={true}
      />

      {loading ? (
        <main className="p-4 md:p-8 max-w-300 mx-auto w-full">
          <LoadingSkeleton type="workspace" />
        </main>
      ) : (
        <div className="flex flex-col h-[calc(100dvh-64px)] md:h-[calc(100dvh-80px)] overflow-hidden">
          {/* Step progress bar */}
          <div className="p-4 md:p-6 pb-2 bg-white border-b border-outline-variant/10 shrink-0">
            <LearningProgress currentStep={activeStep} onStepChange={handleStepChange} />
          </div>

          {/* Full-width lesson content */}
          <main className="flex-1 overflow-y-auto bg-[#f8f9ff] px-4 py-6 md:px-10 md:py-8">
            <div className="max-w-[720px] mx-auto space-y-6">

              {/* Step 1 – Learn */}
              {activeStep === "learn" && (
                <LearningStepCard
                  stepNumber={1}
                  title={topicContent.learnStep.title}
                  durationText={topicContent.learnStep.durationText}
                  imageSrc={topicContent.learnStep.imageSrc}
                  descriptionText={topicContent.learnStep.descriptionText}
                />
              )}

              {/* Step 2 – Example */}
              {activeStep === "example" && (
                <RealLifeExampleCard
                  stepNumber={2}
                  title={topicContent.exampleStep.title}
                  durationText={topicContent.exampleStep.durationText}
                  imageSrc={topicContent.exampleStep.imageSrc}
                  descriptionText={topicContent.exampleStep.descriptionText}
                />
              )}

              {/* Step 3 – Think */}
              {activeStep === "think" && (
                <ThinkCard
                  promptText={topicContent.thinkStep.promptText}
                  options={topicContent.thinkStep.options}
                  selectedOption={selectedThinkOpt}
                  onSelectOption={handleThinkSelect}
                  checked={thinkChecked}
                  isCorrect={thinkCorrect}
                  onCheckAnswer={handleCheckThink}
                  correctAnswerText={topicContent.thinkStep.correctAnswerText}
                />
              )}

              {/* Breathing space at bottom so FAB doesn't cover CTA button */}
              <div className="h-28" />
            </div>
          </main>
        </div>
      )}

      {/* Floating Maya AI panel — FAB + bottom-sheet/slide-over */}
      {!loading && <MayaPanel />}
    </PageContainer>
  );
}
