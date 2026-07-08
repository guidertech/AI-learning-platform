import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LearningProvider } from "@/context/LearningContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClassOrbit - Luminous Intelligence",
  description: "AI-powered student learning companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        {/* Load Google Material Symbols Outlined */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <LearningProvider>
          {children}
        </LearningProvider>
      </body>
    </html>
  );
}
