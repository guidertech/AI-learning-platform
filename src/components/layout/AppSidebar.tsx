"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import { useLearning } from "@/context/LearningContext";

export default function AppSidebar() {
  const pathname = usePathname();
  const { 
    studentName, 
    studentGrade, 
    sidebarCollapsed, 
    setSidebarCollapsed, 
    isSidebarHydrated 
  } = useLearning();

  const toggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const navItems = [
    { key: "dashboard", name: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { key: "subjects", name: "Subjects", href: "/subjects", icon: "import_contacts" },
    { key: "aiHomework", name: "AI Homework", href: "/homework", icon: "assignment" },
    { key: "practiceQuiz", name: "Practice Quiz", href: "/quiz/latest", icon: "quiz" },
    { key: "progressTracker", name: "Progress Tracker", href: "/progress", icon: "trending_up" },
    { key: "report", name: "Report", href: "/reports", icon: "bar_chart" },
    { key: "leaderboard", name: "Leaderboard", href: "/leaderboard", icon: "emoji_events" },
    { key: "settings", name: "Settings", href: "/settings", icon: "settings" }
  ];

  const activeIndex = navItems.findIndex((item) =>
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : item.key === "practiceQuiz"
      ? pathname.startsWith("/quiz")
      : pathname.startsWith(item.href)
  );

  const isCollapsed = isSidebarHydrated && sidebarCollapsed;
  const sidebarWidthClass = isCollapsed ? "w-[76px]" : "w-[260px]";
  const paddingClass = isCollapsed ? "p-4" : "p-6";

  return (
    <aside className={`${sidebarWidthClass} ${paddingClass} h-screen sticky top-0 inset-inline-start-0 bg-white border-e border-outline-variant/30 flex flex-col justify-between shrink-0 z-30 shadow-[4px_0_24px_rgba(83,65,205,0.02)] transition-all duration-300 relative`}>
      
      <div className="space-y-6">
        {/* Hamburger Menu Toggle Button */}
        <div className={`flex ${isCollapsed ? "justify-center" : "pl-0.5"} border-b border-slate-100 pb-4`}>
          <button 
            onClick={toggleCollapse}
            className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-100/60 transition-all duration-300 cursor-pointer active:scale-95 shadow-2xs"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <span className="material-symbols-outlined text-[18px] font-bold">
              {isCollapsed ? "menu" : "menu_open"}
            </span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2 relative">
          {/* Sliding background indicator */}
          {activeIndex !== -1 && (
            <div 
              className="absolute left-0 w-full bg-primary rounded-xl transition-all duration-300 ease-out shadow-[0_8px_24px_rgba(83,65,205,0.25)] z-0"
              style={{
                height: "48px",
                transform: `translateY(${activeIndex * 56}px)`,
                top: "0px"
              }}
            />
          )}

          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : item.key === "practiceQuiz"
                ? pathname.startsWith("/quiz")
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center rounded-xl transition-all duration-300 hover:-translate-y-[0.5px] relative z-10 group h-12 ${
                  isCollapsed ? "justify-center px-0 w-12 mx-auto" : "gap-4 px-4"
                } ${
                  isActive
                    ? "text-white"
                    : "text-on-surface-variant hover:bg-primary-container/10 hover:text-primary"
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <span
                  className="material-symbols-outlined transition-transform duration-300 group-hover:scale-110 shrink-0"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="font-label-md text-sm font-semibold transition-all duration-300 group-hover:translate-x-1 whitespace-nowrap overflow-hidden">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Session Info footer */}
      <div className={`border-t border-outline-variant/30 pt-5 pb-1 flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
          {studentName ? studentName.charAt(0).toUpperCase() : <span className="material-symbols-outlined text-[20px]">person</span>}
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden transition-all duration-300 ease-in-out opacity-100 whitespace-nowrap">
            <p className="font-bold text-sm text-on-surface truncate">{studentName || "Student"}</p>
            <p className="text-xs text-on-surface-variant font-medium">{studentGrade || "Grade 5"} Student</p>
          </div>
        )}
      </div>
    </aside>
  );
}
