"use client";

import React, { useState } from "react";
import { useLearning } from "@/context/LearningContext";
import { topicContents } from "@/features/learning/data/topicContent";

interface AskMayaInputProps {
  onSendMessage: (text: string) => void;
  onQuickQuestion: (text: string) => void;
}

export default function AskMayaInput({ onSendMessage, onQuickQuestion }: AskMayaInputProps) {
  const [text, setText] = useState("");
  const { activeTopic } = useLearning();

  const activeContent = Object.values(topicContents).find(
    (content) => content.title === activeTopic
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
  };

  const quickReplies = activeContent?.quickReplies || [
    "Explain 3 3/4 equivalent fraction",
    "Recap converting mixed numbers",
    "Why is it called denominator?"
  ];

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <input 
          className="flex-grow h-11 px-4 bg-slate-50 border border-outline-variant/15 rounded-xl text-xs focus:outline-none focus:border-primary/50" 
          placeholder="Ask Maya a question..."
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button 
          type="submit"
          className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center active:scale-95 transition-transform cursor-pointer shadow-md"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </form>
    </div>
  );
}
