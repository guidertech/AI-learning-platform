"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import { createClient } from "@/lib/supabase/client";
import { getLastLearning } from "@/features/learning";

export default function HomeworkPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [topicTitle, setTopicTitle] = useState<string>("Video Lesson Assignment");
  const [videoUrl, setVideoUrl] = useState<string>("https://youtu.be/qklEjgymmYY");

  useEffect(() => {
    async function loadHomeworkData() {
      const supabase = createClient();
      setLoading(true);

      try {
        const { data: { user } } = await supabase.auth.getUser();

        let topicId: string | number | null = null;

        if (user) {
          const lastLearningRow = await getLastLearning(supabase, user.id);
          if (lastLearningRow && lastLearningRow.topic_id) {
            topicId = lastLearningRow.topic_id;
          }
        }

        let dbTopic: any = null;

        if (topicId) {
          const numTopicId = parseInt(String(topicId), 10);

          // 1. Fetch topic details from topics table
          if (!isNaN(numTopicId)) {
            const { data: byTopicId } = await supabase
              .from("topics")
              .select("*")
              .eq("topic_id", numTopicId)
              .maybeSingle();
            dbTopic = byTopicId;
          }

          if (!dbTopic) {
            const { data: bySlug } = await supabase
              .from("topics")
              .select("*")
              .eq("slug", String(topicId))
              .maybeSingle();
            dbTopic = bySlug;
          }

          if (!dbTopic) {
            const { data: byId } = await supabase
              .from("topics")
              .select("*")
              .eq("id", String(topicId))
              .maybeSingle();
            dbTopic = byId;
          }
        }

        // Set topic title
        if (dbTopic?.topic_name) {
          setTopicTitle(dbTopic.topic_name);
        } else if (topicId) {
          setTopicTitle(String(topicId).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
        }

        // 2. Fetch video_url from topic_notes_images table matching topic_id
        if (topicId) {
          const numTopicId = parseInt(String(topicId), 10);
          let fetchedVideoUrl: string | null = null;

          if (!isNaN(numTopicId)) {
            const { data: imgRow } = await supabase
              .from("topic_notes_images")
              .select("video_url")
              .eq("topic_id", numTopicId)
              .maybeSingle();
            if (imgRow?.video_url) fetchedVideoUrl = imgRow.video_url;
          }

          if (!fetchedVideoUrl) {
            const { data: imgRow } = await supabase
              .from("topic_notes_images")
              .select("video_url")
              .eq("topic_id", String(topicId))
              .maybeSingle();
            if (imgRow?.video_url) fetchedVideoUrl = imgRow.video_url;
          }

          if (!fetchedVideoUrl) {
            const { data: imgRow } = await supabase
              .from("topic_notes_images")
              .select("video_url")
              .eq("id", String(topicId))
              .maybeSingle();
            if (imgRow?.video_url) fetchedVideoUrl = imgRow.video_url;
          }

          // Fallback if specific topic_id row isn't found
          if (!fetchedVideoUrl) {
            const { data: firstRow } = await supabase
              .from("topic_notes_images")
              .select("video_url")
              .not("video_url", "is", null)
              .limit(1)
              .maybeSingle();
            if (firstRow?.video_url) fetchedVideoUrl = firstRow.video_url;
          }

          if (fetchedVideoUrl) {
            setVideoUrl(fetchedVideoUrl);
          }
        }
      } catch (err) {
        console.error("Error loading homework video data:", err);
      } finally {
        setLoading(false);
      }
    }

    void loadHomeworkData();
  }, []);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the link when copying
    navigator.clipboard.writeText(videoUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageContainer>
      <Topbar 
        title={`📚 Homework: ${topicTitle}`} 
        subtitle="Open or copy the lesson video link to complete your assignment" 
        showBack={true}
      />

      <main className="p-4 md:p-8 max-w-[700px] mx-auto w-full space-y-6">
        {loading ? (
          <LoadingSkeleton type="workspace" />
        ) : (
          <>
            {/* Banner info */}
            <section className="bg-gradient-to-br from-primary-container to-secondary p-6 rounded-3xl text-white relative overflow-hidden shadow-sm select-none">
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] font-bold opacity-90 uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  Video Lesson Assignment
                </span>
                <h2 className="font-bold text-lg pt-1">{topicTitle}</h2>
                <p className="text-xs opacity-90 leading-relaxed max-w-[550px]">
                  Maya has selected this lesson video link for you. Click on the link box below to open the lesson on YouTube.
                </p>
              </div>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            </section>

            {/* Link Box Container */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-outline uppercase tracking-wider pl-1">
                YouTube Lesson URL
              </label>
              <div 
                onClick={() => window.open(videoUrl, "_blank")}
                className="flex items-center justify-between p-4 bg-white border border-outline-variant/20 hover:border-primary/30 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all group shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <span className="material-symbols-outlined text-red-500 text-[22px] shrink-0">
                    smart_display
                  </span>
                  <span className="text-xs font-semibold text-primary underline truncate select-all group-hover:text-primary-container">
                    {videoUrl}
                  </span>
                </div>
                
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-bold transition-all border cursor-pointer ${
                    copied 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                      : "bg-white text-on-surface border-outline-variant/30 hover:bg-slate-50"
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copied ? "check" : "content_copy"}
                  </span>
                  <span>{copied ? "Copied!" : "Copy Link"}</span>
                </button>
              </div>
            </div>

            {/* Action Controls */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
              <button 
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 bg-white border border-outline-variant/30 text-on-surface font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 active:scale-[0.98] transition-all text-xs"
              >
                <span className="material-symbols-outlined text-[18px]">dashboard</span>
                <span>Back to Dashboard</span>
              </button>
              
              <button 
                onClick={() => router.push("/dashboard")}
                className="px-8 py-3 bg-primary text-white font-bold rounded-2xl shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] hover:opacity-95 transition-all text-xs"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Mark as Completed</span>
              </button>
            </div>
          </>
        )}
      </main>
    </PageContainer>
  );
}
