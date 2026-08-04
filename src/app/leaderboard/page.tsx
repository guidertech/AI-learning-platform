"use client";

import React, { useState, useEffect } from "react";
import PageContainer from "@/components/layout/PageContainer";
import Topbar from "@/components/layout/Topbar";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LeaderboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [myRank, setMyRank] = useState<any>(null);
  const [filterType, setFilterType] = useState<"school" | "global">("school");

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      const supabase = createClient();
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Fetch current user profile
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (!profile) return;
        if (active) {
          setCurrentUser(profile);
        }

        // 2. Query Leaderboard API
        let url = "/api/leaderboard";
        if (filterType === "school" && profile.school) {
          url += `?school=${encodeURIComponent(profile.school)}`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (active && data.leaderboard) {
          setLeaderboard(data.leaderboard);

          // Find current user's ranking context
          const rankIndex = data.leaderboard.findIndex((u: any) => u.user_id === user.id);
          if (rankIndex !== -1) {
            setMyRank({
              rank: rankIndex + 1,
              ...data.leaderboard[rankIndex]
            });
          } else {
            // Not ranked yet (0 quiz attempts completed)
            setMyRank({
              rank: "-",
              avg_score: 0,
              tests_completed: 0,
              full_name: profile.full_name,
              school: profile.school
            });
          }
        }
      } catch (err) {
        console.error("Error fetching leaderboard data:", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      active = false;
    };
  }, [filterType]);

  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  const rank1 = topThree[0] || null;
  const rank2 = topThree[1] || null;
  const rank3 = topThree[2] || null;

  return (
    <PageContainer>
      <Topbar title="Leaderboard Rankings" subtitle="Student rankings based on Average Test Score" />

      <main className="p-4 md:p-8 max-w-[1000px] mx-auto w-full space-y-6 pb-60 md:pb-28 select-none">
        
        {/* Back button */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push("/dashboard")}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <span className="text-xs font-bold text-outline uppercase tracking-wider">Back to Dashboard</span>
        </div>

        {/* Filter Toggle Switch */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex gap-2 bg-slate-100/80 p-1 rounded-xl w-fit border border-slate-200/40">
            <button
              onClick={() => setFilterType("school")}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === "school"
                  ? "bg-primary text-white shadow-xs"
                  : "text-slate-600 hover:text-primary hover:bg-slate-50/50"
              }`}
            >
              🏫 My School
            </button>
            <button
              onClick={() => setFilterType("global")}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === "global"
                  ? "bg-primary text-white shadow-xs"
                  : "text-slate-600 hover:text-primary hover:bg-slate-50/50"
              }`}
            >
              🌎 Global Ranking
            </button>
          </div>

          {filterType === "school" && currentUser?.school && (
            <span className="text-xs text-on-surface-variant font-semibold">
              School: <strong className="text-primary font-bold">{currentUser.school}</strong>
            </span>
          )}
        </div>

        {/* School Missing Warning Card */}
        {filterType === "school" && !currentUser?.school && (
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-amber-500 text-[24px]">school</span>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-amber-900">No School Specified</p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  You haven't listed a school in your profile yet! Head to settings to add your school, or check out global rankings.
                </p>
              </div>
            </div>
            <Link 
              href="/settings"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] rounded-xl active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer shadow-xs"
            >
              Go to Settings
            </Link>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-3 items-end gap-3 max-w-xl mx-auto pt-16">
              <div className="h-28 bg-slate-100 rounded-t-3xl animate-pulse" />
              <div className="h-36 bg-slate-100 rounded-t-3xl animate-pulse" />
              <div className="h-24 bg-slate-100 rounded-t-3xl animate-pulse" />
            </div>
            <div className="space-y-3 bg-white p-6 border border-slate-100 rounded-[32px]">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-14 bg-slate-50 border border-slate-100 animate-pulse rounded-2xl" />
              ))}
            </div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="bg-slate-50/50 border border-dashed border-outline-variant/20 rounded-[32px] p-12 text-center flex flex-col items-center justify-center min-h-[300px] text-on-surface-variant space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <span className="material-symbols-outlined text-[28px]">emoji_events</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold">No Rankings Available</p>
              <p className="text-xs text-slate-400 max-w-sm">No students have completed any chapter tests in this selection yet. Be the first to start a test!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Visual Top 3 Podium */}
            <div className="grid grid-cols-3 items-end gap-2 sm:gap-3 max-w-xl mx-auto pt-8 pb-4 select-none">
              
              {/* Rank 2 (Left) */}
              <div className="flex flex-col items-center">
                {rank2 ? (
                  <>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center font-bold text-[18px] sm:text-[24px] shadow-sm relative group hover:scale-105 transition-transform shrink-0">
                      🥈
                    </div>
                    <div className="bg-white p-3 sm:p-4 rounded-t-2xl sm:rounded-t-3xl border border-outline-variant/15 border-b-0 w-full text-center h-24 sm:h-28 shadow-xs mt-2.5 sm:mt-3 flex flex-col justify-between overflow-hidden">
                      <div className="space-y-0.5">
                        <p className="text-[10px] sm:text-xs font-bold text-on-surface truncate">{rank2.full_name}</p>
                        <p className="text-[8px] sm:text-[9px] text-on-surface-variant truncate font-semibold">{rank2.school}</p>
                      </div>
                      <p className="text-[10px] sm:text-xs font-extrabold text-primary">{rank2.avg_score}% Score</p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-24 sm:h-28 border border-dashed border-outline-variant/20 rounded-t-2xl sm:rounded-t-3xl mt-3 flex items-center justify-center text-[10px] text-slate-300">
                    Empty
                  </div>
                )}
              </div>

              {/* Rank 1 (Center) */}
              <div className="flex flex-col items-center">
                {rank1 ? (
                  <>
                    <div className="w-15 h-15 sm:w-18 sm:h-18 rounded-full bg-amber-50 border-2 border-amber-400 flex items-center justify-center font-bold text-[22px] sm:text-[28px] shadow-md relative group hover:scale-105 transition-transform scale-110 shrink-0">
                      <span className="absolute -top-5 sm:-top-6 text-[18px] sm:text-[22px] animate-bounce">👑</span>
                      🥇
                    </div>
                    <div className="bg-gradient-to-t from-primary/5 to-primary/10 p-4 sm:p-5 rounded-t-2xl sm:rounded-t-3xl border border-primary/20 border-b-0 w-full text-center h-32 sm:h-36 shadow-sm mt-3 sm:mt-4 flex flex-col justify-between overflow-hidden relative scale-105">
                      <div className="space-y-0.5">
                        <p className="text-xs sm:text-sm font-black text-primary truncate">{rank1.full_name}</p>
                        <p className="text-[8px] sm:text-[9px] text-primary/80 truncate font-bold">{rank1.school}</p>
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-black text-primary leading-none">{rank1.avg_score}%</p>
                        <p className="text-[8px] sm:text-[9px] text-primary/70 font-extrabold mt-1">{rank1.tests_completed} Tests</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-32 sm:h-36 border border-dashed border-outline-variant/20 rounded-t-2xl sm:rounded-t-3xl mt-4 flex items-center justify-center text-[10px] text-slate-300">
                    Empty
                  </div>
                )}
              </div>

              {/* Rank 3 (Right) */}
              <div className="flex flex-col items-center">
                {rank3 ? (
                  <>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-50 border-2 border-orange-300 flex items-center justify-center font-bold text-[14px] sm:text-[20px] shadow-2xs relative group hover:scale-105 transition-transform shrink-0">
                      🥉
                    </div>
                    <div className="bg-white p-3 sm:p-4 rounded-t-2xl sm:rounded-t-3xl border border-outline-variant/15 border-b-0 w-full text-center h-20 sm:h-24 shadow-xs mt-2.5 sm:mt-3 flex flex-col justify-between overflow-hidden">
                      <div className="space-y-0.5">
                        <p className="text-[9px] sm:text-[11px] font-bold text-on-surface truncate">{rank3.full_name}</p>
                        <p className="text-[8px] sm:text-[9px] text-on-surface-variant truncate font-semibold">{rank3.school}</p>
                      </div>
                      <p className="text-[9px] sm:text-[11px] font-extrabold text-primary">{rank3.avg_score}% Score</p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-20 sm:h-24 border border-dashed border-outline-variant/20 rounded-t-2xl sm:rounded-t-3xl mt-3 flex items-center justify-center text-[10px] text-slate-300">
                    Empty
                  </div>
                )}
              </div>

            </div>

            {/* List of remaining ranks (Rank 4+) */}
            {remaining.length > 0 && (
              <div className="bg-white border border-outline-variant/15 rounded-[32px] p-6 shadow-xs divide-y divide-slate-100/60 max-h-[380px] overflow-y-auto pr-1.5">
                {remaining.map((user) => (
                  <div key={user.user_id} className="flex justify-between items-center py-4 first:pt-0 last:pb-0 gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-400 w-6">#{user.rank}</span>
                      <div className="space-y-0.5">
                        <span className="text-sm font-bold text-on-surface block">{user.full_name}</span>
                        <span className="text-[10px] text-on-surface-variant font-medium block">{user.school}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-primary block">{user.avg_score}% Score</span>
                      <span className="text-[9px] text-on-surface-variant font-medium block">{user.tests_completed} tests completed</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* Sticky User Profile rankings card */}
      {myRank && !loading && (
        <div className="fixed bottom-[88px] left-4 right-4 md:bottom-0 md:left-[260px] md:right-0 bg-white/95 md:bg-white md:border-t border-slate-100 p-2.5 md:p-4 shadow-[0_-8px_32px_rgba(83,65,205,0.06)] z-20 flex justify-center select-none transition-all md:rounded-none rounded-2xl border border-slate-100/60 backdrop-blur-sm">
          <div className="max-w-[1000px] w-full bg-gradient-to-r from-primary to-indigo-600 border border-primary/20 text-white rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex flex-col items-center justify-center text-white shrink-0 shadow-2xs">
                <span className="text-[10px] font-bold uppercase leading-none opacity-80">Rank</span>
                <span className="text-lg font-black leading-none mt-1">#{myRank.rank}</span>
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm text-white">You ({myRank.full_name})</h4>
                <p className="text-[10px] text-white/80 font-medium">
                  {myRank.school} | {filterType === "school" ? "School Ranking" : "Global Ranking"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right sm:text-left">
                <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider block">Average Score</span>
                <span className="text-base font-black text-white block">{myRank.avg_score}%</span>
              </div>
              <div className="h-8 w-px bg-white/20 hidden sm:block" />
              <div className="text-right sm:text-left">
                <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider block">Tests Logs</span>
                <span className="text-base font-black text-white block">{myRank.tests_completed} Chapters</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </PageContainer>
  );
}
