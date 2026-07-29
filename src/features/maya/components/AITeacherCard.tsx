"use client";

import React, { useState } from "react";
import {useAISpeechLanguage} from "@/hooks/useAISpeechLanguage";
import {translateForSpeech} from "@/features/language";
import AISpeechText from "./AISpeechText";

interface AITeacherCardProps {
  studentName: string;
  messageText: string;
}

export default function AITeacherCard({ studentName, messageText }: AITeacherCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPreparingSpeech, setIsPreparingSpeech] = useState(false);
  const { language: speechLanguage } = useAISpeechLanguage();

  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = `Hi ${studentName}, ${messageText}`
      .replace(/[*_#`~]/g, "")
      .replace(/https?:\/\/\S+/g, "");

    setIsPreparingSpeech(true);
    const spokenText = await translateForSpeech(cleanText, speechLanguage);
    setIsPreparingSpeech(false);

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = speechLanguage === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((voice) =>
      speechLanguage === "hi"
        ? voice.lang.toLowerCase().startsWith("hi") || voice.name.includes("हिन्दी")
        : voice.lang.toLowerCase().startsWith("en-in"),
    ) || voices.find((voice) => voice.lang.toLowerCase().startsWith(speechLanguage));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <section className="bg-primary/5 rounded-[24px] p-5 border border-primary/10 flex gap-4 shadow-sm animate-fade-in relative group">
      <div className="shrink-0 select-none">
        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden border-2 border-primary/20">
          <img
            alt="Maya AI Teacher"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuxQ4iRNfvtQSXIs5WXWBd8yp2KIcs5-jT-HVl_ISnOE0b5JnSBBRGwI5uua4LkbbLinoz7cAwr1rBjatBR-8-BbpOc2voy1seRREysG98qCudodPRLuAz5SjxPggukHe4yq4znbhQrgN0-CIZjil9TLBCqU2nYik_n73gsJKqTcaY2TcRb8mbIWXeNMb7uT0eOvDfY7zYxUy7vUvhA1FoMyuZ8bjwYLeDt8DH0UtK5XLVaGbIk7bW1meM8eQ0Fc2Bc8tLcLQRDxA"
          />
        </div>
      </div>
      <div className="space-y-1 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-primary uppercase font-bold tracking-wider">Maya AI Tutor</span>
          <div data-no-translate className="flex items-center gap-1.5">
            <button
              onClick={handleSpeak}
              disabled={isPreparingSpeech}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer disabled:cursor-wait disabled:opacity-60 ${isSpeaking
                  ? "bg-primary text-white animate-pulse"
                  : "bg-white text-primary border border-primary/20 hover:bg-primary/10"
                }`}
              title={isSpeaking ? "Stop Speaking" : "Listen to Maya"}
              aria-label={isSpeaking ? "Stop Maya speaking" : "Listen to Maya"}
            >
              <span className={`material-symbols-outlined text-[15px] ${isPreparingSpeech ? "animate-spin" : ""}`}>
                {isPreparingSpeech ? "progress_activity" : isSpeaking ? "volume_off" : "volume_up"}
              </span>
            </button>
          </div>
        </div>
        <p data-no-translate className="text-xs text-on-surface leading-relaxed font-semibold">
          <AISpeechText text={`Hi ${studentName} 👋 ${messageText}`} />
        </p>
      </div>
    </section>
  );
}
