import { createClient } from "@/lib/supabase/client";

export async function saveQuizAttempt(
  chapterIdCode: number,
  totalQuestions: number,
  correctCount: number
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const supabase = createClient();
    
    // Get the current logged-in user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.warn("[saveQuizAttempt] No logged-in user found. Skipping DB save.");
      return { success: false, error: "No authenticated user" };
    }

    const total_marks = 20;
    // Calculate obtained marks proportionally (e.g. correctCount * 2 if 10 questions)
    const obtain_marks = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 20) : 0;

    // Check if an attempt for this user & chapter already exists
    const { data: existing } = await supabase
      .from("quiz_attempts")
      .select("id")
      .eq("user_id", user.id)
      .eq("chapter_id", chapterIdCode)
      .maybeSingle();

    if (existing) {
      // Update existing record instead of creating a new entry
      const { data, error } = await supabase
        .from("quiz_attempts")
        .update({
          total_marks,
          obtain_marks,
          attempted_at: new Date().toISOString()
        })
        .eq("id", existing.id)
        .select();

      if (error) {
        console.warn("[saveQuizAttempt] DB update error:", error.message);
        return { success: false, error: error.message };
      }

      console.log("[saveQuizAttempt] Successfully updated existing quiz attempt:", data);
      return { success: true, data };
    } else {
      // Insert new record if first attempt
      const { data, error } = await supabase
        .from("quiz_attempts")
        .insert([
          {
            user_id: user.id,
            chapter_id: chapterIdCode,
            total_marks,
            obtain_marks,
            attempted_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        console.warn("[saveQuizAttempt] DB insert error:", error.message);
        return { success: false, error: error.message };
      }

      console.log("[saveQuizAttempt] Successfully created new quiz attempt:", data);
      return { success: true, data };
    }
  } catch (err: any) {
    console.warn("[saveQuizAttempt] Unexpected error:", err);
    return { success: false, error: err.message || String(err) };
  }
}
