"use client";

import React, { useState } from "react";

interface SubjectIconProps {
  icon?: string;
  className?: string;
  sizeClassName?: string;
  fallbackIcon?: string;
}

export const getDirectDriveUrl = (url?: string): string => {
  if (!url) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
    if (trimmed.includes("drive.google.com") || trimmed.includes("docs.google.com")) {
      const match = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://lh3.googleusercontent.com/d/${match[1]}`;
      }
    }
    return trimmed;
  }
  return "";
};

export default function SubjectIcon({ 
  icon, 
  className = "text-primary", 
  sizeClassName = "text-[20px]", 
  fallbackIcon = "book" 
}: SubjectIconProps) {
  const [hasError, setHasError] = useState(false);
  const directUrl = getDirectDriveUrl(icon);

  if (directUrl && !hasError) {
    const sizeMatch = sizeClassName.match(/text-\[(\d+)px\]/);
    const sizeStyle = sizeMatch ? { width: `${sizeMatch[1]}px`, height: `${sizeMatch[1]}px` } : { width: "20px", height: "20px" };

    return (
      <img 
        src={directUrl} 
        style={sizeStyle}
        className="object-contain shrink-0 select-none"
        alt="icon"
        onError={() => setHasError(true)}
      />
    );
  }

  const iconName = icon && !directUrl ? icon : fallbackIcon;
  return (
    <span className={`material-symbols-outlined select-none shrink-0 ${sizeClassName} ${className}`}>
      {iconName}
    </span>
  );
}
