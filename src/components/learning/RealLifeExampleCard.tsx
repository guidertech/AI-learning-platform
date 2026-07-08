"use client";

import React from "react";

interface RealLifeExampleCardProps {
  stepNumber: number;
  title: string;
  durationText: string;
  imageSrc: string;
  descriptionText: string;
}

export default function RealLifeExampleCard({
  stepNumber,
  title,
  durationText,
  imageSrc,
  descriptionText,
}: RealLifeExampleCardProps) {
  return (
    <section className="bg-orange-50/30 rounded-2xl p-5 border border-orange-200/20 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <span className="inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-orange-100 text-orange-700 uppercase">💡 Step {stepNumber}: Real Life Example</span>
          <h2 className="font-bold text-base text-on-surface mt-1">{title}</h2>
        </div>
        <span className="text-[10px] text-outline font-semibold">{durationText}</span>
      </div>

      <div className="w-full relative rounded-xl overflow-hidden border border-orange-100 select-none">
        <img 
          className="w-full h-48 object-cover" 
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
