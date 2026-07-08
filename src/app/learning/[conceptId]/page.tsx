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

interface LearningWorkspacePageProps {
  params: Promise<{ conceptId: string }>;
}

export default function LearningWorkspacePage({ params }: LearningWorkspacePageProps) {
  const router = useRouter();
  const { conceptId } = use(params);

  const { incrementStudyTime } = useLearning();
  const [activeStep, setActiveStep] = useState<"learn" | "example" | "think" | "quiz">("learn");
  const [selectedThinkOpt, setSelectedThinkOpt] = useState<string | null>(null);
  const [thinkChecked, setThinkChecked] = useState(false);
  const [thinkCorrect, setThinkCorrect] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Increment study time every minute
  useEffect(() => {
    const timer = setInterval(() => incrementStudyTime(1), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleThinkSelect = (opt: string) => {
    if (thinkChecked) return;
    setSelectedThinkOpt(opt);
  };

  const handleCheckThink = () => {
    if (!selectedThinkOpt) return;
    setThinkChecked(true);
    setThinkCorrect(selectedThinkOpt.includes("2 slices"));
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
        title="🤖 Maya AI Workspace"
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
                  title="Understanding the Parts"
                  durationText="~30 sec"
                  imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBDf_IKR0yBGVX2eJ1rWVxjCQoz4YAdX1dJDCDCPv2lhlDdOlpQrpUqUm02hR_fhsI5rSuuZ2APm2G9DuaXDUdAM4OCf4dOIN6Tqy9MlbRXQW4hvn-trVr-T6dHirbxqNJTvcvxDklhcHUOP8wJE_qJmhET3suQ-J9Pep4g_8-I0NMnw1mGyixBi1e_e40D5jXEJt1otZNb7x-KO4LpwE3X27YfHYClYLcJObpzux4UtcrRA1Di52lUUSKu8XaiCTS0hWryLjQwHyQ"
                  descriptionText="Think of a fraction as a 'part of a whole.' When you divide one thing into several equal pieces, each piece represents a fraction."
                />
              )}

              {/* Step 2 – Example */}
              {activeStep === "example" && (
                <RealLifeExampleCard
                  stepNumber={2}
                  title="The Pizza Party"
                  durationText="~1 min"
                  imageSrc="https://lh3.googleusercontent.com/aida/AP1WRLsjwJ-9ibIX6zhvQAlRqvsLnrxUdURPxkrgpFL4qpDmAUrYiOSoZjMX_ipBnum3RlucxR89ZdFbeOPBZHnBcgcuQannTPDGeYgH2itqehbkS1ObWqxLb5JHulkAVQw-K-uhHrxU5Qnbfl2NkJYrS-0o2BPT3Jcezg3LjZNZcVqB2Ja-TsiTmAmbXGwl3fDanKnxoaGOQKubJ6_EpdDI60eAyH8rVLdxQPZhbTVYN7OIAvIXUXdSXPW58oY"
                  descriptionText="If a pizza is cut into 8 equal slices, and you eat 1 slice, you've consumed 1/8. The 1 is your part, and the 8 is the total whole!"
                />
              )}

              {/* Step 3 – Think */}
              {activeStep === "think" && (
                <ThinkCard
                  promptText="If you share a pizza with 3 friends (4 people total), how many slices does everyone get if it's cut into 8?"
                  options={["1 slice (1/8)", "2 slices (2/8 or 1/4)", "3 slices (3/8)"]}
                  selectedOption={selectedThinkOpt}
                  onSelectOption={handleThinkSelect}
                  checked={thinkChecked}
                  isCorrect={thinkCorrect}
                  onCheckAnswer={handleCheckThink}
                  correctAnswerText="2 slices (2/8 or 1/4)"
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
