import type {Metadata} from "next";
import "./globals.css";
import {LearningProvider} from "@/context/LearningContext";
import {LanguageProvider} from "@/context/LanguageContext";
import BrowserPageTranslator from "@/components/translation/BrowserPageTranslator";

export const metadata: Metadata = {
  title: "ClassOrbit - Luminous Intelligence",
  description: "AI-powered student learning companion",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" dir="ltr" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-slate-950 text-white">
        <LanguageProvider>
          <BrowserPageTranslator />
          <LearningProvider>{children}</LearningProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
