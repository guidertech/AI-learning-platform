"use client";

import { useState } from "react";
import DeviceViewer from "@/components/DeviceViewer";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

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
      <main className="relative h-full min-h-screen w-full flex flex-col items-center justify-between premium-gradient px-margin-page py-[60px] overflow-hidden">
        {/* Logo Section */}
        <div className="flex-grow flex flex-col items-center justify-center z-10">
          <div className="logo-float mb-gutter-stack flex flex-col items-center">
            <div className="w-20 h-20 rounded-[28px] bg-primary flex items-center justify-center ambient-bloom mb-4 shadow-[0_12px_24px_rgba(83,65,205,0.25)]">
              <span
                className="material-symbols-outlined text-white text-[40px]"
                style={{
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                auto_awesome
              </span>
            </div>

            <h1 className="font-display text-[28px] font-bold text-primary tracking-tight">
              ClassOrbit
            </h1>

            <p className="font-label-md text-xs text-on-surface-variant font-medium mt-2">
              Luminous Intelligence
            </p>
          </div>
        </div>

        {/* Login Section */}
        <div className="w-full max-w-sm z-10 flex flex-col gap-4 fade-in-up mb-4 select-none animate-fade-in">
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

          <p className="text-center text-[9px] text-on-surface-variant/60 px-4 leading-relaxed">
            By continuing, you agree to
            ClassOrbit&apos;s Terms of Service and
            Privacy Policy.
          </p>
        </div>
      </main>
    </DeviceViewer>
  );
}