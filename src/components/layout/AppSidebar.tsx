"use client";

import React from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import { useLearning } from "@/context/LearningContext";

export default function AppSidebar() {
  const pathname = usePathname();
  const { studentName, studentGrade } = useLearning();

  const navItems = [
    { key: "dashboard", name: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { key: "subjects", name: "Subjects", href: "/subjects", icon: "import_contacts" },
    { key: "aiWorkspace", name: "AI Workspace", href: "/learning", icon: "psychology" },
    { key: "aiHomework", name: "AI Homework", href: "/homework", icon: "assignment" },
    { key: "progressTracker", name: "Progress Tracker", href: "/progress", icon: "trending_up" },
    { key: "report", name: "Report", href: "/reports", icon: "bar_chart" },
    { key: "settings", name: "Settings", href: "/settings", icon: "settings" }
  ];

  return (
    <aside className="w-[260px] h-screen sticky top-0 inset-inline-start-0 bg-white border-e border-outline-variant/30 flex flex-col justify-between p-6 shrink-0 z-30 shadow-[4px_0_24px_rgba(83,65,205,0.02)]">
      <div className="space-y-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_4px_12px_rgba(83,65,205,0.2)]">
            <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
          </div>
          <div>
            <h1 className="font-display font-bold text-base tracking-tight text-primary">ClassOrbit</h1>
            <p className="text-[10px] text-on-surface-variant/80 font-medium">Luminous Intelligence</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-white shadow-[0_8px_20px_-6px_rgba(83,65,205,0.4)]"
                    : "text-on-surface-variant hover:bg-primary-container/10 hover:text-primary"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className="font-label-md text-sm font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Session Info footer */}
      <div className="border-t border-outline-variant/30 pt-5 pb-1 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-fixed border border-primary/10">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuApJDxIvWyGdrw51oyBB7RoTwh3PN4ISeya5QHaa9Yx-1aMOlNdkvGjAqFuSNvVzcrmDETaKcU0E3efBD_adDGHcP4wweTOyOOk-TDNrX32UQCohTlRWen2r5dyS9VJtLI3xRL4sQ2iEmn3_ESbUbNiPch_Hmnk1WhAHwpdzHDy6sWFqUJkN8yYWARdlgMTKrWBTgjpRTZIa06b8LyV3JKfRSW5suMJzOxNvq2aGVDZdAhrela35LSOJCdVobsBjblSX8Rt8J9WujA"
            alt="Student Profile"
          />
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-sm text-on-surface truncate">{studentName}</p>
          <p className="text-xs text-on-surface-variant font-medium">{studentGrade} Student</p>
        </div>
      </div>
    </aside>
  );
}
