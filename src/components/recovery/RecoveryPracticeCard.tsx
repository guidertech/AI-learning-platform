"use client";

import React from "react";

interface RecoveryPracticeCardProps {
  questionText: string;
  options: { label: string; text: string; value: string }[];
  selectedOption: string | null;
  checked: boolean;
  isCorrect: boolean;
  onSelectOption: (val: string) => void;
}

export default function RecoveryPracticeCard({
  questionText,
  options,
  selectedOption,
  checked,
  isCorrect,
  onSelectOption,
}: RecoveryPracticeCardProps) {
  return (
    <section className="bg-blue-50/50 rounded-[24px] p-5 border border-blue-100 space-y-4">
      <div>
        <h3 className="font-bold text-sm text-on-surface">Concept Check</h3>
        <p className="text-xs text-on-surface-variant font-medium leading-relaxed mt-1">
          {questionText}
        </p>
      </div>

      <div className="space-y-2.5">
        {options.map((opt) => {
          const isSelected = selectedOption === opt.value;
          let btnStyle = "border-transparent bg-white";
          let labelStyle = "bg-slate-100 text-primary";

          if (isSelected) {
            btnStyle = "border-primary bg-primary-fixed/20";
            labelStyle = "bg-primary text-white";
          }

          if (checked) {
            if (isSelected) {
              btnStyle = isCorrect ? "border-green-500 bg-green-50/20" : "border-red-500 bg-red-50/20";
              labelStyle = isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white";
            } else if (opt.value === "B" && !isCorrect) {
              btnStyle = "border-green-500 bg-green-50/10";
              labelStyle = "bg-green-500 text-white";
            }
          }

          return (
            <button 
              key={opt.value}
              onClick={() => onSelectOption(opt.value)}
              disabled={checked}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-center px-4 gap-3 text-left shadow-sm cursor-pointer ${btnStyle}`}
            >
              <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs shrink-0 ${labelStyle}`}>
                {opt.label}
              </div>
              <div>
                <span className="text-xs text-on-surface font-semibold block">{opt.text}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
