"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import EmptyState from "@/components/layout/EmptyState";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import { mockSubjects } from "@/lib/mock/subjects";

export default function SubjectsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageContainer>
      <Topbar title="Explore Subjects" subtitle="Explore your active school curriculum" showSearch={true} showBack={true} />

      <main className="p-4 md:p-8 max-w-[1200px] mx-auto w-full">
        {loading ? (
          <LoadingSkeleton type="subjects" />
        ) : mockSubjects.length === 0 ? (
          <EmptyState 
            title="No Subjects Enrolled" 
            description="You are not enrolled in any study subjects. Ask your teacher to assign courses!" 
            icon="school"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
            {mockSubjects.map((sub) => (
              <div 
                key={sub.id}
                onClick={() => router.push(`/subjects/${sub.id}/chapters`)}
                className="bg-white rounded-[28px] p-6 border border-outline-variant/15 hover:border-primary/40 shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-[0.98] flex flex-col justify-between h-40 group relative overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${sub.color || "bg-primary text-white"}`}>
                    <span className="material-symbols-outlined text-[24px]">{sub.icon || "calculate"}</span>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors text-[20px]">arrow_forward</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-on-surface">{sub.name}</h3>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-1">Syllabus Active</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </PageContainer>
  );
}
