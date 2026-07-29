"use client";

import {useId} from "react";
import {useAISpeechLanguage, type AISpeechLanguage} from "@/hooks/useAISpeechLanguage";

export default function AISpeechLanguageSelector() {
  const id = useId();
  const {language, setLanguage} = useAISpeechLanguage();

  return (
    <div data-no-translate className="relative shrink-0">
      <label htmlFor={id} className="sr-only">
        Choose Maya speaking language
      </label>
      <span className="material-symbols-outlined pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[15px] text-primary">
        language
      </span>
      <select
        id={id}
        value={language}
        onChange={(event) => setLanguage(event.target.value as AISpeechLanguage)}
        className="h-9 appearance-none rounded-xl border border-primary/15 bg-primary/5 py-0 pl-8 pr-7 text-[10px] font-bold text-primary outline-none transition-colors hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
        aria-label="Choose Maya speaking language"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
      </select>
      <span className="material-symbols-outlined pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[14px] text-primary/60">
        expand_more
      </span>
    </div>
  );
}
