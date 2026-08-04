"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import EmptyState from "@/components/layout/EmptyState";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import { createClient } from "@/lib/supabase/client";
import SubjectIcon from "@/components/SubjectIcon";

const SUBJECT_COLORS = [
  "bg-primary text-white",
  "bg-[#0ea5e9] text-white",
  "bg-[#f59e0b] text-white",
  "bg-[#10b981] text-white",
  "bg-[#ec4899] text-white",
  "bg-[#8b5cf6] text-white",
];

const SUBJECT_GLOWS = [
  {
    hoverBorder: "hover:border-[#5341cd]/30",
    hoverBg: "hover:bg-[#5341cd]/2",
    hoverShadow: "hover:shadow-[0_16px_32px_rgba(83,65,205,0.14)]",
    textClass: "text-[#5341cd]"
  },
  {
    hoverBorder: "hover:border-[#0ea5e9]/30",
    hoverBg: "hover:bg-[#0ea5e9]/2",
    hoverShadow: "hover:shadow-[0_16px_32px_rgba(14,165,233,0.14)]",
    textClass: "text-[#0ea5e9]"
  },
  {
    hoverBorder: "hover:border-[#f59e0b]/30",
    hoverBg: "hover:bg-[#f59e0b]/2",
    hoverShadow: "hover:shadow-[0_16px_32px_rgba(245,158,11,0.14)]",
    textClass: "text-[#f59e0b]"
  },
  {
    hoverBorder: "hover:border-[#10b981]/30",
    hoverBg: "hover:bg-[#10b981]/2",
    hoverShadow: "hover:shadow-[0_16px_32px_rgba(16,185,129,0.14)]",
    textClass: "text-[#10b981]"
  },
  {
    hoverBorder: "hover:border-[#ec4899]/30",
    hoverBg: "hover:bg-[#ec4899]/2",
    hoverShadow: "hover:shadow-[0_16px_32px_rgba(236,72,153,0.14)]",
    textClass: "text-[#ec4899]"
  },
  {
    hoverBorder: "hover:border-[#8b5cf6]/30",
    hoverBg: "hover:bg-[#8b5cf6]/2",
    hoverShadow: "hover:shadow-[0_16px_32px_rgba(139,92,246,0.14)]",
    textClass: "text-[#8b5cf6]"
  }
];

export default function SubjectsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    async function loadSubjects() {
      const supabase = createClient();
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from("users")
          .select("class_id")
          .eq("id", user.id)
          .maybeSingle();

        if (profile?.class_id) {
          const { data: dbSubjects } = await supabase
            .from("subjects")
            .select("*")
            .eq("class_id", profile.class_id);

          if (dbSubjects) {
            setSubjects(dbSubjects);
          }
        }
      } catch (error) {
        console.error("Error loading subjects:", error);
      } finally {
        setLoading(false);
      }
    }

    void loadSubjects();
  }, []);

  return (
    <PageContainer>
      <Topbar title="Explore Subjects" subtitle="Explore your active school curriculum" showSearch={true} showBack={true} />

      <main className="p-4 md:p-8 max-w-[1200px] mx-auto w-full">
        {loading ? (
          <LoadingSkeleton type="subjects" />
        ) : subjects.length === 0 ? (
          <EmptyState 
            title="No Subjects Enrolled" 
            description="You are not enrolled in any study subjects. Ask your teacher to assign courses!" 
            icon="school"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
            {subjects.map((sub, index) => {
              const colorClass = SUBJECT_COLORS[index % SUBJECT_COLORS.length];
              const glow = SUBJECT_GLOWS[index % SUBJECT_GLOWS.length];
              return (
                <div 
                  key={sub.subject_id}
                  onClick={() => router.push(`/subjects/${sub.subject_id}/chapters`)}
                  className={`bg-white rounded-[28px] p-6 border border-outline-variant/15 transition-all duration-300 hover:-translate-y-1 cursor-pointer active:scale-[0.98] flex flex-col items-center justify-center text-center h-52 group relative overflow-hidden ${glow.hoverBorder} ${glow.hoverBg} ${glow.hoverShadow}`}
                >
                  {/* Arrow at top-right */}
                  <span className={`absolute top-5 right-5 material-symbols-outlined text-outline group-hover:translate-x-0.5 group-hover:text-primary transition-all duration-300 text-[20px] ${glow.textClass}`}>arrow_forward</span>
                  
                  {/* Icon container */}
                  <div className="w-20 h-20 rounded-3xl bg-white border border-slate-100 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-300 mb-2">
                    <SubjectIcon icon={sub.icon} sizeClassName="text-[64px]" fallbackIcon="calculate" className="text-primary" />
                  </div>

                  <div className="flex flex-col items-center">
                    <h3 className="font-bold text-base text-on-surface">{sub.name}</h3>
                    <div className="flex items-center mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Syllabus Active</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </PageContainer>
  );
}
