"use client";

import {useId} from "react";
import {useLanguage} from "@/context/LanguageContext";

const LANGUAGE_OPTIONS = [
  {code: "auto", label: "🌐 Auto (Browser Default)"},
  {code: "en", label: "English"},
  {code: "hi", label: "हिन्दी"},
  {code: "bn", label: "বাংলা"},
  {code: "ta", label: "தமிழ்"},
  {code: "te", label: "తెలుగు"},
  {code: "mr", label: "मराठी"},
  {code: "gu", label: "ગુજરાતી"},
  {code: "kn", label: "ಕನ್ನಡ"},
  {code: "ml", label: "മലയാളം"},
  {code: "pa", label: "ਪੰਜਾਬੀ"},
  {code: "or", label: "ଓଡ଼ିଆ"},
  {code: "ur", label: "اردو"},
] as const;

type LanguageSelectorProps = {
  variant?: "compact" | "settings";
};

export default function LanguageSelector({
  variant = "compact",
}: LanguageSelectorProps) {
  const id = useId();
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
              className="flex items-center gap-2 text-xs font-bold text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[17px] text-primary">
                language
              </span>
              Display Language
            </label>
            <p className="mt-1 text-[10px] font-medium text-outline">
              Translate interface text in this browser only.
            </p>
          </div>
          {selection === "auto" && (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[9px] font-bold text-primary">
              Detected: {language.toUpperCase()}
            </span>
          )}
        </div>
      )}

      <div className="relative">
        {!isSettings && (
          <span className="material-symbols-outlined pointer-events-none absolute left-2.5 top-1/2 z-10 -translate-y-1/2 text-[18px] text-primary">
            language
          </span>
        )}
        <select
          id={id}
          aria-label="Choose display language"
          value={selection}
          onChange={(event) => handleChange(event.target.value)}
          className={
            isSettings
              ? "h-12 w-full appearance-none rounded-xl border border-outline-variant/20 bg-slate-50 px-4 pr-10 text-xs font-bold text-on-surface outline-none transition-colors hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
              : "h-10 max-w-[148px] appearance-none rounded-xl border border-outline-variant/20 bg-white/90 py-0 pl-9 pr-8 text-[11px] font-bold text-on-surface shadow-sm outline-none transition-colors hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/10 sm:max-w-[190px]"
          }
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[17px] text-outline">
          expand_more
        </span>
      </div>

      {isSettings && language !== "en" && availability !== "available" && (
        <p className="px-1 text-[10px] font-semibold text-outline" role="status">
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
