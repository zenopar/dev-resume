"use client";

import React, { useState } from "react";
import { ResumeData } from "../resume/types";
import { PdfDocument } from "./PdfDocument";
import { Button, Icon } from "@/components/ui";

export interface DownloadPdfButtonProps {
  data: ResumeData;
  className?: string;
}

export const DownloadPdfButton: React.FC<DownloadPdfButtonProps> = ({
  data,
  className = "",
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadVectorPdf = async () => {
    try {
      setIsGenerating(true);
      // Dynamic import to guarantee client-side only execution
      const { pdf } = await import("@react-pdf/renderer");

      const doc = <PdfDocument data={data} />;
      const blob = await pdf(doc).toBlob();

      const firstName = data.personalInfo.firstName || "developer";
      const lastName = data.personalInfo.lastName || "resume";
      const filename = `${firstName}_${lastName}_resume.pdf`
        .toLowerCase()
        .replace(/[^a-z0-9_\-]/g, "_");

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (err) {
      console.error("Error generating vector PDF:", err);
      // Fallback to native vector print dialog if react-pdf throws in browser
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNativePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="primary"
        size="sm"
        isLoading={isGenerating}
        onClick={handleDownloadVectorPdf}
        icon={<Icon name="download" size={14} />}
        className={`bg-white text-black hover:bg-zinc-200 font-bold px-3.5 py-1.5 shadow-sm text-xs cursor-pointer ${className}`}
      >
        {isGenerating ? "Building Vector PDF..." : "Download Vector PDF"}
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleNativePrint}
        icon={<Icon name="printer" size={14} />}
        title="Print or Save as Vector PDF via browser dialog"
        className="hidden sm:inline-flex text-xs text-zinc-300 hover:text-white border-zinc-700 bg-zinc-900"
      >
        Print
      </Button>
    </div>
  );
};
