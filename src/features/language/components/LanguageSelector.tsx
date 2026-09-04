"use client";

import { useId, useState, useEffect } from "react";
import { useLanguage } from "../store/LanguageContext";

const LANGUAGE_OPTIONS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
] as const;

type LanguageSelectorProps = {
  variant?: "compact" | "settings";
};

export default function LanguageSelector({
  variant = "compact",
}: LanguageSelectorProps) {
  const id = useId();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    language,
    selection,
    availability,
    setLanguage,
    selectDetectedLanguage,
  } = useLanguage();
  const isSettings = variant === "settings";

  const handleChange = (value: string) => {
    if (value === "auto") {
      selectDetectedLanguage();
    } else {
      setLanguage(value);
    }
  };

  return (
    <div
      data-no-translate
      className={isSettings ? "space-y-2" : "relative shrink-0"}
    >
      {isSettings && (
        <div className="flex items-start justify-between gap-4 px-1">
          <div>
            <label
              htmlFor={id}
              className="flex items-center gap-2 text-xs font-bold text-violet-950"
            >
              <span className="material-symbols-outlined text-[17px] text-violet-600">
                language
              </span>
              Display Language
            </label>
            <p className="mt-1 text-[10px] font-semibold text-violet-800/70">
              Translate interface text in this browser only.
            </p>
          </div>
          {isMounted && selection === "auto" && (
            <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 text-[9px] font-bold text-violet-600">
              Detected: {language.toUpperCase()}
            </span>
          )}
        </div>
      )}

      <div className="relative text-slate-800">
        {!isSettings && (
          <span className="material-symbols-outlined pointer-events-none absolute left-1/2 lg:left-2.5 top-1/2 z-10 -translate-x-1/2 lg:translate-x-0 -translate-y-1/2 text-[18px] text-primary">
            language
          </span>
        )}
        <select
          id={id}
          aria-label="Choose display language"
          value={isMounted ? (selection === "auto" ? (language === "hi" ? "hi" : "en") : selection) : "en"}
          onChange={(event) => handleChange(event.target.value)}
          className={
            isSettings
              ? "h-12 w-full appearance-none rounded-xl border border-violet-100 bg-white px-4 pr-10 text-xs font-bold text-slate-800 outline-none transition-all hover:border-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              : "h-9 w-9 lg:h-10 lg:w-auto lg:max-w-[190px] appearance-none rounded-xl border border-outline-variant/20 bg-white/90 py-0 pl-0 lg:pl-9 pr-0 lg:pr-8 text-transparent lg:text-on-surface text-[11px] font-bold shadow-sm outline-none transition-colors hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer"
          }
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <option key={option.code} value={option.code} className="bg-white text-on-surface">
              {option.label}
            </option>
          ))}
        </select>
        <span className={`material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[17px] ${isSettings ? "text-violet-700/80" : "hidden lg:block text-outline"}`}>
          expand_more
        </span>
      </div>

      {isSettings && language !== "en" && availability !== "available" && (
        <p className="px-1 text-[10px] font-semibold text-violet-800/80" role="status">
          {availability === "unavailable"
            ? "Browser translation is unavailable. English will remain visible."
            : availability === "downloading" || availability === "downloadable"
              ? "Preparing the browser language model…"
              : "Checking browser translation support…"}
        </p>
      )}
    </div>
  );
}
