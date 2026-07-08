"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useLearning } from "@/context/LearningContext";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import RecoveryIntroCard from "@/components/recovery/RecoveryIntroCard";
import RecoveryPlanCard from "@/components/recovery/RecoveryPlanCard";
import RecoveryPracticeCard from "@/components/recovery/RecoveryPracticeCard";

interface FractionsRecoveryPageProps {
  params: Promise<{ recoveryId: string }>;
}

export default function FractionsRecoveryPage({ params }: FractionsRecoveryPageProps) {
  const router = useRouter();
  const { recoveryId } = use(params);

  const { studentName, updateProgress } = useLearning();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelectOption = (opt: string) => {
    if (checked) return;
    setSelectedOption(opt);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    setChecked(true);
    const correct = selectedOption === "B";
    setIsCorrect(correct);

    if (correct) {
      updateProgress(70);
    }
  };

  const handleComplete = () => {
    router.push("/mastery-check/mixed-numbers");
  };

  const options = [
    { label: "A", text: "1 slice (1/8 of the whole)", value: "A" },
    { label: "B", text: "2 slices (2/8 or 1/4 of the whole)", value: "B" }
  ];

  return (
    <PageContainer>
      <Topbar 
        title="🧠 AI Learning Recovery" 
        subtitle="Visualizing fractional sharing gaps" 
      />

      <main className="p-8 max-w-[1200px] mx-auto w-full space-y-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push("/learning/fractions")}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <span className="text-xs font-bold text-outline uppercase tracking-wider">Back to Workspace</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Lesson Details - 6 cols */}
          <div className="lg:col-span-6 space-y-6">
            <RecoveryIntroCard studentName={studentName} />

            <section className="bg-orange-50 rounded-[32px] p-6 border border-orange-100 text-center relative max-w-md mx-auto select-none">
              <div className="relative w-full aspect-square max-w-[240px] mx-auto mb-3">
                <img 
                  alt="Pizza slices" 
                  className="w-full h-full object-contain drop-shadow-md" 
                  src="https://lh3.googleusercontent.com/aida/AP1WRLsjwJ-9ibIX6zhvQAlRqvsLnrxUdURPxkrgpFL4qpDmAUrYiOSoZjMX_ipBnum3RlucxR89ZdFbeOPBZHnBcgcuQannTPDGeYgH2itqehbkS1ObWqxLb5JHulkAVQw-K-uhHrxU5Qnbfl2NkJYrS-0o2BPT3Jcezg3LjZNZcVqB2Ja-TsiTmAmbXGwl3fDanKnxoaGOQKubJ6_EpdDI60eAyH8rVLdxQPZhbTVYN7OIAvIXUXdSXPW58oY"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur shadow px-3 py-1 rounded-full border border-orange-200">
                  <span className="text-orange-600 font-bold text-[10px]">1/4 = One Quarter</span>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant font-medium italic">
                🍕 Every slice represents one equal part of the whole pizza.
              </p>
            </section>
          </div>

          {/* Right Column: Practice Check - 6 cols */}
          <div className="lg:col-span-6 bg-white p-6 rounded-[28px] border border-outline-variant/15 shadow-sm flex flex-col justify-between h-fit min-h-[400px]">
            <div className="space-y-6">
              <RecoveryPlanCard 
                reason="Temporary confusion dividing objects equally." 
                durationMins={5} 
              />

              <RecoveryPracticeCard 
                questionText="If you share a pizza with 3 friends (4 people total), how many slices does everyone get if it's cut into 8?"
                options={options}
                selectedOption={selectedOption}
                checked={checked}
                isCorrect={isCorrect}
                onSelectOption={handleSelectOption}
              />
            </div>

            <div className="pt-6 border-t border-slate-100">
              {!checked ? (
                <button 
                  onClick={handleCheckAnswer}
                  disabled={!selectedOption}
                  className={`w-full h-12 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-1.5 transition-all ${
                    selectedOption 
                      ? "bg-primary text-white cursor-pointer active:scale-95" 
                      : "bg-slate-300 text-slate-500 cursor-not-allowed opacity-60"
                  }`}
                >
                  <span>Check Answer</span>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              ) : (
                <button 
                  onClick={isCorrect ? handleComplete : () => { setChecked(false); setSelectedOption(null); }}
                  className={`w-full h-12 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isCorrect ? "bg-green-600 text-white hover:bg-green-700" : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {isCorrect ? "Continue to Mastery Check" : "Try Again"}
                </button>
              )}
            </div>
          </div>

        </div>
      </main>
    </PageContainer>
  );
}
