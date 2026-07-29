"use client";

import React from "react";
import {useRouter} from "next/navigation";

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    { key: "progressTracker", name: "Progress Tracker", icon: "trending_up", href: "/progress", color: "text-[#5341cd] bg-[#5341cd]/5 border-[#5341cd]/10" },
    { key: "testReport", name: "Test Report", icon: "analytics", href: "/reports", color: "text-[#10b981] bg-[#10b981]/5 border-[#10b981]/10" },
    { key: "aiHomeworkHelper", name: "AI Homework Helper", icon: "assignment", href: "/homework", color: "text-[#3b82f6] bg-[#3b82f6]/5 border-[#3b82f6]/10" },
    { key: "practiceQuiz", name: "Practice Quiz", icon: "quiz", href: "/quiz/latest", color: "text-[#f59e0b] bg-[#f59e0b]/5 border-[#f59e0b]/10" }
  ];

  return (
    <div className="flex flex-col gap-3">
      {actions.map((act) => (
        <button
          key={act.key}
          onClick={() => router.push(act.href)}
          className={`flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-95 hover:shadow-sm cursor-pointer ${act.color}`}
        >
          <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center shrink-0 shadow-sm border border-black/5">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>{act.icon}</span>
          </div>
          <span className="text-sm font-bold text-on-surface">{act.name}</span>
          <span className="material-symbols-outlined ml-auto text-[18px] opacity-40">chevron_right</span>
        </button>
      ))}
    </div>
  );
}
