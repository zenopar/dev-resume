"use client";

import React, { useState, useCallback } from "react";
import { ResumeProvider, useResume, CvSwitcher } from "@/features/resume";
import { ResumeEditor } from "@/features/editor";
import {
  A4PreviewContainer,
  PageBudgetMeter,
  DensityControls,
} from "@/features/preview";
import { DownloadPdfButton } from "@/features/pdf";
import { Icon } from "@/components/ui";

function ResumeAppContent() {
  const { data, storage, setSettings } = useResume();
  const [pageBudget, setPageBudget] = useState<{
    fillPercentage: number;
    isOverflowing: boolean;
  }>({
    fillPercentage: 90,
    isOverflowing: false,
  });

  const [activeViewMode, setActiveViewMode] = useState<"both" | "editor" | "preview">("both");

  const handlePageBudgetChange = useCallback((fillPercentage: number, isOverflowing: boolean) => {
    setPageBudget((prev) => {
      if (prev.fillPercentage === fillPercentage && prev.isOverflowing === isOverflowing) {
        return prev;
      }
      return { fillPercentage, isOverflowing };
    });
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#09090b] text-zinc-100 selection:bg-zinc-800 print:bg-white print:h-auto print:w-auto print:overflow-visible">
      {/* Top Navbar (Hidden on Print) */}
      <header
        id="top-navbar"
        className="h-13 shrink-0 bg-black text-white border-b border-zinc-800 shadow-md px-4 flex items-center justify-between gap-3 z-30 no-print"
      >
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-white text-black font-mono font-bold flex items-center justify-center text-xs tracking-tighter shadow-xs">
              CV
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5 leading-none">
                <span>DevResume</span>
                <span className="font-mono text-[9px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700 font-normal">
                  1-PAGE A4
                </span>
              </h1>
            </div>
          </div>

          {/* CV Switcher (supports multiple CVs in both DB and LocalStorage modes) */}
          <div className="pl-2 border-l border-zinc-800">
            <CvSwitcher />
          </div>


          {/* Storage status */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-400 pl-3 border-l border-zinc-800">
            {storage.saveStatus === "saving" ? (
              <span className="flex items-center gap-1 text-zinc-400 font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                {storage.isDbMode ? "Saving to DB..." : "Saving..."}
              </span>
            ) : storage.saveStatus === "error" ? (
              <span className="flex items-center gap-1 text-red-400 font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                {storage.isDbMode ? "DB Sync Error" : "Save Error"}
              </span>
            ) : storage.isDbMode ? (
              <span className="flex items-center gap-1 text-zinc-400 font-mono text-[11px]" title="Saved in local SQLite database (data/resumes.db)">
                <Icon name="database" size={11} className="text-indigo-400" />
                <span>Saved to DB</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-zinc-400 font-mono text-[11px]" title="Saved in browser localStorage">
                <Icon name="check" size={11} className="text-emerald-400" />
                <span>Saved locally</span>
              </span>
            )}
          </div>
        </div>


        {/* Center: Live Page Budget */}
        <div className="hidden md:block">
          <PageBudgetMeter
            fillPercentage={pageBudget.fillPercentage}
            isOverflowing={pageBudget.isOverflowing}
          />
        </div>

        {/* Right: Export / Download Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile responsive view switcher */}
          <div className="flex lg:hidden bg-zinc-850 p-0.5 rounded-md border border-zinc-700">
            <button
              type="button"
              onClick={() => setActiveViewMode("editor")}
              className={`px-2 py-0.8 text-xs font-medium rounded ${
                activeViewMode === "editor"
                  ? "bg-white text-black font-bold shadow-xs"
                  : "text-zinc-300"
              }`}
            >
              Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveViewMode("preview")}
              className={`px-2 py-0.8 text-xs font-medium rounded ${
                activeViewMode === "preview"
                  ? "bg-white text-black font-bold shadow-xs"
                  : "text-zinc-300"
              }`}
            >
              Preview
            </button>
          </div>

          <DownloadPdfButton data={data} />
        </div>
      </header>

      {/* Main Studio Viewport (Fixed Split Screen) */}
      <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5 p-2.5 max-w-[1900px] w-full mx-auto overflow-hidden print:p-0 print:m-0 print:border-none print:bg-white print:block print:w-full print:max-w-none print:h-auto print:overflow-visible">
        {/* Left Column: Form Stepper (Hidden on Print) */}
        <section
          id="editor-panel"
          className={`lg:col-span-5 h-full overflow-hidden flex flex-col bg-zinc-950/70 border border-zinc-800 rounded-lg p-2.5 shadow-inner no-print ${
            activeViewMode === "preview" ? "hidden lg:flex" : "flex"
          }`}
        >
          <ResumeEditor />
        </section>

        {/* Right Column: PDF Preview Studio Hero */}
        <section
          id="resume-preview-container"
          className={`lg:col-span-7 h-full overflow-hidden flex flex-col gap-2 print:p-0 print:m-0 print:border-none print:bg-white print:block print:w-full print:h-auto print:overflow-visible ${
            activeViewMode === "editor" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Compact 1-line density & layout toolbar (Hidden on Print) */}
          <div id="density-controls-panel" className="shrink-0 no-print">
            <DensityControls settings={data.settings} onChange={setSettings} />
          </div>

          {/* Mobile Page Budget Meter (Hidden on Print) */}
          <div className="block md:hidden shrink-0 no-print">
            <PageBudgetMeter
              fillPercentage={pageBudget.fillPercentage}
              isOverflowing={pageBudget.isOverflowing}
            />
          </div>

          {/* Full-Height Auto-Fit A4 Canvas */}
          <div className="flex-1 min-h-0 overflow-hidden print:p-0 print:m-0 print:border-none print:bg-white print:block print:w-full print:h-auto print:overflow-visible">
            <A4PreviewContainer
              data={data}
              onPageBudgetChange={handlePageBudgetChange}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <ResumeProvider>
      <ResumeAppContent />
    </ResumeProvider>
  );
}
