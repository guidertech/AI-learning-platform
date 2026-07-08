"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import EmptyState from "@/components/layout/EmptyState";

export default function HomeworkPage() {
  const router = useRouter();
  
  const [q1, setQ1] = useState<string | null>(null);
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState<string | null>(null);
  const [q4, setQ4] = useState<string | null>(null);
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleReturn = () => {
    router.push("/dashboard");
  };

  return (
    <PageContainer>
      <Topbar 
        title="AI Homework Assignment" 
        subtitle="Complete your weekly challenge problems" 
        showBack={true}
      />

      <main className="p-4 md:p-8 max-w-[1200px] mx-auto w-full">
        {submitted ? (
          <div className="space-y-6">
            <EmptyState 
              title="Homework Submitted!" 
              description="You have successfully submitted your weekly challenge. Maya is generating your feedback report."
              icon="verified"
            />
            <div className="text-center">
              <button 
                onClick={handleReturn}
                className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl active:scale-[0.98] transition-all cursor-pointer shadow-md hover:bg-primary-container"
              >
                Return Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header banner */}
            <section className="bg-gradient-to-br from-primary-container to-secondary p-6 rounded-3xl text-white relative overflow-hidden shadow-sm select-none">
              <div className="relative z-10">
                <p className="text-[10px] font-bold opacity-90 mb-0.5 uppercase tracking-wider">Weekly Assignment</p>
                <h2 className="font-bold text-lg mb-4">Mastering Fractions & Parts</h2>
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] opacity-85 font-semibold">Origin</span>
                    <span className="text-xs font-semibold">AI Generated</span>
                  </div>
                  <div className="h-6 w-[1px] bg-white/20"></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] opacity-85 font-semibold">Difficulty</span>
                    <span className="text-xs font-semibold">Intermediate</span>
                  </div>
                </div>
              </div>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-outline-variant/15 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">1</span>
                    <p className="font-bold text-sm text-on-surface">Which fraction is equivalent to $3/4$?</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2.5 select-none">
                    <button 
                      type="button"
                      onClick={() => setQ1("6/8")}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex justify-between items-center cursor-pointer ${
                        q1 === "6/8" ? "border-primary bg-primary-fixed/20 text-primary" : "border-outline-variant/35 bg-slate-50 hover:border-primary/30"
                      }`}
                    >
                      <span className="text-xs font-bold">A. 6/8</span>
                      {q1 === "6/8" && <span className="material-symbols-outlined text-[18px]">check_circle</span>}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setQ1("5/6")}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex justify-between items-center cursor-pointer ${
                        q1 === "5/6" ? "border-primary bg-primary-fixed/20 text-primary" : "border-outline-variant/35 bg-slate-50 hover:border-primary/30"
                      }`}
                    >
                      <span className="text-xs font-bold">B. 5/6</span>
                      {q1 === "5/6" && <span className="material-symbols-outlined text-[18px]">check_circle</span>}
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-outline-variant/15 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">2</span>
                    <p className="font-bold text-sm text-on-surface">Explain why $2/3$ and $4/6$ are equivalent fractions.</p>
                  </div>
                  <textarea 
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-outline-variant/20 focus:outline-none focus:border-primary/50 min-h-[120px] text-xs font-semibold" 
                    placeholder="Type explanation here..."
                    value={q2}
                    onChange={(e) => setQ2(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-outline-variant/15 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">3</span>
                    <p className="font-bold text-sm text-on-surface">Identify the correct visual representation of $1/3$ fraction.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 select-none">
                    <div 
                      onClick={() => setQ3("A")}
                      className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer shadow-sm ${
                        q3 === "A" ? "border-primary bg-primary/5" : "border-transparent"
                      }`}
                    >
                      <div className="aspect-video bg-slate-50 flex items-center justify-center">
                        <img 
                          className="w-16 h-16 object-contain" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6Ct9Xyjo0nYtztjF70QaNp5WZaB9u9p-g_efrjPO7RotwlfQLC-Ot-0tIfIaeQlgD1dldIVMWt6nbg6FW4lEoJsop9ybjO8CnqkSsiZnqwoxkf7iTPhGQWHhYk7KqHJc0y0pfhp_Kk5MrZAYtplwn_WZg_gtDkw8g5kkT6jSVzwAkUSWyGDnQoLkX9v4fpHXj-39I96QOBcDQJWuxAntp5BH7teiF6-uI3x-5tE9ZPiDcYUnO-sTtk2Jsk5QsV4CFqBozYU1rIt4" 
                          alt="rect"
                        />
                      </div>
                      {q3 === "A" && <div className="absolute inset-0 bg-primary/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary scale-125">verified</span></div>}
                    </div>

                    <div 
                      onClick={() => setQ3("B")}
                      className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer shadow-sm ${
                        q3 === "B" ? "border-primary bg-primary/5" : "border-transparent"
                      }`}
                    >
                      <div className="aspect-video bg-slate-50 flex items-center justify-center">
                        <img 
                          className="w-16 h-16 object-contain" 
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmASqu9CwEAi9f2khIcvLWVl3aryVUeWyPbXclmTFm2eylHoYbPFoKI0Uu74Rm3li5YKu89oVIFQTC1z2J6QQk6zGrl3taFPrduNSVLPz5quennU4XxNVkO32AuWKOk30NnTciapthC36wOqhly0Sp3bFT3FaNuRaH8ZOKVsfJ5iQR8cOQfzNYXyhNZSDhkIcwKauu3kNT3B0hchT3DibmuGVQxtjyEopyzIvnJSaxk3lK60qVmvhcyZ0o7vET4QwA9Gu41mTECmo" 
                          alt="sq"
                        />
                      </div>
                      {q3 === "B" && <div className="absolute inset-0 bg-primary/10 flex items-center justify-center"><span className="material-symbols-outlined text-primary scale-125">verified</span></div>}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-outline-variant/15 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">4</span>
                    <p className="font-bold text-sm text-on-surface">Is $5/4$ an improper fraction?</p>
                  </div>
                  <div className="flex gap-4 select-none">
                    <button 
                      type="button"
                      onClick={() => setQ4("Yes")}
                      className={`flex-grow py-3 px-4 rounded-xl border-2 font-bold text-xs transition-all active:scale-95 cursor-pointer ${
                        q4 === "Yes" ? "border-primary bg-primary-fixed/20 text-primary" : "border-outline-variant/35 text-on-surface bg-slate-50"
                      }`}
                    >
                      Yes
                    </button>
                    <button 
                      type="button"
                      onClick={() => setQ4("No")}
                      className={`flex-grow py-3 px-4 rounded-xl border-2 font-bold text-xs transition-all active:scale-95 cursor-pointer ${
                        q4 === "No" ? "border-primary bg-primary-fixed/20 text-primary" : "border-outline-variant/35 text-on-surface bg-slate-50"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6 flex justify-end">
              <button 
                type="submit"
                disabled={loading || !q1 || !q2 || !q3 || !q4}
                className={`px-8 h-12 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all ${
                  q1 && q2 && q3 && q4 && !loading
                    ? "bg-gradient-to-r from-primary to-secondary text-white cursor-pointer active:scale-95" 
                    : "bg-slate-300 text-slate-500 cursor-not-allowed opacity-60"
                }`}
              >
                {loading ? <span>Submitting...</span> : <><span>Submit Homework</span><span className="material-symbols-outlined text-[18px]">send</span></>}
              </button>
            </div>
          </form>
        )}
      </main>
    </PageContainer>
  );
}
