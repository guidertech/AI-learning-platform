"use client";

import React from "react";

interface RecoveryPlanCardProps {
  reason: string;
  durationMins: number;
}

export default function RecoveryPlanCard({ reason, durationMins }: RecoveryPlanCardProps) {
  return (
    <section className="bg-white rounded-[24px] p-5 border border-surface-container shadow-sm flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 text-secondary">
        <span className="material-symbols-outlined">lightbulb</span>
      </div>
      <div className="space-y-2">
        <h3 className="font-bold text-sm text-on-surface">Why were you stuck?</h3>
        <p className="text-xs text-on-surface-variant font-medium leading-relaxed">{reason}</p>
        <div className="flex gap-3 pt-1">
          <span className="flex items-center gap-1 text-[9px] font-bold text-on-tertiary-fixed-variant bg-tertiary-fixed px-2.5 py-0.5 rounded-full">
            <span className="material-symbols-outlined text-[12px]">timer</span> {durationMins} Min
          </span>
          <span className="flex items-center gap-1 text-[9px] font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full">
            <span className="material-symbols-outlined text-[12px]">bolt</span> Easy
          </span>
        </div>
      </div>
    </section>
  );
}
