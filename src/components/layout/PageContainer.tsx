"use client";

import React from "react";
import AppSidebar from "./AppSidebar";
import BottomNav from "./BottomNav";

interface PageContainerProps {
  children: React.ReactNode;
  showNavbars?: boolean;
}

export default function PageContainer({ children, showNavbars = true }: PageContainerProps) {
  if (!showNavbars) {
    return (
      <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans w-full">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col md:flex-row font-sans w-full">
      {/* Desktop Navigation Sidebar */}
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      {/* Main Content Area — outer clips horizontal overflow, inner scrolls vertically */}
      <div className="grow flex flex-col min-w-0 overflow-x-hidden">
        <div className="flex-1 flex flex-col w-full md:h-screen md:overflow-y-auto">
          <div className="flex-1 w-full pb-20 md:pb-0">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bottom Bar */}
      <div className="block md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
