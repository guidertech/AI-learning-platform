import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const sanitizeInt = (val: any, fallback = 0): number => {
  if (typeof val === "number" && !isNaN(val)) return Math.floor(val);
  if (typeof val === "string") {
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) return parsed;
    let hash = 0;
    for (let i = 0; i < val.length; i++) {
      hash = (hash << 5) - hash + val.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) || fallback;
  }
  return fallback;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, classId, subjectId, chapterId, topicId } = body;

    if (!userId || subjectId === undefined || topicId === undefined) {
      return NextResponse.json(
        { error: "userId, subjectId, and topicId are required" },
        { status: 400 },
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const authHeader = req.headers.get("authorization");

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {}
      }
    });

    const numericClassId = sanitizeInt(classId, 5);
    const numericSubjectId = sanitizeInt(subjectId, 1);
    const numericChapterId = sanitizeInt(chapterId, 1);
    const numericTopicId = sanitizeInt(topicId, 1);

    const values = {
      user_id: userId,
      class_id: numericClassId,
      subject_id: numericSubjectId,
      chapter_id: numericChapterId,
      topic_id: numericTopicId,
      created_at: new Date().toISOString(),
    };

    console.log("[API save-last-learning] Saving values to last_learning:", values);

    const { data: existing, error: selectError } = await supabase
      .from("last_learning")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (selectError) {
      console.warn("[API save-last-learning] Select warning:", selectError.message);
    }

    let result;
    if (existing) {
      result = await supabase
        .from("last_learning")
        .update(values)
        .eq("user_id", userId)
        .select();
    } else {
      result = await supabase
        .from("last_learning")
        .insert([values])
        .select();
    }

    if (result.error) {
      console.error("[API save-last-learning] Database error:", result.error.message);
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    console.log("[API save-last-learning] Successfully saved row:", result.data);
    return NextResponse.json({ success: true, data: result.data });
  } catch (err: unknown) {
    console.error("[API save-last-learning] Exception:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error saving last learning" },
      { status: 500 },
    );
  }
}
