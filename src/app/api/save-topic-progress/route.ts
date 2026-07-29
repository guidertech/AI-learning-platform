import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { userId, topicId } = await req.json();

    if (!userId || !topicId) {
      return NextResponse.json({ error: "userId and topicId are required" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const authHeader = req.headers.get("authorization");

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {}
      }
    });

    const numericTopicId = parseInt(String(topicId), 10);
    if (isNaN(numericTopicId)) {
      return NextResponse.json({ error: "Invalid topicId integer" }, { status: 400 });
    }

    console.log("[API save-topic-progress] Saving completion for user:", userId, "topic:", numericTopicId);

    // 1. Check if a progress record already exists for this user and topic
    const { data: existing } = await supabase
      .from("user_topic_progress")
      .select("id")
      .eq("user_id", userId)
      .eq("topic_id", numericTopicId)
      .maybeSingle();

    let data: any = null;
    let error: any = null;
    const timestamp = new Date().toISOString();

    if (existing) {
      // Update existing record with matching schema column: completed
      const updateRes = await supabase
        .from("user_topic_progress")
        .update({
          completed: true,
          completed_at: timestamp
        })
        .eq("id", existing.id)
        .select();

      data = updateRes.data;
      error = updateRes.error;
    } else {
      // Insert new record matching exact table schema (user_id, topic_id, completed, completed_at)
      const insertRes = await supabase
        .from("user_topic_progress")
        .insert({
          user_id: userId,
          topic_id: numericTopicId,
          completed: true,
          completed_at: timestamp
        })
        .select();

      data = insertRes.data;
      error = insertRes.error;
    }

    if (error) {
      console.error("[API save-topic-progress] DB Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    console.error("[API save-topic-progress] Exception:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown progress save error" },
      { status: 500 },
    );
  }
}
