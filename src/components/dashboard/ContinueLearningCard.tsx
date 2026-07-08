"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface ContinueLearningCardProps {
  subjectName: string;
  chapterTitle: string;
  topicTitle: string;
  percentComplete: number;
}

export default function ContinueLearningCard({
  subjectName,
  chapterTitle,
  topicTitle,
  percentComplete,
}: ContinueLearningCardProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-3xl p-6 border border-outline-variant/15 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] text-primary uppercase font-bold tracking-wider">{subjectName}</span>
          <h3 className="font-bold text-base text-on-surface mt-0.5">{chapterTitle}</h3>
          <p className="text-xs text-on-surface-variant font-medium mt-1">Topic: <span className="text-primary font-bold">{topicTitle}</span></p>
        </div>
        <span className="text-xs font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">{percentComplete}% Complete</span>
      </div>

      <div className="space-y-2">
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${percentComplete}%` }}></div>
        </div>
      </div>

      <button 
        onClick={() => router.push("/learning/fractions")}
        className="w-full h-11 bg-primary text-white text-xs font-bold rounded-xl active:scale-[0.98] transition-all shadow-md cursor-pointer hover:bg-primary-container"
      >
        Resume Learning Workspace
      </button>
    </div>
  );
}
