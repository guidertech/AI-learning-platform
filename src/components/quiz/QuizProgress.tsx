"use client";

import React from "react";

interface QuizProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

export default function QuizProgress({ currentQuestionIndex, totalQuestions }: QuizProgressProps) {
  const completionPercent = Math.round((currentQuestionIndex / totalQuestions) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <p className="text-xs text-primary font-bold">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
        <p className="text-[10px] text-outline font-semibold">{completionPercent}% Complete</p>
      </div>
      <div className="h-1.5 w-full bg-[#F3F0FF] rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500" 
          style={{ width: `${(currentQuestionIndex / totalQuestions) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
