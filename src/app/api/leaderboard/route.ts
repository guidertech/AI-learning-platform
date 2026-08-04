import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const school = searchParams.get("school");
    const classId = searchParams.get("classId");

    const supabase = await createClient();

    // Query users along with their quiz attempts
    let query = supabase
      .from("users")
      .select("id, full_name, school, class_id, quiz_attempts(obtain_marks, total_marks)");

    if (school) {
      // Perform case-insensitive school match
      query = query.ilike("school", school);
    }

    if (classId) {
      query = query.eq("class_id", parseInt(classId, 10));
    }

    const { data: users, error } = await query;

    if (error) {
      console.error("[Leaderboard API] Error fetching users:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!users) {
      return NextResponse.json({ leaderboard: [] });
    }

    // Process and aggregate scores
    const leaderboard = users.map((user: any) => {
      const attempts = user.quiz_attempts || [];
      let totalObtained = 0;
      let totalMax = 0;

      attempts.forEach((a: any) => {
        totalObtained += a.obtain_marks || 0;
        totalMax += a.total_marks || 0;
      });

      const avgScore = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;

      return {
        user_id: user.id,
        full_name: user.full_name || "Unknown Student",
        school: user.school || "No School Listed",
        class_id: user.class_id,
        tests_completed: attempts.length,
        avg_score: avgScore
      };
    });

    // Sort: highest avg_score first. If tied, who completed more tests wins.
    leaderboard.sort((a, b) => {
      if (b.avg_score !== a.avg_score) {
        return b.avg_score - a.avg_score;
      }
      return b.tests_completed - a.tests_completed;
    });

    // Assign rank order
    const rankedLeaderboard = leaderboard.map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    return NextResponse.json({ leaderboard: rankedLeaderboard });
  } catch (err: any) {
    console.error("[Leaderboard API] Unexpected error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
