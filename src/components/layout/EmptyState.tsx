"use client";

import React from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
}

export default function EmptyState({ title, description, icon = "info" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-outline-variant/15 rounded-3xl space-y-4 max-w-sm mx-auto shadow-sm my-6 select-none">
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </div>
      <div>
        <h4 className="font-bold text-sm text-on-surface">{title}</h4>
        <p className="text-xs text-on-surface-variant leading-relaxed mt-1">{description}</p>
      </div>
    </div>
  );
}
