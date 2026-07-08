"use client";

import React from "react";

interface TodayGoalCardProps {
  studentMins: number;
  dailyGoal: number;
}

export default function TodayGoalCard({ studentMins, dailyGoal }: TodayGoalCardProps) {
  const percentage = Math.min(Math.round((studentMins / dailyGoal) * 100), 100);
  
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl p-6 border border-outline-variant/15 shadow-sm flex items-center justify-between gap-6">
      <div className="space-y-1">
        <span className="text-[10px] text-outline uppercase font-bold tracking-wider">Goal Progress</span>
        <h3 className="font-bold text-base text-on-surface">Today's Focus</h3>
        <p className="text-xs text-on-surface-variant font-medium mt-1">
          Spent <span className="text-primary font-bold">{studentMins} mins</span> out of your {dailyGoal} mins target.
        </p>
      </div>

      <div className="relative w-16 h-16 shrink-0 select-none">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle className="text-slate-100 stroke-current" cx="50" cy="50" fill="transparent" r="40" strokeWidth="8"></circle>
          <circle 
            className="text-primary stroke-current transition-all duration-750" 
            cx="50" 
            cy="50" 
            fill="transparent" 
            r="40" 
            strokeLinecap="round" 
            strokeWidth="8" 
            style={{ strokeDasharray: circumference, strokeDashoffset }}
          ></circle>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold text-xs text-primary">{percentage}%</span>
        </div>
      </div>
    </div>
  );
}
