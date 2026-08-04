"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LanguageSelector } from "@/features/language";
import { useLearning } from "@/context/LearningContext";

interface TopbarProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  showSearch?: boolean;
  showBack?: boolean;
}

export default function Topbar({ title, subtitle, showBack = false }: TopbarProps) {
  const router = useRouter();
  const { studentName, studentLevel } = useLearning();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md flex justify-between items-center w-full px-4 md:px-8 h-16 md:h-20 border-b border-outline-variant/10 select-none">
      <div className="flex min-w-0 items-center gap-4">
        {/* Brand Logo inside Topbar */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
          </div>
          <span className="font-display font-bold text-sm text-primary tracking-tight hidden sm:block">ClassOrbit</span>
        </div>

        {/* Brand Divider */}
        <div className="h-5 w-px bg-slate-200/80 shrink-0" />

        {showBack && (
          <button
            onClick={() => router.back()}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-on-surface text-[20px] md:text-[24px]">arrow_back</span>
          </button>
        )}
        <div>
          <h1 className="font-display font-bold text-base md:text-xl text-on-surface leading-tight">{title}</h1>
          {subtitle && <p className="text-[10px] md:text-[11px] text-on-surface-variant font-medium mt-0.5 hidden xs:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <LanguageSelector />
        
        {/* Level pill badge in header */}
        <div className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full font-black text-[10px] uppercase tracking-wider shadow-2xs select-none border border-indigo-400/20">
          <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
          <span>Level {studentLevel}</span>
        </div>

        <div
          onClick={() => router.push("/settings")}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") router.push("/settings");
          }}
          aria-label="Open student profile"
          className="w-9 h-9 rounded-full border border-primary/20 bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 cursor-pointer hover:border-primary hover:bg-primary/20 transition-all select-none"
        >
          {studentName ? studentName.charAt(0).toUpperCase() : <span className="material-symbols-outlined text-[18px]">person</span>}
        </div>
      </div>
    </header>
  );
}

