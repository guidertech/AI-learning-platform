"use client";

import React from "react";

interface QuestionCardProps {
  questionText: string;
  checked: boolean;
  explanation?: string;
}

export default function QuestionCard({ questionText, checked, explanation }: QuestionCardProps) {
  return (
    <div className="space-y-4">
      <h2 className="font-display font-bold text-lg text-on-surface leading-snug">
        {questionText}
      </h2>
      {checked && explanation && (
        <div className="p-4 bg-surface-container-low rounded-[20px] border border-outline-variant/20 relative overflow-hidden animate-fade-in">
          <p className="text-xs text-on-surface-variant leading-relaxed font-semibold">
            <strong>Explanation:</strong> {explanation}
          </p>
        </div>
      )}
    </div>
  );
}
