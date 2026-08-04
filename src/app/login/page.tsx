"use client";

import { useState, useEffect } from "react";
import DeviceViewer from "@/components/DeviceViewer";
import { createClient } from "@/lib/supabase/client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// You can update this URL to your final published Lottie animation (.lottie or .json)
const LOTTIE_URL = "https://lottie.host/bd037016-fddc-44bc-b3fb-357765dd9863/XghfAJhzCW.lottie";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);
  const [isLottieValid, setIsLottieValid] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyLottie = async () => {
      try {
        const res = await fetch(LOTTIE_URL);
        if (res.ok) {
          setIsLottieValid(true);
        } else {
          setIsLottieValid(false);
        }
      } catch (e) {
        setIsLottieValid(false);
      }
    };
    verifyLottie();
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const supabase = createClient();

      const callbackUrl =
        `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

      const { error } =
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: callbackUrl,
          },
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(
        "Google login error:",
        error
      );

      setLoading(false);
    }
  };

  return (
    <DeviceViewer
      title="ClassOrbit Onboarding"
      deviceType="MOBILE"
    >
      <main className="relative min-h-screen w-full flex flex-col md:flex-row premium-gradient overflow-hidden">
        {/* Left Side: Animation (Desktop only) */}
        <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-8 z-10">
          {isLottieValid === true ? (
            <div className="w-full max-w-[500px] aspect-square flex items-center justify-center logo-float overflow-visible">
              <DotLottieReact
                src={LOTTIE_URL}
                autoplay
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          ) : isLottieValid === false ? (
            <div className="w-56 h-56 rounded-full bg-primary/5 flex items-center justify-center ambient-bloom shadow-[0_12px_24px_rgba(83,65,205,0.1)] border border-primary/10 logo-float animate-pulse">
              <span className="material-symbols-outlined text-primary text-[80px]">
                menu_book
              </span>
            </div>
          ) : (
            <div className="w-64 h-64 rounded-full bg-surface-container-low/50 animate-pulse flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-surface-container/50" />
            </div>
          )}
        </div>

        {/* Right Side: Centered Glass Card (Full screen on mobile, Right half on desktop) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-margin-page py-12 md:p-16 z-10 min-h-screen md:min-h-0 md:h-screen">
          
          {/* Animation (Mobile only - placed above the card) */}
          <div className="w-full flex items-center justify-center md:hidden mb-6">
            {isLottieValid === true ? (
              <div className="w-48 h-48 flex items-center justify-center logo-float overflow-visible">
                <DotLottieReact
                  src={LOTTIE_URL}
                  autoplay
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            ) : isLottieValid === false ? (
              <div className="w-28 h-28 rounded-full bg-primary/5 flex items-center justify-center ambient-bloom shadow-[0_12px_24px_rgba(83,65,205,0.1)] border border-primary/10 logo-float animate-pulse">
                <span className="material-symbols-outlined text-primary text-[48px]">
                  menu_book
                </span>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-surface-container-low/50 animate-pulse flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-surface-container/50" />
              </div>
            )}
          </div>

          {/* Glass Card Wrapper */}
          <div className="w-full max-w-md bg-white/60 dark:bg-surface-container/30 backdrop-blur-xl border border-white/30 dark:border-outline-variant/10 rounded-[32px] p-8 md:p-10 flex flex-col items-center shadow-[0_24px_60px_rgba(83,65,205,0.08)] hover:shadow-[0_32px_80px_rgba(83,65,205,0.16)] hover:border-primary/20 hover:scale-[1.01] transition-all duration-500 ease-out animate-fade-in-up">
            
            {/* Logo Section */}
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="w-20 h-20 rounded-[26px] bg-primary flex items-center justify-center ambient-bloom mb-4 shadow-[0_12px_28px_rgba(83,65,205,0.3)]">
                <span
                  className="material-symbols-outlined text-white text-[44px]"
                  style={{
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  auto_awesome
                </span>
              </div>
              <h1 className="font-display text-[32px] font-bold text-primary tracking-tight leading-none mt-2">
                ClassOrbit
              </h1>
              <p className="font-label-md text-xs text-on-surface-variant font-medium mt-2">
                Luminous Intelligence
              </p>
            </div>

            {/* Login & Button Section */}
            <div className="w-full flex flex-col gap-4 select-none">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                aria-busy={loading}
                className="h-12 w-full bg-white rounded-full flex items-center justify-center gap-3 border border-outline-variant/30 ambient-bloom hover:bg-surface-container-low transition-all duration-300 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.05)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
              >
                <svg
                  height="18"
                  viewBox="0 0 24 24"
                  width="18"
                  aria-hidden="true"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>

                <span className="font-label-md text-xs font-bold text-on-surface">
                  {loading
                    ? "Connecting to Google..."
                    : "Continue with Google"}
                </span>
              </button>

              {errorMessage && (
                <p
                  role="alert"
                  className="text-center text-xs text-red-600"
                >
                  {errorMessage}
                </p>
              )}

              <p className="text-center text-[9px] text-on-surface-variant/60 px-4 leading-relaxed mt-2">
                By continuing, you agree to
                ClassOrbit&apos;s Terms of Service and
                Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </main>
    </DeviceViewer>
  );
}