"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockChapters } from "@/lib/mock/chapters";

export default function LearningBasePage() {
  const router = useRouter();

  useEffect(() => {
    // 1. Check if there is a last studied topic saved in local or session storage
    const lastTopic = sessionStorage.getItem("last_studied_topic") || localStorage.getItem("last_studied_topic");
    if (lastTopic) {
      router.replace(`/learning/${lastTopic}`);
      return;
    }

    // 2. Default: take them to the first topic of the first Mathematics chapter (Place Values)
    const firstChapter = mockChapters["sub-math"]?.[0];
    const firstTopic = firstChapter?.topics?.[0];
    if (firstTopic) {
      router.replace(`/learning/${firstTopic.slug}`);
      return;
    }

    // 3. Fallback to subjects selector if no data is found
    router.replace("/subjects");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
