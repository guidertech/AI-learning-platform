"use client";

import React from "react";
import { DailyStudyStats } from "@/types/progress";

interface ProgressStatsProps {
  stats: DailyStudyStats[];
  avgStudyHours: string;
  totalLessons: number;
}

export default function ProgressStats({ stats, avgStudyHours, totalLessons }: ProgressStatsProps) {
  return (
    <div className="bg-white p-6 rounded-[28px] border border-outline-variant/20 shadow-sm flex flex-col justify-between h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-sm text-on-surface">Weekly Study Hours</h3>
        <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-[10px] font-bold border border-orange-200">
          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          <span>12-Day Streak Active</span>
        </div>
      </div>

      {/* Bar Chart Mock */}
      <div className="h-44 w-full flex items-end justify-between px-2 gap-4 select-none">
        {stats.map((bar, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 flex-grow group cursor-pointer">
            <div 
              className={`w-full rounded-t-lg transition-all duration-500 ${
                bar.active ? "bg-primary" : "bg-slate-100 hover:bg-primary-fixed"
              }`} 
              style={{ height: bar.heightPercent }}
            ></div>
            <span className={`text-[10px] font-bold ${bar.active ? "text-primary" : "text-outline"}`}>{bar.day}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100 flex justify-around select-none">
        <div className="text-center">
          <div className="font-bold text-base text-on-surface">{avgStudyHours}</div>
          <div className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider">Avg Daily Study</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-base text-on-surface">{totalLessons}</div>
          <div className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider">Lessons Finished</div>
        </div>
      </div>
    </div>
  );
}
