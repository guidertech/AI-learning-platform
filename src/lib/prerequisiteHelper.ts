import { createClient } from "@/lib/supabase/client";

/**
 * Mark a chapter's prerequisite as completed in the database.
 * Called when a student passes the prerequisite test (score >= 70%).
 */
export async function markPrerequisiteCompleted(chapterId: string): Promise<void> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("chapters")
      .update({ prerequisite_completed: true })
      .eq("id", chapterId);

    if (error) {
      console.error("[markPrerequisiteCompleted] DB update error:", error);
    } else {
      console.log(`[markPrerequisiteCompleted] Chapter ${chapterId} prerequisite marked as completed.`);
    }
  } catch (err) {
    console.error("[markPrerequisiteCompleted] Unexpected error:", err);
  }
}
