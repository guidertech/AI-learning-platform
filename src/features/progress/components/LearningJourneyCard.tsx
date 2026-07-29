"use client";

import React from "react";
import { Milestone } from "@/types/progress";

interface LearningJourneyCardProps {
  milestones: Milestone[];
}

export default function LearningJourneyCard({ milestones }: LearningJourneyCardProps) {
  return (
    <div className="bg-white p-6 rounded-[28px] border border-outline-variant/15 shadow-sm space-y-4">
      <h4 className="font-bold text-xs text-outline uppercase tracking-wider">Milestones Reached</h4>
      <div className="flex gap-2.5 overflow-x-auto pb-1 hide-scrollbar">
        {milestones.map((mile) => (
          <div 
            key={mile.id}
            className={`shrink-0 flex items-center gap-1.5 p-3 rounded-full border text-[10px] font-bold ${mile.bgClass} ${mile.colorClass} ${mile.borderClass}`}
          >
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {mile.icon}
            </span>
            <span>{mile.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
