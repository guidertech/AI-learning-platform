"use client";

import React from "react";

interface AITeacherCardProps {
  studentName: string;
  messageText: string;
}

export default function AITeacherCard({ studentName, messageText }: AITeacherCardProps) {
  return (
    <section className="bg-primary/5 rounded-[24px] p-5 border border-primary/10 flex gap-4 shadow-sm animate-fade-in">
      <div className="shrink-0 select-none">
        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden border-2 border-primary/20">
          <img 
            alt="Maya AI Teacher" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuxQ4iRNfvtQSXIs5WXWBd8yp2KIcs5-jT-HVl_ISnOE0b5JnSBBRGwI5uua4LkbbLinoz7cAwr1rBjatBR-8-BbpOc2voy1seRREysG98qCudodPRLuAz5SjxPggukHe4yq4znbhQrgN0-CIZjil9TLBCqU2nYik_n73gsJKqTcaY2TcRb8mbIWXeNMb7uT0eOvDfY7zYxUy7vUvhA1FoMyuZ8bjwYLeDt8DH0UtK5XLVaGbIk7bW1meM8eQ0Fc2Bc8tLcLQRDxA"
          />
        </div>
      </div>
      <div className="space-y-1">
        <span className="text-[9px] text-primary uppercase font-bold tracking-wider">Maya AI Tutor</span>
        <p className="text-xs text-on-surface leading-relaxed font-semibold">
          Hi {studentName} 👋 {messageText}
        </p>
      </div>
    </section>
  );
}
