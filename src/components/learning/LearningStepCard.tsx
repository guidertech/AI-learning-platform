"use client";

import React from "react";

interface LearningStepCardProps {
  stepNumber: number;
  title: string;
  durationText: string;
  imageSrc: string;
  descriptionText: string;
}

export default function LearningStepCard({
  stepNumber,
  title,
  durationText,
  imageSrc,
  descriptionText,
}: LearningStepCardProps) {
  return (
    <section className="bg-white rounded-2xl p-5 border border-outline-variant/15 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <span className="inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 text-primary uppercase">📖 Step {stepNumber}: Learn</span>
          <h2 className="font-bold text-base text-on-surface mt-1">{title}</h2>
        </div>
        <span className="text-[10px] text-outline font-semibold">{durationText}</span>
      </div>
      
      <div className="aspect-video rounded-xl bg-surface-container overflow-hidden relative border border-outline-variant/10 select-none">
        <img 
          className="w-full h-full object-cover" 
          src={imageSrc}
          alt={title}
        />
      </div>
      
      <p className="text-xs text-on-surface-variant leading-relaxed">
        {descriptionText}
      </p>
    </section>
  );
}
