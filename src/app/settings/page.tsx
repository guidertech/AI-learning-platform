"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useLearning } from "@/context/LearningContext";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const router = useRouter();
  const { studentName, resetChat } = useLearning();
  const supabase = createClient();

  const handleLogout = async () => {
    resetChat();
    localStorage.clear();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <PageContainer>
      <Topbar 
        title="Settings & Preferences" 
        subtitle="Manage student personalization details and goals" 
        showBack={true}
      />

      <main className="p-4 md:p-8 max-w-[1200px] mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Avatar & Logout - 4 cols */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white p-6 rounded-[28px] border border-outline-variant/15 shadow-sm text-center flex flex-col items-center">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary overflow-hidden shadow-md">
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  <img 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD362PRVKyjRjgsac1uej1jj88bJh0ZtnK1WSXgeqTiKy8rMpXgar0RhVlNaxn8oBOJmsqOWo1UATpverWQRn1bsPAB2AsiVQD_6UgUTx5L9LST4pqg2W9vZFhHFtTz-BH6rNE5ZDce00OghIlIlpNbL_3ILsylqLEY7EIs1wHyiCJ_BVUuRJNLFHPO0AY-0Tm74h7do1xZH4vDO8G6JJhXjbjx_x2lyQZ7jdEn4BFrTcJ_EqXqEHpnVq3pERzB_5UJbx1gAUwom1w"
                    alt="Avatar"
                  />
                </div>
              </div>
              <h3 className="font-bold text-base text-on-surface mt-4">{studentName} Sharma</h3>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">Grade 5 Student • Mathematics Focus</p>
              
              <button 
                onClick={handleLogout}
                className="w-full mt-8 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer border border-red-100 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span> Logout Account
              </button>
            </section>
          </div>

          {/* Right Column: Options & preferences - 8 cols */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Preferences Group */}
            <section className="bg-white p-6 rounded-2xl border border-outline-variant/15 shadow-sm space-y-4">
              <h4 className="font-bold text-xs text-outline uppercase tracking-wider pl-1">Personalization Settings</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined">auto_fix_high</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-on-surface block">AI Tutor Persona</span>
                    <span className="text-[10px] text-on-surface-variant font-semibold">Maya (Socratic)</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-on-surface block">Time Goal Target</span>
                    <span className="text-[10px] text-on-surface-variant font-semibold">60 Minutes / Daily</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Help & privacy details */}
            <section className="bg-white p-6 rounded-2xl border border-outline-variant/15 shadow-sm space-y-4">
              <h4 className="font-bold text-xs text-outline uppercase tracking-wider pl-1">Support & Privacy</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-outline">help</span>
                    <span className="text-xs font-bold text-on-surface">Help Center & FAQ</span>
                  </div>
                  <span className="material-symbols-outlined text-outline text-[18px]">open_in_new</span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-outline">privacy_tip</span>
                    <span className="text-xs font-bold text-on-surface">Privacy Policy Agreement</span>
                  </div>
                  <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>
                </div>
              </div>
            </section>

          </div>

        </div>
      </main>
    </PageContainer>
  );
}
