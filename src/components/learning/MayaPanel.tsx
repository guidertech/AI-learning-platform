"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useLearning } from "@/context/LearningContext";
import AITeacherCard from "@/components/learning/AITeacherCard";
import AskMayaInput from "@/components/learning/AskMayaInput";

export default function MayaPanel() {
  const { studentName, chatMessages, addChatMessage } = useLearning();

  // Panel open/close state
  const [isOpen, setIsOpen] = useState(false);

  // Unread indicator — bump whenever a new AI message arrives while panel is closed
  const [unreadCount, setUnreadCount] = useState(0);
  const prevMsgCount = useRef(chatMessages.length);

  useEffect(() => {
    if (chatMessages.length > prevMsgCount.current) {
      const lastMsg = chatMessages[chatMessages.length - 1];
      if (!isOpen && lastMsg?.sender === "AI") {
        setUnreadCount((n) => n + 1);
      }
    }
    prevMsgCount.current = chatMessages.length;
  }, [chatMessages, isOpen]);

  // Clear unread when panel opens
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  // Scroll chat to bottom on every new message
  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isOpen]);

  // ── Drag-to-close on mobile ─────────────────────────────────────────────
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const currentDragDelta = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    currentDragDelta.current = 0;
    if (sheetRef.current) {
      sheetRef.current.style.transition = "none";
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (dragStartY.current === null) return;
    const delta = e.touches[0].clientY - dragStartY.current;
    if (delta < 0) return; // only drag downward
    currentDragDelta.current = delta;
    if (sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${delta}px)`;
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    if (sheetRef.current) {
      sheetRef.current.style.transition = "";
      sheetRef.current.style.transform = "";
    }
    if (currentDragDelta.current > 120) {
      setIsOpen(false);
    }
    dragStartY.current = null;
    currentDragDelta.current = 0;
  }, []);

  // ── Message send ────────────────────────────────────────────────────────
  const handleSend = (text: string) => {
    addChatMessage(text, "USER");
  };

  // ── Backdrop click closes panel ─────────────────────────────────────────
  const handleBackdropClick = () => setIsOpen(false);

  return (
    <>
      {/* ── Backdrop (mobile only, behind sheet) ───────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] md:hidden"
          onClick={handleBackdropClick}
        />
      )}

      {/* ── Desktop right-side slide-over panel ────────────────────────── */}
      <aside
        className={`
          hidden md:flex md:flex-col
          fixed top-0 right-0 h-full w-[35%] z-50
          bg-white border-l border-outline-variant/15
          shadow-[-20px_0_60px_rgba(83,65,205,0.08)]
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Desktop header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/10 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <div>
              <p className="font-bold text-sm text-on-surface">Ask Maya</p>
              <p className="text-[10px] text-on-surface-variant font-medium">AI Teaching Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">close</span>
          </button>
        </div>

        {/* Desktop chat messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <AITeacherCard
            studentName={studentName}
            messageText="Great work conceptualizing fractions! I'm here if you have any questions as you progress through the steps."
          />
          {chatMessages.slice(1).map((msg) => {
            const isAI = msg.sender === "AI";
            return (
              <div key={msg.id} className={`flex gap-3 items-start ${isAI ? "" : "flex-row-reverse"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  isAI ? "bg-primary-container text-white" : "bg-secondary text-white"
                }`}>
                  <span className="material-symbols-outlined text-[16px]">{isAI ? "psychology" : "person"}</span>
                </div>
                <div className={`p-4 rounded-2xl border text-xs max-w-[80%] leading-relaxed ${
                  isAI
                    ? "bg-slate-50 border-outline-variant/10 rounded-tl-none text-on-surface"
                    : "bg-primary text-white border-transparent rounded-tr-none"
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Desktop input */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <AskMayaInput onSendMessage={handleSend} onQuickQuestion={handleSend} />
        </div>
      </aside>

      {/* ── Mobile bottom sheet ─────────────────────────────────────────── */}
      <div
        ref={sheetRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`
          md:hidden
          fixed bottom-0 left-0 right-0 z-50
          bg-white rounded-t-3xl
          shadow-[0_-20px_60px_rgba(83,65,205,0.15)]
          flex flex-col
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-y-0" : "translate-y-full"}
          h-[80dvh]
        `}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0 cursor-grab">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Mobile header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-outline-variant/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
            </div>
            <div>
              <p className="font-bold text-sm text-on-surface">Ask Maya</p>
              <p className="text-[10px] text-on-surface-variant font-medium">AI Teaching Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">close</span>
          </button>
        </div>

        {/* Mobile chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AITeacherCard
            studentName={studentName}
            messageText="Great work conceptualizing fractions! I'm here if you have any questions as you progress through the steps."
          />
          {chatMessages.slice(1).map((msg) => {
            const isAI = msg.sender === "AI";
            return (
              <div key={msg.id} className={`flex gap-3 items-start ${isAI ? "" : "flex-row-reverse"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  isAI ? "bg-primary-container text-white" : "bg-secondary text-white"
                }`}>
                  <span className="material-symbols-outlined text-[14px]">{isAI ? "psychology" : "person"}</span>
                </div>
                <div className={`p-3 rounded-2xl border text-xs max-w-[82%] leading-relaxed ${
                  isAI
                    ? "bg-slate-50 border-outline-variant/10 rounded-tl-none text-on-surface"
                    : "bg-primary text-white border-transparent rounded-tr-none"
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Mobile input */}
        <div className="px-4 pt-3 pb-5 border-t border-slate-100 bg-slate-50/50 shrink-0">
          <AskMayaInput onSendMessage={handleSend} onQuickQuestion={handleSend} />
        </div>
      </div>

      {/* ── Floating "Ask Maya" FAB ─────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Ask Maya AI assistant"
        className={`
          fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50
          flex items-center gap-2.5
          bg-primary text-white
          shadow-[0_8px_30px_rgba(83,65,205,0.45)]
          rounded-full
          px-5 py-3.5
          font-bold text-sm
          transition-all duration-300 ease-out
          active:scale-95 hover:shadow-[0_12px_40px_rgba(83,65,205,0.55)]
          cursor-pointer select-none
          ${isOpen ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100"}
        `}
      >
        <span
          className="material-symbols-outlined text-[20px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          psychology
        </span>
        <span>Ask Maya</span>

        {/* Unread indicator badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    </>
  );
}
