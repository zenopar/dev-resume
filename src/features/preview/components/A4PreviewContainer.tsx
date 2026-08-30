"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { ResumeData } from "../../resume/types";
import { ModernMonoTemplate } from "../templates/ModernMonoTemplate";
import { CompactSplitTemplate } from "../templates/CompactSplitTemplate";
import { TechnicalMinimalTemplate } from "../templates/TechnicalMinimalTemplate";
import { Button, Icon } from "@/components/ui";

export interface A4PreviewContainerProps {
  data: ResumeData;
  onPageBudgetChange?: (fillPercentage: number, isOverflowing: boolean) => void;
}

export const A4PreviewContainer: React.FC<A4PreviewContainerProps> = ({
  data,
  onPageBudgetChange,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onPageBudgetChangeRef = useRef(onPageBudgetChange);
  onPageBudgetChangeRef.current = onPageBudgetChange;

  const lastMeasuredPercentage = useRef<number>(-1);
  const lastMeasuredOverflow = useRef<boolean | null>(null);

  // Exact A4 dimensions in pixels at 96 DPI (210mm x 297mm)
  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;
  const PADDING_PX = 36; // ~9.5mm margins on all sides

  const [zoom, setZoom] = useState<number>(0.68);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);

  // Auto-calculate zoom to fit the entire A4 page on screen without scrolling
  const autoFitPage = useCallback(() => {
    if (!containerRef.current) return;
    const availableHeight = containerRef.current.clientHeight - 36;
    const availableWidth = containerRef.current.clientWidth - 36;
    if (availableHeight <= 0 || availableWidth <= 0) return;

    const scaleY = availableHeight / A4_HEIGHT_PX;
    const scaleX = availableWidth / A4_WIDTH_PX;
    const optimalScale = Math.min(scaleY, scaleX, 1.0);
    setZoom(Math.max(optimalScale, 0.4));
  }, [A4_HEIGHT_PX, A4_WIDTH_PX]);

  const handleFitWidth = () => {
    if (!containerRef.current) return;
    const availableWidth = containerRef.current.clientWidth - 40;
    const calculated = availableWidth / A4_WIDTH_PX;
    setZoom(Math.min(Math.max(calculated, 0.45), 1.25));
  };

  useEffect(() => {
    autoFitPage();
    window.addEventListener("resize", autoFitPage);
    return () => window.removeEventListener("resize", autoFitPage);
  }, [autoFitPage]);

  // Safely measure content height asynchronously using requestAnimationFrame
  useEffect(() => {
    let animId: number;

    const measureHeight = () => {
      if (!contentRef.current) return;
      const scrollHeight = contentRef.current.scrollHeight;
      const maxHeight = A4_HEIGHT_PX - PADDING_PX * 2;
      const percentage = Math.min(Math.round((scrollHeight / maxHeight) * 100), 200);
      const overflowing = scrollHeight > maxHeight + 6;

      // Only trigger updates if values have genuinely changed
      if (
        lastMeasuredPercentage.current !== percentage ||
        lastMeasuredOverflow.current !== overflowing
      ) {
        lastMeasuredPercentage.current = percentage;
        lastMeasuredOverflow.current = overflowing;

        setIsOverflowing(overflowing);

        if (onPageBudgetChangeRef.current) {
          onPageBudgetChangeRef.current(percentage, overflowing);
        }
      }
    };

    // Defer measurement to next frame to prevent React render-depth loops
    animId = requestAnimationFrame(measureHeight);
    return () => cancelAnimationFrame(animId);
  }, [
    data.personalInfo,
    data.aboutMe,
    data.experience,
    data.projects,
    data.skills,
    data.education,
    data.certifications,
    data.awards,
    data.languages,
    data.settings.template,
    data.settings.fontSizeMultiplier,
    data.settings.spacingMultiplier,
    data.settings.showIcons,
    data.settings.language,
  ]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.08, 1.4));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.08, 0.4));
  const handleResetZoom = () => autoFitPage();

  const renderTemplate = () => {
    switch (data.settings.template) {
      case "split":
        return <CompactSplitTemplate data={data} />;
      case "technical":
        return <TechnicalMinimalTemplate data={data} />;
      case "modern":
      default:
        return <ModernMonoTemplate data={data} />;
    }
  };

  return (
    <div className="flex flex-col h-full select-none overflow-hidden print:overflow-visible print:h-auto print:block" ref={containerRef}>
      {/* Zoom & Canvas Toolbar (Hidden on Print) */}
      <div className="flex items-center justify-between pb-1.5 px-1 text-xs text-zinc-400 shrink-0 no-print">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-zinc-300 font-bold uppercase text-[10px] bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
            A4 1-Page Vector
          </span>
          <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline-block">
            {A4_WIDTH_PX} × {A4_HEIGHT_PX}px
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            className="p-1 h-6 w-6 text-zinc-400 hover:text-white cursor-pointer"
            aria-label="Zoom out"
          >
            <Icon name="zoom-out" size={12} />
          </Button>

          <button
            type="button"
            onClick={handleResetZoom}
            className="font-mono text-zinc-300 hover:text-white px-1.5 py-0.5 rounded text-[11px] font-semibold cursor-pointer"
            title="Click to reset auto-fit"
          >
            {Math.round(zoom * 100)}%
          </button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            className="p-1 h-6 w-6 text-zinc-400 hover:text-white cursor-pointer"
            aria-label="Zoom in"
          >
            <Icon name="zoom-in" size={12} />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={autoFitPage}
            className="text-[10px] px-2 py-0.5 h-6 text-zinc-300 ml-1 cursor-pointer"
          >
            Fit Page
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleFitWidth}
            className="text-[10px] px-2 py-0.5 h-6 text-zinc-400 hover:text-white cursor-pointer"
          >
            Fit Width
          </Button>
        </div>
      </div>

      {/* Canvas Viewport (Auto-fit so entire A4 sheet is visible) */}
      <div
        id="preview-viewport-wrapper"
        className="flex-1 overflow-auto bg-black/90 rounded-lg p-2.5 flex justify-center items-center shadow-inner border border-zinc-800 relative print:p-0 print:m-0 print:border-none print:bg-white print:shadow-none print:block"
      >
        <div
          id="preview-scale-wrapper"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
            transition: "transform 0.15s ease-out",
          }}
          className="shrink-0 my-auto print:transform-none print:m-0 print:p-0 print:block"
        >
          {/* Exact A4 Sheet */}
          <div
            id="resume-a4-sheet"
            className="bg-white text-black shadow-2xl relative transition-all"
            style={{
              width: `${A4_WIDTH_PX}px`,
              height: `${A4_HEIGHT_PX}px`,
              padding: `${PADDING_PX}px`,
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            {/* The Resume Content Container */}
            <div ref={contentRef} className="w-full h-full bg-white text-black">
              {renderTemplate()}
            </div>

            {/* Over-1-Page Boundary Indicator (Visual Alert - Hidden on Print) */}
            {isOverflowing && (
              <div className="absolute bottom-0 inset-x-0 bg-red-600/95 text-white text-center py-1.5 font-mono text-[10px] font-bold tracking-wider uppercase z-20 flex items-center justify-center gap-1.5 shadow-lg no-print">
                <Icon name="alert" size={12} />
                <span>Exceeds 1 A4 Page — Reduce font scale or item spacing in Density controls</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
