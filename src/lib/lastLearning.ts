import type { SupabaseClient } from "@supabase/supabase-js";

export type LastLearningIds = {
  classId: number | string;
  subjectId: number | string;
  chapterId: number | string;
  topicId: number | string;
};

export type LastLearningRow = {
  id: number;
  created_at: string;
  user_id: string;
  class_id: number | string;
  subject_id: number | string;
  chapter_id: number | string;
  topic_id: number | string;
};

export async function persistLastLearning(
  supabase: SupabaseClient,
  userId: string,
  ids: LastLearningIds,
) {
  // Try server API route first to bypass client RLS policies cleanly
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }

    const response = await fetch("/api/save-last-learning", {
      method: "POST",
      headers,
      body: JSON.stringify({
        userId,
        classId: ids.classId,
        subjectId: ids.subjectId,
        chapterId: ids.chapterId,
        topicId: ids.topicId,
      }),
    });

    if (response.ok) {
      return;
    }
  } catch (apiError) {
    console.warn("[persistLastLearning] API call error, trying client query:", apiError);
  }

  // Fallback direct client update
  const values = {
    user_id: userId,
    class_id: ids.classId,
    subject_id: ids.subjectId,
    chapter_id: ids.chapterId,
    topic_id: ids.topicId,
    created_at: new Date().toISOString(),
  };

  const { data: existing } = await supabase
    .from("last_learning")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    await supabase.from("last_learning").update(values).eq("user_id", userId);
  } else {
    await supabase.from("last_learning").insert(values);
  }
}

export function saveLastLearning(
  supabase: SupabaseClient,
  userId: string,
  ids: LastLearningIds,
) {
  return persistLastLearning(supabase, userId, ids).catch((err) => {
    console.error("[saveLastLearning] Failed to save last learning:", err);
  });
}

export async function getLastLearning(
  supabase: SupabaseClient,
  userId: string,
): Promise<LastLearningRow | null> {
  const { data, error } = await supabase
    .from("last_learning")
    .select("id, created_at, user_id, class_id, subject_id, chapter_id, topic_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn("[getLastLearning] Error fetching last_learning:", error.message);
    return null;
  }
  return data as LastLearningRow | null;
}

