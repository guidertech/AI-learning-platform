"use client";

import React from "react";
import {useRouter} from "next/navigation";

interface ContinueLearningCardProps {
  subjectName: string;
  chapterTitle: string;
  topicTitle: string;
  percentComplete: number;
  resumeHref: string;
  hasLearningHistory?: boolean;
}

export default function ContinueLearningCard({
  subjectName,
  chapterTitle,
  topicTitle,
  resumeHref,
  hasLearningHistory = true,
}: ContinueLearningCardProps) {
  const router = useRouter();

  if (!hasLearningHistory) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-outline-variant/15 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px]">auto_stories</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Welcome to ClassOrbit</span>
            <h3 className="font-bold text-base text-on-surface mt-1">Start Your Learning Journey</h3>
            <p className="text-xs text-on-surface-variant font-medium mt-1">
              Choose a subject and begin your first topic with Maya.
            </p>
          </div>
          <button
            onClick={() => router.push("/subjects")}
            className="h-11 px-6 bg-primary text-white text-xs font-bold rounded-xl active:scale-[0.98] transition-all shadow-md cursor-pointer hover:bg-primary-container flex items-center justify-center gap-2 shrink-0"
          >
            Explore Subjects
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-outline-variant/15 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] text-primary uppercase font-bold tracking-wider">{subjectName}</span>
          <h3 className="font-bold text-base text-on-surface mt-0.5">{chapterTitle}</h3>
          <p className="text-xs text-on-surface-variant font-medium mt-1">Topic: <span className="text-primary font-bold">{topicTitle}</span></p>
        </div>
      </div>

      <button 
        onClick={() => router.push(resumeHref)}
        className="w-full h-11 bg-primary text-white text-xs font-bold rounded-xl active:scale-[0.98] transition-all shadow-md cursor-pointer hover:bg-primary-container"
      >
        Resume Learning Workspace
      </button>
    </div>
  );
}
