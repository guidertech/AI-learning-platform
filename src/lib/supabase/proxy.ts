import { createServerClient } from "@supabase/ssr";
import {
  NextResponse,
  type NextRequest,
} from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/profile-setup",
  "/subjects",
  "/chapters",
  "/learning",
  "/quiz",
  "/recovery",
  "/mastery-check",
  "/homework",
  "/progress",
  "/settings",
];

export async function updateSession(
  request: NextRequest,
  response?: NextResponse
) {
  /*
   * Default response:
   * Use an existing response if provided, otherwise continue the request.
   */
  let supabaseResponse = response || NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env
      .NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /*
         * Browser se aayi current cookies
         * Supabase ko provide karta hai.
         */
        getAll() {
          return request.cookies.getAll();
        },

        /*
         * Token refresh hone par updated cookies
         * request aur response dono mein set karta hai.
         */
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(
            ({ name, value }) => {
              request.cookies.set(name, value);
            }
          );

          supabaseResponse = response || NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({ name, value, options }) => {
              supabaseResponse.cookies.set(
                name,
                value,
                options
              );
            }
          );

          Object.entries(headers).forEach(
            ([key, value]) => {
              supabaseResponse.headers.set(
                key,
                value
              );
            }
          );
        },
      },
    }
  );

  /*
   * createServerClient aur getClaims ke beech
   * unrelated authentication logic mat likhein.
   */
  const { data: claimsData } =
    await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;
  const pathname = request.nextUrl.pathname;

  const isProtectedRoute =
    protectedRoutes.some(
      (route) =>
        pathname === route || pathname.startsWith(`${route}/`)
    );

  /*
   * Protected page + no valid authenticated user
   * = login page par redirect.
   */
  if (isProtectedRoute && !userId) {
    const loginUrl = request.nextUrl.clone();

    loginUrl.pathname = "/login";
    loginUrl.searchParams.set(
      "next",
      pathname
    );

    const redirectResponse =
      NextResponse.redirect(loginUrl);

    /*
     * Supabase ne session cookies update ki hon,
     * to unhe redirect response mein preserve karein.
     */
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(
        cookie.name,
        cookie.value,
        cookie
      );
    });

    return redirectResponse;
  }

  return supabaseResponse;
}
