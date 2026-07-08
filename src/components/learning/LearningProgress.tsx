"use client";

import React from "react";

interface LearningProgressProps {
  currentStep: "learn" | "example" | "think" | "quiz";
  onStepChange?: (step: "learn" | "example" | "think" | "quiz") => void;
}

export default function LearningProgress({ currentStep, onStepChange }: LearningProgressProps) {
  const steps = [
    { id: "learn", name: "Learn", icon: "book" },
    { id: "example", name: "Example", icon: "visibility" },
    { id: "think", name: "Think", icon: "psychology" },
    { id: "quiz", name: "Quiz", icon: "quiz" }
  ];

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-surface-container-low/50 rounded-xl border border-outline-variant/10">
      {steps.map((st, idx) => {
        const isActive = currentStep === st.id;
        
        return (
          <React.Fragment key={st.id}>
            <button
              type="button"
              onClick={() => onStepChange?.(st.id as any)}
              className={`flex items-center gap-1.5 cursor-pointer transition-all ${
                isActive ? "text-primary font-bold scale-105" : "text-outline opacity-60 hover:opacity-90"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isActive ? "bg-primary ring-4 ring-primary/20" : "bg-outline"}`}></div>
              <span className="text-[10px] uppercase tracking-wider font-semibold">{st.name}</span>
            </button>
            {idx < steps.length - 1 && (
              <div className="h-[1px] flex-grow mx-3 bg-outline-variant/20"></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
