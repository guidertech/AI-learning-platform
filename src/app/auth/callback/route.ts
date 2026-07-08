import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && authData?.user) {
      const userId = authData.user.id;
      
      // Check if student profile exists
      const { data: profile } = await supabase
        .from("student_profiles")
        .select("id")
        .eq("id", userId)
        .single();
        
      if (profile) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/profile-setup", request.url));
      }
    }
  }

  // Return the user to an error page or the login screen if code exchange fails
  return NextResponse.redirect(new URL("/login", request.url));
}
