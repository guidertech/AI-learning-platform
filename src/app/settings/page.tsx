"use client";

import React, { useState } from "react";
import {useRouter} from "next/navigation";
import { useLearning } from "@/context/LearningContext";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import { createClient } from "@/lib/supabase/client";
import LanguageSelector from "@/components/translation/LanguageSelector";

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
  const { studentName, studentGrade, studentSchool, studentAge, studentTutorPersona, resetChat, updateProfile } = useLearning();
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
            <section className="bg-white p-6 rounded-[28px] border border-outline-variant/15 shadow-sm text-center flex flex-col items-center">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary overflow-hidden shadow-md">
                <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[48px] text-primary/60">person</span>
                </div>
              </div>
              <h3 className="font-bold text-base text-on-surface mt-4">{studentName}</h3>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">{labels.studentSummary.replace("__GRADE__", studentGrade.match(/\d+/)?.[0] ?? studentGrade).replace("__AGE__", String(studentAge || 0))}</p>
              <p className="text-[10px] text-outline font-semibold mt-1 max-w-full truncate">{studentSchool}</p>

              <button 
                onClick={handleLogout}
                className="w-full mt-8 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer border border-red-100 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span> {labels.logout}
              </button>
            </section>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 space-y-6">

            {/* Profile Card - View or Edit */}
            <section className="bg-white p-6 rounded-2xl border border-outline-variant/15 shadow-sm space-y-4">
              <h4 className="font-bold text-xs text-outline uppercase tracking-wider pl-1">{labels.studentProfile}</h4>

              {!isEditing ? (
                /* View Mode — single trigger row, no duplication */
                <>
                  <div
                    onClick={handleEditClick}
                    className="p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-all group space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-[18px]">manage_accounts</span>
                        <p className="text-xs font-bold text-on-surface">{labels.editProfile}</p>
                      </div>
                      <span className="material-symbols-outlined text-outline text-[18px] group-hover:text-primary transition-colors">edit</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-1 text-[10px] text-on-surface-variant font-semibold">
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-outline block">{labels.fullName}</span>
                        <span className="text-on-surface font-bold text-xs">{studentName}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-outline block">{labels.gradeClass}</span>
                        <span className="text-on-surface font-bold text-xs">{labels.grade.replace("__GRADE__", studentGrade.match(/\d+/)?.[0] ?? studentGrade)}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-outline block">{labels.school}</span>
                        <span className="text-on-surface font-bold text-xs truncate block">{studentSchool}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-outline block">{labels.age}</span>
                        <span className="text-on-surface font-bold text-xs">{labels.yearsOld.replace("__AGE__", String(studentAge || 0))}</span>
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
                    <label htmlFor="edit-name" className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-primary">badge</span>
                      {labels.fullName}
                    </label>
                    <input
                      id="edit-name"
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder={labels.enterFullName}
                      className="w-full h-11 px-4 bg-slate-50 border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-colors"
                      autoFocus
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="edit-grade" className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-primary">school</span>
                      {labels.gradeClass}
                    </label>
                    <select
                      id="edit-grade"
                      value={editGrade}
                      onChange={(e) => setEditGrade(e.target.value)}
                      className="w-full h-11 px-4 bg-slate-50 border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                    >
                      {GRADE_OPTIONS.map((grade) => (
                        <option key={grade} value={grade}>{labels.grade.replace("__GRADE__", grade.replace("Grade ", ""))}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="edit-school" className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-primary">corporate_fare</span>
                      {labels.schoolName}
                    </label>
                    <input
                      id="edit-school"
                      type="text"
                      value={editSchool}
                      onChange={(e) => setEditSchool(e.target.value)}
                      placeholder={labels.enterSchoolName}
                      className="w-full h-11 px-4 bg-slate-50 border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="edit-age" className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-primary">cake</span>
                      {labels.age}
                    </label>
                    <input
                      id="edit-age"
                      type="number"
                      value={editAge}
                      onChange={(e) => setEditAge(Number(e.target.value))}
                      placeholder={labels.enterAge}
                      className="w-full h-11 px-4 bg-slate-50 border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-colors"
                      required
                    />
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
                      className="px-4 py-2.5 text-xs font-bold text-on-surface-variant hover:text-on-surface border border-outline-variant/20 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      {labels.cancel}
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* Personalization Settings */}
            <section className="bg-white p-6 rounded-2xl border border-outline-variant/15 shadow-sm space-y-4">
              <h4 className="font-bold text-xs text-outline uppercase tracking-wider pl-1">{labels.personalization}</h4>

              <LanguageSelector variant="settings" />
              
              <div className="space-y-1.5">
                <label htmlFor="select-persona" className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5 pl-1">
                  <span className="material-symbols-outlined text-[14px] text-primary">psychology</span>
                  {labels.tutorPersona}
                </label>
                <select
                  id="select-persona"
                  value={studentTutorPersona}
                  onChange={async (e) => {
                    const newPersona = e.target.value;
                    await updateProfile(studentName, studentGrade, studentSchool, studentAge, newPersona);
                  }}
                  className="w-full h-11 px-4 bg-slate-50 border border-outline-variant/20 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                >
                  <option value="Socratic">{labels.personaSocratic}</option>
                  <option value="Direct">{labels.personaDirect}</option>
                  <option value="Friendly">{labels.personaFriendly}</option>
                </select>
              </div>
            </section>

            {/* Help & Privacy */}
            <section className="bg-white p-6 rounded-2xl border border-outline-variant/15 shadow-sm space-y-4">
              <h4 className="font-bold text-xs text-outline uppercase tracking-wider pl-1">{labels.supportPrivacy}</h4>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <div 
                    onClick={() => setFaqOpen(!faqOpen)}
                    className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100 transition-all select-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined transition-colors ${faqOpen ? "text-primary" : "text-outline"}`}>
                        help
                      </span>
                      <span className={`text-xs font-bold transition-colors ${faqOpen ? "text-primary" : "text-on-surface"}`}>
                        {labels.helpFaq}
                      </span>
                    </div>
                    <span className={`material-symbols-outlined text-outline text-[18px] transition-transform duration-200 ${faqOpen ? "rotate-180 text-primary" : ""}`}>
                      expand_more
                    </span>
                  </div>

                  {faqOpen && (
                    <div className="bg-slate-100/50 border border-outline-variant/10 rounded-xl p-3 space-y-2.5 animate-fade-in select-none">
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
                            className="bg-white border border-outline-variant/10 rounded-xl overflow-hidden transition-all duration-200"
                          >
                            {/* Question Header */}
                            <div 
                              onClick={() => setActiveFaqQuestion(isQuestionOpen ? null : idx)}
                              className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-slate-50 transition-colors gap-3"
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isQuestionOpen ? "bg-primary" : "bg-outline"}`} />
                                <span className={`text-xs font-bold transition-colors duration-150 ${isQuestionOpen ? "text-primary" : "text-on-surface"}`}>
                                  {item.q}
                                </span>
                              </div>
                              <span className={`material-symbols-outlined text-[18px] font-bold shrink-0 transition-transform duration-200 ${isQuestionOpen ? "text-primary rotate-180" : "text-outline"}`}>
                                {isQuestionOpen ? "remove" : "add"}
                              </span>
                            </div>
                            
                            {/* Question Answer Panel */}
                            {isQuestionOpen && (
                              <div className="px-4 pb-3.5 pt-0.5 border-t border-outline-variant/5 animate-fade-in">
                                <p className="text-[10px] text-on-surface-variant leading-relaxed font-semibold pl-3">
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
                  className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-outline">privacy_tip</span>
                    <span className="text-xs font-bold text-on-surface">{labels.privacyPolicy}</span>
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
