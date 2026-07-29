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
  const { studentName } = useLearning();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md flex justify-between items-center w-full px-4 md:px-8 h-16 md:h-20 border-b border-outline-variant/10 select-none">
      <div className="flex min-w-0 items-center gap-4">
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

      <div className="flex shrink-0 items-center gap-2 md:gap-3">
        <LanguageSelector />
        <button
          onClick={() => router.push("/settings")}
          aria-label="Open settings"
          className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
        <div
          onClick={() => router.push("/settings")}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") router.push("/settings");
          }}
          aria-label="Open student profile"
          className="w-9 h-9 rounded-full border border-primary/20 bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 cursor-pointer hover:border-primary hover:bg-primary/20 transition-all"
        >
          {studentName ? studentName.charAt(0).toUpperCase() : <span className="material-symbols-outlined text-[18px]">person</span>}
        </div>
      </div>
    </header>
  );
}

