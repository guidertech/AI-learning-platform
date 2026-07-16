"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    { name: "AI Homework", icon: "assignment", href: "/homework", color: "text-[#5341cd] bg-[#5341cd]/5 border-[#5341cd]/10" },
    { name: "Brain Profile", icon: "psychology", href: "/weakness-analysis/latest", color: "text-secondary bg-secondary/5 border-secondary/10" },
    { name: "Report", icon: "analytics", href: "/progress", color: "text-[#10b981] bg-[#10b981]/5 border-[#10b981]/10" },
    { name: "Practice Quiz", icon: "quiz", href: "/quiz/latest", color: "text-[#f59e0b] bg-[#f59e0b]/5 border-[#f59e0b]/10" }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((act) => (
        <button
          key={act.name}
          onClick={() => router.push(act.href)}
          className={`flex flex-col items-center justify-center p-5 rounded-[24px] border transition-all active:scale-95 hover:shadow-sm cursor-pointer ${act.color}`}
        >
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>{act.icon}</span>
          <span className="text-xs font-bold mt-2 text-on-surface">{act.name}</span>
        </button>
      ))}
    </div>
  );
}
