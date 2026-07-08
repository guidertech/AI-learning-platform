"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import EmptyState from "@/components/layout/EmptyState";
import { mockChapters } from "@/lib/mock/chapters";
import { mockSubjects } from "@/lib/mock/subjects";

interface ChaptersPageProps {
  params: Promise<{ subjectId: string }>;
}

export default function SubjectChaptersPage({ params }: ChaptersPageProps) {
  const router = useRouter();
  const { subjectId } = use(params);

  const subject = mockSubjects.find((s) => s.id === subjectId);
  const chapters = mockChapters[subjectId] || [];

  const subjectName = subject?.name || "Subject Details";

  return (
    <PageContainer>
      <Topbar 
        title={`${subjectName} Chapters`} 
        subtitle="Select a chapter to review its study roadmap" 
        showSearch={true} 
      />

      <main className="p-8 max-w-[1200px] mx-auto w-full space-y-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push("/subjects")}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <span className="text-xs font-bold text-outline uppercase tracking-wider">Back to subjects</span>
        </div>

        {chapters.length === 0 ? (
          <EmptyState 
            title="No Chapters Available" 
            description="There are currently no chapters or topics assigned to this subject curriculum." 
            icon="menu_book"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
            {chapters.map((ch) => (
              <div 
                key={ch.id}
                onClick={() => router.push(`/chapters/${ch.id}`)}
                className="bg-white p-6 rounded-3xl border border-outline-variant/15 hover:border-primary/40 shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.98] flex flex-col justify-between h-44 group"
              >
                <div>
                  <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Roadmap Syllabus</span>
                  <h3 className="font-bold text-base text-on-surface mt-1 group-hover:text-primary transition-colors">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-medium mt-1 leading-relaxed line-clamp-2">
                    {ch.description}
                  </p>
                </div>
                <div className="flex justify-between items-center border-t border-slate-50 pt-3">
                  <span className="text-[10px] text-outline font-semibold">{ch.topics.length} Study Topics</span>
                  <span className="text-xs text-primary font-bold flex items-center gap-1">
                    Start Roadmap <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </PageContainer>
  );
}
