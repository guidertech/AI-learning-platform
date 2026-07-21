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

    // Record topic completion in user_topic_progress table
    const basePayload = {
      user_id: userId,
      topic_id: numericTopicId,
      completed_at: new Date().toISOString()
    };

    console.log("[API save-topic-progress] Saving completion for topic:", numericTopicId);

    let {data, error} = await supabase
      .from("user_topic_progress")
      .upsert({...basePayload, completed: true}, {onConflict: "user_id,topic_id"})
      .select();

    if (error && /completed/i.test(error.message)) {
      const fallback = await supabase
        .from("user_topic_progress")
        .upsert({...basePayload, is_completed: true}, {onConflict: "user_id,topic_id"})
        .select();
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      console.error("[API save-topic-progress] Upsert error:", error.message);
      return NextResponse.json({error: error.message}, {status: 400});
    }

    return NextResponse.json({ success: true, data });
  } catch (err: unknown) {
    console.error("[API save-topic-progress] Exception:", err);
    return NextResponse.json(
      {error: err instanceof Error ? err.message : "Unknown progress save error"},
      {status: 500},
    );
  }
}
