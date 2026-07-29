"use client";

import React, { useRef, useEffect } from "react";
import { useLearning } from "@/context/LearningContext";
import { AISpeechLanguageSelector, AISpeechText } from "@/features/maya";

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
  const { isAISpeaking, activeAITranscription } = useLearning();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isAISpeaking) {
        videoRef.current.play().catch((err) => {
          // Ignore play interruptions which are handled gracefully by browsers
          console.log("Video play deferred:", err);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isAISpeaking]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const showLiveText = isAISpeaking && activeAITranscription;
  const displayedText = showLiveText ? activeAITranscription : descriptionText;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedText]);

  return (
    <section className="bg-white rounded-2xl p-5 border border-outline-variant/15 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <span className="inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 text-primary uppercase">📖 Topic Lesson</span>
          <h2 className="font-bold text-base text-on-surface mt-1">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <AISpeechLanguageSelector />
        </div>
      </div>
      
      <div className="aspect-video rounded-xl bg-surface-container overflow-hidden relative border border-outline-variant/10 select-none flex items-center justify-center">
        {/* HTML5 video avatar player. Preloads auto to show the first frame (avatar sitting) immediately. */}
        <video 
          ref={videoRef}
          src="/maya_avatar.mp4"
          className="w-full h-full object-cover"
          style={{ transform: "scale(1.25)", transformOrigin: "center center" }}
          loop
          muted
          playsInline
          preload="auto"
        />
      </div>
      
      <div className={`p-4 rounded-xl border transition-all duration-300 ${
        showLiveText 
          ? "bg-primary/5 border-primary/20 shadow-sm" 
          : "bg-slate-50 border-outline-variant/10"
      }`}>
        <div className="flex items-start gap-2.5">
          <span className={`material-symbols-outlined text-[18px] mt-0.5 shrink-0 ${
            showLiveText ? "text-primary animate-pulse" : "text-outline"
          }`}>
            {showLiveText ? "campaign" : "info"}
          </span>
          <div 
            ref={scrollRef}
            className="flex-1 max-h-[72px] overflow-y-auto custom-mini-scrollbar pr-1"
          >
            <p className={`text-xs leading-relaxed ${
              showLiveText ? "text-primary font-bold" : "text-on-surface-variant"
            }`}>
              <AISpeechText text={displayedText} />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
