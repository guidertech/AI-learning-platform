"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {createClient} from "@/lib/supabase/client";
import {getLastLearning} from "@/lib/lastLearning";


export default function LearningBasePage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const supabase = createClient();
      const {data: {user}} = await supabase.auth.getUser();
      if (!user || cancelled) {
        router.replace("/subjects");
        return;
      }

      try {
        const lastLearning = await getLastLearning(supabase, user.id);
        if (!cancelled && lastLearning) {
          router.replace(`/learning/${lastLearning.topic_id}`);
          return;
        }
      } catch (error) {
        console.error("Could not load last learning topic:", error);
      }

      if (!cancelled) router.replace("/subjects");
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
