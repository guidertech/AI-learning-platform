"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface AIRecommendationCardProps {
  studentName: string;
  recommendationText: string;
  actionLabel: string;
  actionHref: string;
}

export default function AIRecommendationCard({
  studentName,
  recommendationText,
  actionLabel,
  actionHref,
}: AIRecommendationCardProps) {
  const router = useRouter();

  return (
    <div className="bg-linear-to-br from-primary/5 via-primary-fixed/20 to-[#f3f0ff] p-6 rounded-[28px] border border-white/50 shadow-sm flex gap-4">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-primary-fixed border border-primary/20 shrink-0 select-none shadow-sm">
        <img 
          className="w-full h-full object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAX59yUFIdkA2OyIV-0z7-13MBmtWophJHBh2E0i2iSyPSELxOhpbB8fouRH2GTOMoFEA3lsR3fimuOyy6cp1c0Rxme0q6KXTAjNw6NS3cYtk4SyaMN7OTWiO99_55RllMsJtUecrAni7Jw1txtIb8tZjeCS0dtF59X-v-4QVkiEdQgVZsC8esS5cTwf4cTV-g1aSoUlEwBrTFgasyBp1DHnQR0XfQD1fu4Q6W_Brf22Mhjm4clHh1KuIIy1cMpBIp3IISLyxDLSeg"
          alt="Maya AI Avatar"
        />
      </div>
      
      <div className="space-y-3 flex-grow">
        <div>
          <span className="text-[9px] text-primary uppercase font-bold tracking-wider">Maya's Recommendation</span>
          <p className="text-xs text-on-surface leading-relaxed font-semibold mt-1">
            "Hi {studentName}! {recommendationText}"
          </p>
        </div>
        <button 
          onClick={() => router.push(actionHref)}
          className="px-4 py-2 bg-primary hover:bg-primary-container text-white text-[10px] font-bold rounded-xl active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
