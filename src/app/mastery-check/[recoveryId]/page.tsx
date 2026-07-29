"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useLearning } from "@/context/LearningContext";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";

interface MasteryCheckPageProps {
  params: Promise<{ recoveryId: string }>;
}

export default function MasteryCheckPage({ params }: MasteryCheckPageProps) {
  const router = useRouter();
  const { recoveryId } = use(params);

  const { studentName, updateProgress } = useLearning();

  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelectOption = (opt: string) => {
    if (checked || analyzing) return;
    setSelectedOpt(opt);
  };

  const handleCheck = () => {
    if (!selectedOpt) return;
    setAnalyzing(true);

    setTimeout(() => {
      setAnalyzing(false);
      setChecked(true);
      const correct = selectedOpt === "B";
      setIsCorrect(correct);

      if (correct) {
        updateProgress(85);
      }
    }, 1500);
  };

  const handleContinue = () => {
    router.push("/dashboard");
  };

  return (
    <PageContainer>
      <Topbar 
        title="Verification Mastery Check" 
        subtitle="Verify concept readiness to proceed to the next syllabus module" 
      />

      <main className="p-8 max-w-[1200px] mx-auto w-full space-y-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push(`/recovery/${recoveryId}`)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <span className="text-xs font-bold text-outline uppercase tracking-wider">Back to Recovery Loop</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Visual Options - 7 cols */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-[28px] border border-outline-variant/15 shadow-sm space-y-6">
              <div>
                <h3 className="font-bold text-base text-on-surface">Which of these options shows $1/4$ being shared equally?</h3>
                <p className="text-xs text-on-surface-variant mt-1">Select the graphic representing standard fractional equal sharing.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 select-none">
                {/* Option A */}
                <button 
                  onClick={() => handleSelectOption("A")}
                  className={`flex items-center p-4 rounded-2xl border-2 transition-all duration-200 text-left cursor-pointer ${
                    checked && selectedOpt === "A" && !isCorrect ? "border-red-500 bg-red-50/25" :
                    selectedOpt === "A" ? "border-primary bg-primary-fixed/20" : "bg-slate-50 border-transparent"
                  }`}
                >
                  <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center mr-4 shadow-sm">
                    <img 
                      className="w-10 h-10 object-contain" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMW-HNw613YX0roFkynncxF_Kc5qPVp7boRBObK-ngIfCeQARAGOxA3iaLHv2ApNkEbRkTya7X_hjqj_wP91SIITUuwVt6CrprxL_7NBvG0AGCFr-ESQYlO8BV3NFbgabdOpwgBNsLMb2qpNawX5i0kxt4HBlGvlm3ViGIJR3Pdk2a-XANLKKwmTcYLjG1G_5PT97nrjVr7NMcXZRi-7Pbv0W-1qTsiq3r7dlbb62XGdWpMt7rPOn07khG_hzl1_q_qWE6LKYq0Eo"
                      alt="A unequal"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-on-surface block">Option A</span>
                    <span className="text-[10px] text-outline font-medium">Four unequal slices</span>
                  </div>
                </button>

                {/* Option B */}
                <button 
                  onClick={() => handleSelectOption("B")}
                  className={`flex items-center p-4 rounded-2xl border-2 transition-all duration-200 text-left cursor-pointer ${
                    checked && selectedOpt === "B" && isCorrect ? "border-green-500 bg-green-50/25" :
                    checked && selectedOpt !== "B" ? "border-green-500 bg-green-50/10" :
                    selectedOpt === "B" ? "border-primary bg-primary-fixed/20" : "bg-slate-50 border-transparent"
                  }`}
                >
                  <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center mr-4 shadow-sm">
                    <img 
                      className="w-10 h-10 object-contain" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmASqu9CwEAi9f2khIcvLWVl3aryVUeWyPbXclmTFm2eylHoYbPFoKI0Uu74Rm3li5YKu89oVIFQTC1z2J6QQk6zGrl3taFPrduNSVLPz5quennU4XxNVkO32AuWKOk30NnTciapthC36wOqhly0Sp3bFT3FaNuRaH8ZOKVsfJ5iQR8cOQfzNYXyhNZSDhkIcwKauu3kNT3B0hchT3DibmuGVQxtjyEopyzIvnJSaxk3lK60qVmvhcyZ0o7vET4QwA9Gu41mTECmo"
                      alt="B equal"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-on-surface block">Option B (Correct)</span>
                    <span className="text-[10px] text-outline font-medium">Four perfect equal squares</span>
                  </div>
                </button>

                {/* Option C */}
                <button 
                  onClick={() => handleSelectOption("C")}
                  className={`flex items-center p-4 rounded-2xl border-2 transition-all duration-200 text-left cursor-pointer ${
                    checked && selectedOpt === "C" && !isCorrect ? "border-red-500 bg-red-50/25" :
                    selectedOpt === "C" ? "border-primary bg-primary-fixed/20" : "bg-slate-50 border-transparent"
                  }`}
                >
                  <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center mr-4 shadow-sm">
                    <img 
                      className="w-10 h-10 object-contain" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6Ct9Xyjo0nYtztjF70QaNp5WZaB9u9p-g_efrjPO7RotwlfQLC-Ot-0tIfIaeQlgD1dldIVMWt6nbg6FW4lEoJsop9ybjO8CnqkSsiZnqwoxkf7iTPhGQWHhYk7KqHJc0y0pfhp_Kk5MrZAYtplwn_WZg_gtDkw8g5kkT6jSVzwAkUSWyGDnQoLkX9v4fpHXj-39I96QOBcDQJWuxAntp5BH7teiF6-uI3x-5tE9ZPiDcYUnO-sTtk2Jsk5QsV4CFqBozYU1rIt4"
                      alt="C vertical"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-on-surface block">Option C</span>
                    <span className="text-[10px] text-outline font-medium">Three equal vertical sections</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: AI Analysis & Actions - 5 cols */}
          <div className="lg:col-span-5 bg-white p-6 rounded-[28px] border border-outline-variant/15 shadow-sm flex flex-col justify-between h-fit min-h-[300px]">
            <div className="space-y-4">
              <section className="bg-gradient-to-br from-primary/5 to-[#f3f0ff] rounded-[24px] p-5 border border-primary/10 flex gap-4 select-none">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-primary-fixed">
                  <img 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAX59yUFIdkA2OyIV-0z7-13MBmtWophJHBh2E0i2iSyPSELxOhpbB8fouRH2GTOMoFEA3lsR3fimuOyy6cp1c0Rxme0q6KXTAjNw6NS3cYtk4SyaMN7OTWiO99_55RllMsJtUecrAni7Jw1txtIb8tZjeCS0dtF59X-v-4QVkiEdQgVZsC8esS5cTwf4cTV-g1aSoUlEwBrTFgasyBp1DHnQR0XfQD1fu4Q6W_Brf22Mhjm4clHh1KuIIy1cMpBIp3IISLyxDLSeg"
                    alt="Maya Avatar"
                  />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] text-primary uppercase font-bold tracking-wider">Maya AI Teacher</p>
                  <p className="text-xs text-on-surface leading-relaxed font-semibold">
                    Awesome, {studentName}! Let's finish the final verification step. Select the representation that correctly shows 1/4.
                  </p>
                </div>
              </section>
            </div>

            <div className="pt-6 border-t border-slate-100">
              {!checked ? (
                <button 
                  onClick={handleCheck}
                  disabled={!selectedOpt || analyzing}
                  className={`w-full h-12 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-1.5 transition-all ${
                    selectedOpt && !analyzing
                      ? "bg-primary text-white cursor-pointer active:scale-95" 
                      : "bg-slate-300 text-slate-500 cursor-not-allowed opacity-60"
                  }`}
                >
                  {analyzing ? "AI Analysis in progress..." : "Check My Answer"}
                </button>
              ) : (
                <button 
                  onClick={isCorrect ? handleContinue : () => { setChecked(false); setSelectedOpt(null); }}
                  className={`w-full h-12 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isCorrect ? "bg-green-600 text-white hover:bg-green-700" : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {isCorrect ? "Continue to Dashboard" : "Try Again"}
                </button>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Analysis Overlay Simulator */}
      {analyzing && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end justify-center">
          <div className="bg-white w-full max-w-xl rounded-t-[32px] p-6 space-y-6 animate-slide-up shadow-2xl">
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto"></div>
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">psychology</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-sm text-on-surface">Evaluating Answer</h3>
                <p className="text-[10px] text-on-surface-variant mt-0.5">Maya is validating the conceptual alignment...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
