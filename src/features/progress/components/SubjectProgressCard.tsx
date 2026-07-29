"use client";

import React from "react";
import { SubjectProficiency } from "@/types/progress";

interface SubjectProgressCardProps {
  proficiencies: SubjectProficiency[];
}

export default function SubjectProgressCard({ proficiencies }: SubjectProgressCardProps) {
  return (
    <div className="bg-white p-6 rounded-[28px] border border-outline-variant/20 shadow-sm space-y-6">
      <h3 className="font-bold text-sm text-on-surface">Subject Proficiency Index</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        {proficiencies.map((sub, idx) => (
          <div key={idx} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-on-surface">
              <span>{sub.name}</span>
              <span className="text-primary">{sub.score}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className={`h-full ${sub.colorClass} rounded-full`} style={{ width: `${sub.score}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
