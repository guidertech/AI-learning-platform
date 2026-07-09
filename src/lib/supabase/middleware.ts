import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake can cause write locks.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Guard protected routes
  const protectedRoutes = [
    "/dashboard",
    "/subjects",
    "/chapters",
    "/learning",
    "/quiz",
    "/weakness-analysis",
    "/recovery",
    "/mastery-check",
    "/homework",
    "/progress",
    "/settings",
  ];

  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    // Dev bypass in development mode to allow testing voice features without redirection loops
    if (process.env.NODE_ENV === "development") {
      console.log("[Dev Middleware] Bypassing auth check in dev mode to support local mic API.");
      return supabaseResponse;
    }
    // Redirect to login if unauthenticated
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If user is logged in, restrict /login or /profile-setup if profile exists
  if (user && pathname === "/login") {
    // If authenticated, check if student profile exists
    const { data: profile } = await supabase
      .from("student_profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    const url = request.nextUrl.clone();
    if (profile) {
      url.pathname = "/dashboard";
    } else {
      url.pathname = "/profile-setup";
    }
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
