"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLearning } from "@/context/LearningContext";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import { createClient } from "@/lib/supabase/client";
import { LanguageSelector } from "@/features/language";

const englishText = (text: string) => text;

const GRADE_OPTIONS = [
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8"
];

export default function SettingsPage() {
  const router = useRouter();
  const labels = {
    title: englishText("Settings & Preferences"),
    subtitle: englishText("Manage student personalization details and goals"),
    studentSummary: englishText("Grade __GRADE__ · Age __AGE__"),
    logout: englishText("Logout Account"), studentProfile: englishText("Student Profile"),
    editProfile: englishText("Edit Student Profile Details"), fullName: englishText("Full Name"),
    gradeClass: englishText("Grade / Class"), grade: englishText("Grade __GRADE__"),
    school: englishText("School"), schoolName: englishText("School Name"), age: englishText("Age"),
    yearsOld: englishText("__AGE__ years old"), profileUpdated: englishText("Profile updated successfully!"),
    enterFullName: englishText("Enter student full name"), enterSchoolName: englishText("Enter school name"), enterAge: englishText("Enter age"),
    saving: englishText("Saving..."), saveChanges: englishText("Save Changes"), cancel: englishText("Cancel"),
    personalization: englishText("Personalization Settings"), tutorPersona: englishText("AI Tutor Persona"),
    personaSocratic: englishText("Maya (Socratic hints — recommended)"), personaDirect: englishText("Maya (Direct explanations and answers)"), personaFriendly: englishText("Maya (Playful and encouraging buddy)"),
    supportPrivacy: englishText("Support & Privacy"), helpFaq: englishText("Help Center & FAQ"), privacyPolicy: englishText("Privacy Policy Agreement"),
    faqDashboardQuestion: englishText("What can I see on my Dashboard?"), faqDashboardAnswer: englishText("Your dashboard shows your progress, active subjects, Maya's recommendations, and quick study tools."),
    faqSubjectsQuestion: englishText("How does the Subjects section work?"), faqSubjectsAnswer: englishText("Choose a subject to view its chapters, take diagnostics, and track completed topics."),
    faqWorkspaceQuestion: englishText("What is the AI Workspace?"), faqWorkspaceAnswer: englishText("The AI Workspace connects you with Maya to learn concepts through explanations, hints, voice, and practice."),
  };
  const { studentName, studentGrade, studentSchool, studentAge, studentTutorPersona, studentLevel, resetChat, updateProfile } = useLearning();
  const supabase = createClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(studentName);
  const [editGrade, setEditGrade] = useState(studentGrade);
  const [editSchool, setEditSchool] = useState(studentSchool);
  const [editAge, setEditAge] = useState(studentAge);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [activeFaqQuestion, setActiveFaqQuestion] = useState<number | null>(null);

  const handleLogout = async () => {
    resetChat();
    localStorage.clear();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleEditClick = () => {
    setEditName(studentName);
    setEditGrade(studentGrade);
    setEditSchool(studentSchool);
    setEditAge(studentAge);
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
    await updateProfile(editName.trim(), editGrade, editSchool.trim(), Number(editAge), studentTutorPersona);
    setIsSaving(false);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <PageContainer>
      <Topbar
        title={labels.title}
        subtitle={labels.subtitle}
        showBack={true}
      />

      <main className="p-4 md:p-8 max-w-[1200px] mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Avatar & Logout */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-gradient-to-br from-indigo-50/70 via-purple-50/70 to-pink-50/50 p-6 rounded-[28px] border border-indigo-100/80 shadow-[0_8px_20px_rgba(99,102,241,0.05)] text-center flex flex-col items-center relative overflow-hidden group">

              <div className="relative w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-[0_8px_24px_rgba(83,65,205,0.08)] mb-2 mt-4 transition-transform duration-500 group-hover:scale-105">
                <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center border border-white/20 shadow-inner">
                  <span className="material-symbols-outlined text-[48px] text-indigo-600 font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                    face
                  </span>
                </div>
              </div>
              {/* Level Badge above name */}
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-[10px] uppercase tracking-wider shadow-sm select-none border border-indigo-400/20 mt-3">
                <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                <span>Level {studentLevel}</span>
              </div>

              <h3 className="font-bold text-lg text-slate-800 mt-2">
                {studentName}
              </h3>
              <p className="text-xs text-indigo-950/75 font-semibold mt-0.5">{labels.studentSummary.replace("__GRADE__", studentGrade.match(/\d+/)?.[0] ?? studentGrade).replace("__AGE__", String(studentAge || 0))}</p>

              {studentSchool && (
                <p className="text-[10px] text-indigo-950/85 font-bold mt-2.5 px-3 py-1 bg-white/95 rounded-full border border-indigo-100/60 max-w-full truncate shadow-3xs">
                  {studentSchool}
                </p>
              )}

              <button
                onClick={handleLogout}
                className="w-full mt-8 bg-white hover:bg-red-50 text-red-600 border border-red-100 hover:border-red-200 font-bold text-xs py-3 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 active:scale-98 shadow-3xs"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span> {labels.logout}
              </button>
            </section>

            {/* Quick Navigation Shortcuts */}
            <section className="bg-white border border-outline-variant/15 p-5 rounded-[28px] shadow-3xs space-y-3">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider pl-1">Student Dashboard</h4>

              <button
                onClick={() => router.push("/progress")}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/40 border border-blue-100 hover:border-blue-200 text-left transition-all active:scale-[0.99] cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-[18px]">trending_up</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Progress Tracker</span>
                    <span className="text-[9px] text-slate-500 font-medium block">Track topic progress & history</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-indigo-600 transition-transform duration-300 group-hover:translate-x-0.5">chevron_right</span>
              </button>

              <button
                onClick={() => router.push("/reports")}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-rose-50/80 to-red-50/40 border border-rose-100 hover:border-rose-200 text-left transition-all active:scale-[0.99] cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-[18px]">analytics</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Test Reports</span>
                    <span className="text-[9px] text-slate-500 font-medium block">Check quiz & exam scores</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-rose-600 transition-transform duration-300 group-hover:translate-x-0.5">chevron_right</span>
              </button>
            </section>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 space-y-6">

            {/* Profile Card - View or Edit */}
            <section className="bg-gradient-to-br from-blue-50/80 via-sky-50/50 to-indigo-50/40 p-6 rounded-2xl border border-blue-100/80 shadow-[0_8px_20px_rgba(59,130,246,0.05)] space-y-4">
              <h4 className="font-bold text-xs text-blue-900/90 uppercase tracking-wider pl-1">{labels.studentProfile}</h4>

              {!isEditing ? (
                /* View Mode — single trigger row, no duplication */
                <>
                  <div
                    onClick={handleEditClick}
                    className="p-5 bg-white/70 border border-blue-100 rounded-2xl cursor-pointer hover:bg-white hover:border-blue-200 transition-all duration-300 group space-y-4 shadow-3xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 shrink-0">
                          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>manage_accounts</span>
                        </div>
                        <p className="text-xs font-bold text-blue-950/90">{labels.editProfile}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-50 transition-all duration-300 shadow-3xs">
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-1 text-[10px] text-slate-600 font-semibold">
                      <div className="space-y-1 bg-white/80 border border-blue-100/60 rounded-xl p-3 shadow-3xs">
                        <span className="text-[9px] uppercase tracking-wider text-blue-900/65 block">{labels.fullName}</span>
                        <span className="text-blue-950 font-bold text-xs">{studentName}</span>
                      </div>
                      <div className="space-y-1 bg-white/80 border border-blue-100/60 rounded-xl p-3 shadow-3xs">
                        <span className="text-[9px] uppercase tracking-wider text-blue-900/65 block">{labels.gradeClass}</span>
                        <span className="text-blue-950 font-bold text-xs">{labels.grade.replace("__GRADE__", studentGrade.match(/\d+/)?.[0] ?? studentGrade)}</span>
                      </div>
                      <div className="space-y-1 bg-white/80 border border-blue-100/60 rounded-xl p-3 shadow-3xs col-span-2 sm:col-span-1">
                        <span className="text-[9px] uppercase tracking-wider text-blue-900/65 block">{labels.school}</span>
                        <span className="text-blue-950 font-bold text-xs truncate block">{studentSchool}</span>
                      </div>
                      <div className="space-y-1 bg-white/80 border border-blue-100/60 rounded-xl p-3 shadow-3xs col-span-2 sm:col-span-1">
                        <span className="text-[9px] uppercase tracking-wider text-blue-900/65 block">{labels.age}</span>
                        <span className="text-blue-950 font-bold text-xs">{labels.yearsOld.replace("__AGE__", String(studentAge || 0))}</span>
                      </div>
                    </div>
                  </div>
                  {saveSuccess && (
                    <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold px-1">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      {labels.profileUpdated}
                    </div>
                  )}
                </>
              ) : (
                /* Inline Edit Mode */
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="edit-name" className="text-xs font-bold text-blue-950/90 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-blue-600">badge</span>
                      {labels.fullName}
                    </label>
                    <input
                      id="edit-name"
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder={labels.enterFullName}
                      className="w-full h-11 px-4 bg-white border border-blue-100 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-slate-800 placeholder-slate-400 transition-all"
                      autoFocus
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="edit-grade" className="text-xs font-bold text-blue-950/90 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-blue-600">school</span>
                      {labels.gradeClass}
                    </label>
                    <select
                      id="edit-grade"
                      value={editGrade}
                      onChange={(e) => setEditGrade(e.target.value)}
                      className="w-full h-11 px-4 bg-white border border-blue-100 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-slate-800 transition-all cursor-pointer"
                    >
                      {GRADE_OPTIONS.map((grade) => (
                        <option key={grade} value={grade} className="bg-white text-on-surface">{labels.grade.replace("__GRADE__", grade.replace("Grade ", ""))}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="edit-school" className="text-xs font-bold text-blue-950/90 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-blue-600">corporate_fare</span>
                      {labels.schoolName}
                    </label>
                    <input
                      id="edit-school"
                      type="text"
                      value={editSchool}
                      onChange={(e) => setEditSchool(e.target.value)}
                      placeholder={labels.enterSchoolName}
                      className="w-full h-11 px-4 bg-white border border-blue-100 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-slate-800 placeholder-slate-400 transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="edit-age" className="text-xs font-bold text-blue-950/90 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-blue-600">cake</span>
                      {labels.age}
                    </label>
                    <input
                      id="edit-age"
                      type="number"
                      value={editAge}
                      onChange={(e) => setEditAge(Number(e.target.value))}
                      placeholder={labels.enterAge}
                      className="w-full h-11 px-4 bg-white border border-blue-100 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-slate-800 placeholder-slate-400 transition-all"
                      required
                    />
                  </div>


                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60 cursor-pointer shadow-sm"
                    >
                      {isSaving ? (
                        <>
                          <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                          {labels.saving}
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[16px]">save</span>
                          {labels.saveChanges}
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2.5 text-xs font-bold text-blue-950/70 border border-blue-200 hover:bg-blue-50/50 rounded-xl transition-all cursor-pointer"
                    >
                      {labels.cancel}
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* Personalization Settings */}
            <section className="bg-gradient-to-br from-violet-50/80 via-purple-50/50 to-indigo-50/40 p-6 rounded-2xl border border-violet-100/80 shadow-[0_8px_20px_rgba(139,92,246,0.05)] space-y-4">
              <h4 className="font-bold text-xs text-violet-900/90 uppercase tracking-wider pl-1">{labels.personalization}</h4>

              <LanguageSelector variant="settings" />

              <div className="space-y-3 pt-2">
                <label htmlFor="select-persona" className="text-xs font-bold text-violet-950 flex items-center gap-3 pl-1">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-600 shrink-0">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                  </div>
                  <span>{labels.tutorPersona}</span>
                </label>
                <div className="relative">
                  <select
                    id="select-persona"
                    value={studentTutorPersona}
                    onChange={async (e) => {
                      const newPersona = e.target.value;
                      await updateProfile(studentName, studentGrade, studentSchool, studentAge, newPersona);
                    }}
                    className="w-full h-11 px-4 pr-10 bg-white border border-violet-100 rounded-xl text-xs font-semibold focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 text-slate-800 transition-all cursor-pointer appearance-none"
                  >
                    <option value="Socratic" className="bg-white text-on-surface">{labels.personaSocratic}</option>
                    <option value="Direct" className="bg-white text-on-surface">{labels.personaDirect}</option>
                    <option value="Friendly" className="bg-white text-on-surface">{labels.personaFriendly}</option>
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[17px] text-violet-700/80">
                    expand_more
                  </span>
                </div>
              </div>
            </section>

            {/* Help & Privacy */}
            <section className="bg-gradient-to-br from-emerald-50/80 via-teal-50/50 to-cyan-50/40 p-6 rounded-2xl border border-emerald-100/80 shadow-[0_8px_20px_rgba(16,185,129,0.05)] space-y-4">
              <h4 className="font-bold text-xs text-emerald-900/90 uppercase tracking-wider pl-1">{labels.supportPrivacy}</h4>

              <div className="space-y-3">
                <div className="space-y-2">
                  <div
                    onClick={() => setFaqOpen(!faqOpen)}
                    className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer hover:bg-white transition-all duration-300 select-none shadow-3xs group ${faqOpen ? "bg-white border-emerald-200 text-emerald-950" : "bg-white/70 border-emerald-100 text-slate-800"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-all duration-300 ${faqOpen ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-600 shadow-3xs" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"}`}>
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>help</span>
                      </div>
                      <span className={`text-xs font-bold ${faqOpen ? "text-emerald-800" : "text-slate-800"}`}>
                        {labels.helpFaq}
                      </span>
                    </div>
                    <span className={`material-symbols-outlined text-slate-500 group-hover:text-emerald-600 text-[18px] transition-transform duration-300 ${faqOpen ? "rotate-180 text-emerald-600" : ""}`}>
                      expand_more
                    </span>
                  </div>

                  {faqOpen && (
                    <div className="bg-white/60 border border-emerald-100 rounded-xl p-3 space-y-2.5 animate-fade-in select-none">
                      {[
                        {
                          q: labels.faqDashboardQuestion, a: labels.faqDashboardAnswer
                        },
                        {
                          q: labels.faqSubjectsQuestion, a: labels.faqSubjectsAnswer
                        },
                        {
                          q: labels.faqWorkspaceQuestion, a: labels.faqWorkspaceAnswer
                        }
                      ].map((item, idx) => {
                        const isQuestionOpen = activeFaqQuestion === idx;
                        return (
                          <div
                            key={idx}
                            className="bg-white border border-emerald-50 rounded-xl overflow-hidden transition-all duration-200"
                          >
                            {/* Question Header */}
                            <div
                              onClick={() => setActiveFaqQuestion(isQuestionOpen ? null : idx)}
                              className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-slate-50 transition-colors gap-3"
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isQuestionOpen ? "bg-emerald-500" : "bg-slate-400"}`} />
                                <span className={`text-xs font-bold transition-colors duration-150 ${isQuestionOpen ? "text-emerald-700" : "text-slate-800"}`}>
                                  {item.q}
                                </span>
                              </div>
                              <span className={`material-symbols-outlined text-[18px] font-bold shrink-0 transition-transform duration-200 ${isQuestionOpen ? "text-emerald-600 rotate-180" : "text-slate-400"}`}>
                                {isQuestionOpen ? "remove" : "add"}
                              </span>
                            </div>

                            {/* Question Answer Panel */}
                            {isQuestionOpen && (
                              <div className="px-4 pb-3.5 pt-0.5 border-t border-emerald-50/50 animate-fade-in">
                                <p className="text-[10px] text-slate-600 leading-relaxed font-semibold pl-3">
                                  {item.a}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div
                  onClick={() => router.push("/privacy")}
                  className="flex items-center justify-between p-3.5 bg-white/70 border border-emerald-100 rounded-xl cursor-pointer hover:bg-white hover:border-emerald-200 text-slate-800 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-500">privacy_tip</span>
                    <span className="text-xs font-bold text-slate-800">{labels.privacyPolicy}</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-500 text-[18px]">chevron_right</span>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </PageContainer>
  );
}
