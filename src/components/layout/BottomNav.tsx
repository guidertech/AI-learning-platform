"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/dashboard", icon: "home" },
    { name: "Learn", href: "/subjects", icon: "school" },
    { name: "AI Tutor", href: "/learning/fractions", icon: "psychology" },
    { name: "Profile", href: "/settings", icon: "person" }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-40 bg-white/90 backdrop-blur-md border-t border-outline-variant/15 flex justify-around items-center h-18 pb-safe-area-bottom pt-5 shadow-[0_-8px_20px_rgba(83,65,205,0.02)]">
      {navItems.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 h-full select-none ${isActive
              ? "text-primary font-bold"
              : "text-on-surface-variant hover:text-primary transition-colors"
              }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-semibold mt-0.5 tracking-wide">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
