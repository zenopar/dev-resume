import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevResume — 1-Page A4 Developer Resume Generator",
  description:
    "Generate clean, monochrome, single-page A4 developer resumes and export selectable vector text PDFs with zero bloat.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#09090b] text-zinc-100 font-sans">
        {children}
      </body>
    </html>
  );
}

