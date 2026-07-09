"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLearning } from "@/context/LearningContext";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import { createClient } from "@/lib/supabase/client";

const GRADE_OPTIONS = [
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
  "Grade 11", "Grade 12"
];

export default function SettingsPage() {
  const router = useRouter();
  const { studentName, studentGrade, dailyGoal, resetChat, updateProfile } = useLearning();
  const supabase = createClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(studentName);
  const [editGrade, setEditGrade] = useState(studentGrade);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleLogout = async () => {
    resetChat();
    localStorage.clear();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleEditClick = () => {
    setEditName(studentName);
    setEditGrade(studentGrade);
    setIsEditing(true);
    setSaveSuccess(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    setIsSaving(true);
    await updateProfile(editName.trim(), editGrade);
    setIsSaving(false);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
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
          
          {/* Left Column: Avatar & Logout */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white p-6 rounded-[28px] border border-outline-variant/15 shadow-sm text-center flex flex-col items-center">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary overflow-hidden shadow-md">
                <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[48px] text-primary/60">person</span>
                </div>
              </div>
              <h3 className="font-bold text-base text-on-surface mt-4">{studentName}</h3>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">{studentGrade} • Mathematics Focus</p>

              <button 
                onClick={handleLogout}
                className="w-full mt-8 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer border border-red-100 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span> Logout Account
              </button>
            </section>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 space-y-6">

            {/* Profile Card - View or Edit */}
            <section className="bg-white p-6 rounded-2xl border border-outline-variant/15 shadow-sm space-y-4">
              <h4 className="font-bold text-xs text-outline uppercase tracking-wider pl-1">Student Profile</h4>

              {!isEditing ? (
                /* View Mode — single trigger row, no duplication */
                <>
                  <div
                    onClick={handleEditClick}
                    className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[18px]">manage_accounts</span>
                      <div>
                        <p className="text-xs font-bold text-on-surface">Edit Name & Class</p>
                        <p className="text-[10px] text-on-surface-variant font-medium">{studentName} · {studentGrade}</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline text-[18px] group-hover:text-primary transition-colors">chevron_right</span>
                  </div>
                  {saveSuccess && (
                    <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold px-1">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Profile updated successfully!
                    </div>
                  )}
                </>
              ) : (
                /* Inline Edit Mode */
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="edit-name" className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-primary">badge</span>
                      Full Name
                    </label>
                    <input
                      id="edit-name"
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Enter student full name"
                      className="w-full h-11 px-4 bg-slate-50 border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-colors"
                      autoFocus
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="edit-grade" className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-primary">school</span>
                      Class / Grade
                    </label>
                    <select
                      id="edit-grade"
                      value={editGrade}
                      onChange={(e) => setEditGrade(e.target.value)}
                      className="w-full h-11 px-4 bg-slate-50 border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                    >
                      {GRADE_OPTIONS.map((grade) => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 cursor-pointer shadow-sm"
                    >
                      {isSaving ? (
                        <>
                          <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[16px]">save</span>
                          Save Changes
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2.5 text-xs font-bold text-on-surface-variant hover:text-on-surface border border-outline-variant/20 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* Personalization Settings (read-only) */}
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
                    <span className="text-xs font-bold text-on-surface block">Daily Goal Target</span>
                    <span className="text-[10px] text-on-surface-variant font-semibold">{dailyGoal} Minutes / Day (AI Suggested)</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Help & Privacy */}
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
