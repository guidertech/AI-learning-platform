"use client";

import React from "react";

interface DeviceViewerProps {
  children: React.ReactNode;
  title?: string;
  deviceType?: "MOBILE" | "DESKTOP";
}

export default function DeviceViewer({ children }: DeviceViewerProps) {
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-on-background flex flex-col font-sans w-full">
      {/* 
        Fully responsive layout wrapper.
        Removes the iPhone bezel simulation on desktop and lets the app flow natively 
        across mobile, tablet, and desktop viewports.
      */}
      <div className="flex-1 w-full flex flex-col relative mx-auto">
        {children}
      </div>
    </div>
  );
}
