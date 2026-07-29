"use client";

import React from "react";

interface OptionCardProps {
  label: string; // "A", "B", etc.
  optionText: string;
  isSelected: boolean;
  checked: boolean;
  isCorrect: boolean;
  onClick: () => void;
}

export default function OptionCard({
  label,
  optionText,
  isSelected,
  checked,
  isCorrect,
  onClick,
}: OptionCardProps) {
  let btnStyle = "border-outline-variant hover:border-primary/40 bg-white";
  let labelStyle = "bg-surface-container text-primary";

  if (isSelected) {
    btnStyle = "border-primary bg-primary/5";
    labelStyle = "bg-primary text-white";
  }

  if (checked) {
    if (isCorrect) {
      btnStyle = "border-green-500 bg-green-50/30";
      labelStyle = "bg-green-500 text-white";
    } else if (isSelected) {
      btnStyle = "border-red-500 bg-red-50/30";
      labelStyle = "bg-red-500 text-white";
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={checked}
      className={`flex items-center p-4 border rounded-[20px] active:scale-95 transition-all text-left shadow-sm cursor-pointer w-full ${btnStyle}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 shrink-0 transition-colors ${labelStyle}`}>
        {label}
      </div>
      <span className="font-bold text-sm text-on-surface">{optionText}</span>
    </button>
  );
}
