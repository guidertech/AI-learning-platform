import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code =
    requestUrl.searchParams.get("code");

  // Use forwarded host/protocol to prevent 0.0.0.0 redirect issues
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const origin = host ? `${protocol}://${host}` : requestUrl.origin;

  // OAuth callback mein code na mile to login par wapas bhejein.
  if (!code) {
    return NextResponse.redirect(
      new URL(
        "/login?error=missing_oauth_code",
        origin
      )
    );
  }

  const supabase = await createClient();

  // Temporary OAuth code ko authenticated session mein badlein.
  const {
    data: authData,
    error: exchangeError,
  } =
    await supabase.auth.exchangeCodeForSession(
      code
    );

  if (exchangeError || !authData.user) {
    console.error(
      "OAuth code exchange failed:",
      exchangeError
    );

    return NextResponse.redirect(
      new URL(
        "/login?error=oauth_exchange_failed",
        origin
      )
    );
  }

  const userId = authData.user.id;

  // Check karein ki authenticated user ki profile bani hai ya nahi.
  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    console.error(
      "Profile check failed:",
      profileError
    );

    return NextResponse.redirect(
      new URL(
        "/login?error=profile_check_failed",
        origin
      )
    );
  }

  // Existing student
  if (profile) {
    return NextResponse.redirect(new URL("/dashboard", origin));
  }

  // New student
  return NextResponse.redirect(new URL("/profile-setup", origin));
}
