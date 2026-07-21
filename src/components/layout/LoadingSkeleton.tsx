"use client";

import React from "react";

interface LoadingSkeletonProps {
  type?: "dashboard" | "subjects" | "workspace" | "chapters";
}

export default function LoadingSkeleton({ type = "dashboard" }: LoadingSkeletonProps) {
  if (type === "workspace") {
    return (
      <div className="w-full space-y-6 animate-pulse p-6">
        <div className="h-10 bg-slate-200 rounded-xl w-1/3"></div>
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-200"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-3 bg-slate-200 rounded w-5/6"></div>
          </div>
        </div>
        <div className="h-48 bg-slate-200 rounded-2xl w-full"></div>
        <div className="h-28 bg-slate-200 rounded-2xl w-full"></div>
      </div>
    );
  }

  if (type === "subjects") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse p-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 bg-slate-200 rounded-[28px]"></div>
        ))}
      </div>
    );
  }

  if (type === "chapters") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse w-full p-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 bg-slate-200 rounded-[28px]"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-pulse p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-24 bg-slate-200 rounded-2xl"></div>
        <div className="h-24 bg-slate-200 rounded-2xl"></div>
        <div className="h-24 bg-slate-200 rounded-2xl"></div>
      </div>
      <div className="h-40 bg-slate-200 rounded-3xl"></div>
      <div className="h-48 bg-slate-200 rounded-3xl"></div>
    </div>
  );
}
