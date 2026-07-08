"use client";

import React from "react";

interface ThinkCardProps {
  promptText: string;
  options: string[];
  selectedOption: string | null;
  onSelectOption: (opt: string) => void;
  checked: boolean;
  isCorrect: boolean;
  onCheckAnswer: () => void;
  correctAnswerText: string;
}

export default function ThinkCard({
  promptText,
  options,
  selectedOption,
  onSelectOption,
  checked,
  isCorrect,
  onCheckAnswer,
  correctAnswerText,
}: ThinkCardProps) {
  return (
    <section className="bg-blue-50/30 rounded-2xl p-5 border border-blue-200/20 shadow-sm space-y-4">
      <div>
        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-700 uppercase">🤔 Step 3: Think</span>
        <h3 className="font-bold text-base text-on-surface mt-1">Reflect on the Concept</h3>
        <p className="text-xs text-on-surface-variant leading-relaxed mt-2">{promptText}</p>
      </div>

      <div className="space-y-2">
        {options.map((opt) => {
          let btnStyle = "border-outline-variant/30 bg-white hover:border-primary/30";
          if (selectedOption === opt) btnStyle = "border-primary bg-primary/5";
          
          if (checked) {
            if (opt === correctAnswerText) {
              btnStyle = "border-green-500 bg-green-50/20";
            } else if (selectedOption === opt) {
              btnStyle = "border-red-500 bg-red-50/20";
            }
          }

          return (
            <button
              key={opt}
              type="button"
              disabled={checked}
              onClick={() => onSelectOption(opt)}
              className={`w-full p-3 rounded-xl border text-left text-xs font-semibold active:scale-[0.99] transition-all cursor-pointer ${btnStyle}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <div className="pt-2">
        {!checked ? (
          <button
            type="button"
            disabled={!selectedOption}
            onClick={onCheckAnswer}
            className={`w-full h-10 rounded-xl text-xs font-bold transition-all shadow-sm ${
              selectedOption
                ? "bg-primary text-white cursor-pointer active:scale-95"
                : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-60"
            }`}
          >
            Check Reflection
          </button>
        ) : (
          <div className={`p-3 rounded-xl text-xs ${isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {isCorrect ? "🎉 Exactly! Great thinking." : "🤔 Not quite. Think about how many slices make up a whole."}
          </div>
        )}
      </div>
    </section>
  );
}
