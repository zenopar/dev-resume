import React from "react";
import { Document } from "@react-pdf/renderer";
import { ResumeData } from "../resume/types";
import { ModernMonoPdf } from "./templates/ModernMonoPdf";
import { CompactSplitPdf } from "./templates/CompactSplitPdf";
import { TechnicalMinimalPdf } from "./templates/TechnicalMinimalPdf";

export const PdfDocument: React.FC<{ data: ResumeData }> = ({ data }) => {
  const renderTemplate = () => {
    switch (data.settings.template) {
      case "split":
        return <CompactSplitPdf data={data} />;
      case "technical":
        return <TechnicalMinimalPdf data={data} />;
      case "modern":
      default:
        return <ModernMonoPdf data={data} />;
    }
  };

  const authorName = `${data.personalInfo.firstName} ${data.personalInfo.lastName}`.trim() || "Developer Resume";

  return (
    <Document
      title={`${authorName} — Resume`}
      author={authorName}
      subject="Software Engineer Curriculum Vitae"
      keywords="developer, resume, curriculum vitae, software engineer"
    >
      {renderTemplate()}
    </Document>
  );
};
