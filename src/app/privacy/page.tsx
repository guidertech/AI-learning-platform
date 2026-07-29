"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <PageContainer>
      <Topbar 
        title="Privacy Policy Agreement" 
        subtitle="Learn how we protect student data and secure our Socratic learning environment" 
        showBack={true}
      />

      <main className="p-4 md:p-8 max-w-[800px] mx-auto w-full space-y-6 select-none">
        
        {/* Intro banner */}
        <section className="bg-gradient-to-br from-primary-container to-secondary p-6 rounded-3xl text-white relative overflow-hidden shadow-sm">
          <div className="relative z-10 space-y-1">
            <span className="text-[10px] font-bold opacity-90 uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              Trust & Transparency
            </span>
            <h2 className="font-bold text-lg pt-1">Our Student-First Privacy Commitment</h2>
            <p className="text-xs opacity-90 leading-relaxed max-w-[600px]">
              ClassOrbit is built to empower children with safe, voice-guided educational tools. We maintain strict compliance with child privacy safety standards.
            </p>
          </div>
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        </section>

        {/* Policy Sections */}
        <div className="bg-white rounded-3xl border border-outline-variant/15 shadow-sm p-6 space-y-6">
          
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
              1. Child Privacy & COPPA Compliance
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed font-semibold pl-6">
              ClassOrbit is fully compliant with the Children's Online Privacy Protection Act (COPPA). We design our interface to limit data collection strictly to what is necessary for learning personalization. We never request full personal details or share identifiers with third parties.
            </p>
          </div>

          <div className="h-[1px] bg-outline-variant/10" />

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">dataset</span>
              2. Data We Collect & How We Use It
            </h3>
            <div className="pl-6 space-y-2 text-xs text-on-surface-variant font-semibold leading-relaxed">
              <p>To personalize the Socratic feedback loop and track study goals, we store:</p>
              <ul className="list-disc list-inside pl-2 space-y-1">
                <li><strong className="text-on-surface">Profile Credentials:</strong> Student first name, school name, age, and grade level.</li>
                <li><strong className="text-on-surface">Academic Activity:</strong> Completed topics, quiz scores, diagnostic entry records, and weak areas.</li>
                <li><strong className="text-on-surface">Tutor Interaction:</strong> Anonymous speech transcription and chat logs with Maya to train recovery suggestions.</li>
              </ul>
            </div>
          </div>

          <div className="h-[1px] bg-outline-variant/10" />

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">security</span>
              3. Data Security & Storage
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed font-semibold pl-6">
              All learning metrics and profile settings are stored inside secure encrypted database tables with Row Level Security (RLS) policies. No personal information is ever rented, sold, or shared with external advertising networks.
            </p>
          </div>

          <div className="h-[1px] bg-outline-variant/10" />

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">settings_accessibility</span>
              4. Parental Rights & Controls
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed font-semibold pl-6">
              Parents have complete authority over their child's dashboard. You can modify name/grade preferences, clear Socratic chat history, reset weaknesses logs, or request complete account deletion at any time from your settings panel.
            </p>
          </div>

        </div>

        {/* Action Controls */}
        <div className="flex justify-center pt-2">
          <button 
            onClick={() => router.push("/settings")}
            className="px-8 py-3 bg-white border border-outline-variant/30 text-on-surface hover:bg-slate-50 font-bold rounded-2xl flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all text-xs"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Return to Settings</span>
          </button>
        </div>

      </main>
    </PageContainer>
  );
}
