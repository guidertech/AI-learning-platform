"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import EmptyState from "@/components/layout/EmptyState";
import { mockChapters } from "@/lib/mock/chapters";

interface ChapterDetailPageProps {
  params: Promise<{ chapterId: string }>;
}

export default function ChapterDetailPage({ params }: ChapterDetailPageProps) {
  const router = useRouter();
  const { chapterId } = use(params);

  // Search for the chapter across all subjects
  let foundChapter: any = null;
  let subjectId = "";

  for (const subId in mockChapters) {
    const ch = mockChapters[subId].find((c) => c.id === chapterId);
    if (ch) {
      foundChapter = ch;
      subjectId = subId;
      break;
    }
  }

  if (!foundChapter) {
    return (
      <PageContainer>
        <Topbar title="Chapter Roadmap" />
        <main className="p-8">
          <EmptyState 
            title="Chapter Not Found" 
            description="The selected chapter study roadmap could not be loaded." 
            icon="error"
          />
        </main>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Topbar 
        title={foundChapter.title} 
        subtitle="Complete topics to unlock the next chapter milestones" 
        showSearch={true} 
      />

      <main className="p-8 max-w-[1200px] mx-auto w-full space-y-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push(`/subjects/${subjectId}/chapters`)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <span className="text-xs font-bold text-outline uppercase tracking-wider">Back to Chapters</span>
        </div>

        {/* Topics outline list */}
        <section className="bg-white p-6 rounded-[28px] border border-outline-variant/15 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-on-surface mb-2 pl-1">Syllabus Outline</h3>
          
          <div className="space-y-3 select-none">
            {foundChapter.topics.map((top: any, idx: number) => (
              <div 
                key={top.id}
                onClick={() => router.push(`/learning/fractions`)}
                className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-primary-container/5 rounded-2xl border border-outline-variant/10 hover:border-primary/20 transition-all cursor-pointer group active:scale-[0.99]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-on-surface group-hover:text-primary transition-colors">
                      {top.title}
                    </h4>
                    <p className="text-[10px] text-outline font-semibold uppercase tracking-wider mt-0.5">Socrates Enabled</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-all text-[20px]">
                  chevron_right
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PageContainer>
  );
}
