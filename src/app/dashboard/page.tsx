"use client";

import React, { useState, useEffect } from "react";
import { useLearning } from "@/context/LearningContext";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import ContinueLearningCard from "@/components/dashboard/ContinueLearningCard";

import QuickActions from "@/components/dashboard/QuickActions";
import AIRecommendationCard from "@/components/dashboard/AIRecommendationCard";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";

export default function DashboardPage() {
  const { studentName, percentComplete, activeSubject, activeChapter, activeTopic, subjectProficiencies, weaknesses } = useLearning();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading skeleton
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const hasWeakness = weaknesses && weaknesses.length > 0;
  const recommendationText = hasWeakness
    ? `I checked your homework details. Let's finish the Concept Recovery for ${weaknesses[0].skillName} to get 100% chapter mastery today!`
    : `You are doing great! Let's continue studying your active topic, "${activeTopic}", to stay ahead!`;
  const actionLabel = hasWeakness ? "Start Recovery Session" : "Resume Learning";
  const actionHref = hasWeakness ? "/recovery/mixed-numbers" : "/learning/fractions";

  return (
    <PageContainer>
      <Topbar title="Dashboard" subtitle={`Welcome back, ${studentName}!`} showSearch={true} />

      <main className="p-4 md:p-8 max-w-300 mx-auto w-full space-y-6">
        {loading ? (
          <LoadingSkeleton type="dashboard" />
        ) : (
          <>
            {/* Continue Learning Card */}
            <ContinueLearningCard 
              subjectName={activeSubject}
              chapterTitle={activeChapter}
              topicTitle={activeTopic}
              percentComplete={percentComplete}
            />

            {/* Quick Actions Shortcuts */}
            <section className="space-y-3">
              <h3 className="font-bold text-sm text-on-surface pl-1">Quick Tools</h3>
              <QuickActions />
            </section>

            {/* Maya AI Suggestion Card */}
            <AIRecommendationCard 
              studentName={studentName}
              recommendationText={recommendationText}
              actionLabel={actionLabel}
              actionHref={actionHref}
            />

            {/* Proficiencies preview section */}
            <section className="bg-white p-6 rounded-[28px] border border-outline-variant/15 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-on-surface">Subject Analytics Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
                {subjectProficiencies.map((sub, idx) => (
                  <div key={idx} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-on-surface">
                      <span>{sub.name}</span>
                      <span className="text-primary">{sub.score}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${sub.colorClass} rounded-full`} style={{ width: `${sub.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </PageContainer>
  );
}
