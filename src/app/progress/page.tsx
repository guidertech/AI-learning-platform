"use client";

import React, { useState, useEffect } from "react";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import ProgressStats from "@/components/progress/ProgressStats";
import SubjectProgressCard from "@/components/progress/SubjectProgressCard";
import LearningJourneyCard from "@/components/progress/LearningJourneyCard";
import EmptyState from "@/components/layout/EmptyState";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import { mockDailyStats, mockMilestones, mockSubjectProficiencies } from "@/lib/mock/progress";
import { useLearning } from "@/context/LearningContext";

export default function ProgressPage() {
  const { studentName, studentMins } = useLearning();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Update today's bar stats in chart using studyMins from Context
  const updatedStats = mockDailyStats.map((d) => {
    if (d.day === "Thu") {
      return { ...d, hours: parseFloat((studentMins / 60).toFixed(1)), heightPercent: `${Math.min(Math.round((studentMins / 60) * 20), 100)}%` };
    }
    return d;
  });

  return (
    <PageContainer>
      <Topbar 
        title="🏆 Progress & Milestones" 
        subtitle="Track active minutes, streak targets, and achievements" 
        showBack={true}
      />

      <main className="p-4 md:p-8 max-w-[1200px] mx-auto w-full space-y-6">
        {loading ? (
          <LoadingSkeleton type="dashboard" />
        ) : mockDailyStats.length === 0 ? (
          <EmptyState 
            title="No Progress Recorded" 
            description="Start practicing lessons in the workspace to gather analytics!"
            icon="bar_chart"
          />
        ) : (
          <>
            {/* Top row - split layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Weekly study hours bar chart - 6 cols */}
              <div className="lg:col-span-7">
                <ProgressStats 
                  stats={updatedStats}
                  avgStudyHours="2.3h"
                  totalLessons={14}
                />
              </div>

              {/* Right Column: Achievements & Streak - 5 cols */}
              <div className="lg:col-span-5 space-y-6">
                <LearningJourneyCard milestones={mockMilestones} />
                
                {/* Visual goal ring */}
                <div className="bg-white p-6 rounded-[28px] border border-outline-variant/15 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Weekly target</span>
                    <h4 className="font-bold text-sm text-on-surface">Curriculum Completion</h4>
                    <p className="text-xs text-on-surface-variant font-medium">Currently on track for Grade 5 Syllabus.</p>
                  </div>
                  <div className="relative w-16 h-16 shrink-0 select-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle className="text-slate-100 stroke-current" cx="50" cy="50" fill="transparent" r="40" strokeWidth="8"></circle>
                      <circle className="text-primary stroke-current" cx="50" cy="50" fill="transparent" r="40" strokeLinecap="round" strokeWidth="8" style={{ strokeDasharray: "251.2", strokeDashoffset: "45" }}></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center"><span className="font-bold text-xs text-primary">82%</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Proficiency cards row */}
            <SubjectProgressCard proficiencies={mockSubjectProficiencies} />
          </>
        )}
      </main>
    </PageContainer>
  );
}
