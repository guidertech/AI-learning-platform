"use client";

import React from "react";
import {useRouter} from "next/navigation";

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    { 
      key: "progressTracker", 
      name: "Progress Tracker", 
      desc: "Track topic progress & check study history", 
      icon: "trending_up", 
      href: "/progress", 
      color: "text-white bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-400 hover:shadow-[0_12px_30px_rgba(59,130,246,0.3)]" 
    },
    { 
      key: "testReport", 
      name: "Test Report", 
      desc: "Check quiz scores & detailed performance analytics", 
      icon: "analytics", 
      href: "/reports", 
      color: "text-white bg-gradient-to-br from-rose-500 to-red-600 border-rose-400 hover:shadow-[0_12px_30px_rgba(244,63,94,0.3)]" 
    },
    { 
      key: "aiHomeworkHelper", 
      name: "AI Homework Helper", 
      desc: "Ask Maya homework queries & get smart hints", 
      icon: "assignment", 
      href: "/homework", 
      color: "text-white bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-400 hover:shadow-[0_12px_30px_rgba(16,185,129,0.3)]" 
    },
    { 
      key: "practiceQuiz", 
      name: "Practice Quiz", 
      desc: "Take quick challenges to test your concepts", 
      icon: "quiz", 
      href: "/quiz/latest", 
      color: "text-white bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400 hover:shadow-[0_12px_30px_rgba(245,158,11,0.3)]" 
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 select-none">
      {actions.map((act) => (
        <button
          key={act.key}
          onClick={() => router.push(act.href)}
          className={`w-full flex flex-col items-start text-left p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 cursor-pointer active:scale-[0.98] ${act.color} group`}
        >
          <div className="flex w-full items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-sm border border-white/25 group-hover:scale-105 transition-transform duration-300 text-white">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {act.icon}
              </span>
            </div>
            <span className="material-symbols-outlined text-[18px] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300 text-white">
              chevron_right
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-white mb-0.5 block">{act.name}</span>
          <span className="text-[10px] sm:text-[11px] text-white/85 font-medium leading-relaxed block line-clamp-2">
            {act.desc}
          </span>
        </button>
      ))}
    </div>
  );
}
