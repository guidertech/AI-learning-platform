"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/dashboard", icon: "home" },
    { name: "Subjects", href: "/subjects", icon: "school" },
    { name: "Leaderboard", href: "/leaderboard", icon: "emoji_events" },
    { name: "Profile", href: "/settings", icon: "person" }
  ];

  return (
    <nav className="fixed bottom-5 left-4 right-4 z-40 bg-white/60 dark:bg-surface-container/40 backdrop-blur-xl border border-white/40 dark:border-outline-variant/10 rounded-2xl flex justify-around items-center h-16 px-2 shadow-[0_12px_32px_rgba(83,65,205,0.12)] select-none">
      {navItems.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 h-12 rounded-xl transition-all duration-300 relative group ${
              isActive
                ? "text-primary font-bold scale-[1.02]"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {isActive && (
              <span className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/10 z-0" />
            )}
            <div className="flex flex-col items-center justify-center z-10 group-hover:scale-105 transition-transform duration-300">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="text-[9px] font-bold mt-0.5 tracking-wide">{item.name}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
