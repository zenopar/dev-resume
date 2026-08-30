"use client";

import React, { useState } from "react";
import { useResume } from "../resume";
import { PersonalInfoForm } from "../personal-info";
import { AboutMeForm } from "../about-me";
import { ExperienceForm } from "../experience";
import { ProjectsForm } from "../projects";
import { SkillsForm } from "../skills";
import { EducationForm } from "../education";
import { CertificationsForm } from "../certifications";
import { AwardsForm } from "../awards";
import { LanguagesForm } from "../languages";
import { Button, Modal, Textarea, Icon } from "@/components/ui";

export type ResumeSectionId =
  | "personal"
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "education"
  | "certifications"
  | "awards"
  | "languages";

export const ResumeEditor: React.FC = () => {
  const {
    data,
    storage,
    setPersonalInfo,
    setAboutMe,
    setExperience,
    setProjects,
    setSkills,
    setEducation,
    setCertifications,
    setAwards,
    setLanguages,
    loadSample,
    reset,
    hydrate,
  } = useResume();

  const [activeSection, setActiveSection] = useState<ResumeSectionId>("personal");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [importError, setImportError] = useState("");
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const sections: {
    id: ResumeSectionId;
    label: string;
    icon: any;
    count?: number;
  }[] = [
    { id: "personal", label: "Personal Info", icon: "user" },
    { id: "about", label: "About Me", icon: "file-text" },
    { id: "experience", label: "Experience", icon: "briefcase", count: data.experience.length },
    { id: "projects", label: "Projects", icon: "projects", count: data.projects.length },
    { id: "skills", label: "Skills", icon: "code", count: data.skills.length },
    { id: "education", label: "Education", icon: "education", count: data.education.length },
    { id: "certifications", label: "Certifications", icon: "check", count: data.certifications.length },
    { id: "awards", label: "Awards", icon: "award", count: data.awards.length },
    { id: "languages", label: "Languages", icon: "languages", count: data.languages.length },
  ];

  const currentIndex = sections.findIndex((s) => s.id === activeSection);
  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

  const handleImportSubmit = () => {
    const parsed = storage.importJson(importJsonText);
    if (!parsed) {
      setImportError("Invalid JSON structure. Please check and try again.");
      return;
    }
    hydrate(parsed);
    setIsImportModalOpen(false);
    setImportJsonText("");
    setImportError("");
  };

  const renderActiveSectionForm = () => {
    switch (activeSection) {
      case "personal":
        return (
          <PersonalInfoForm
            data={data.personalInfo}
            onChange={setPersonalInfo}
          />
        );
      case "about":
        return <AboutMeForm data={data.aboutMe} onChange={setAboutMe} />;
      case "experience":
        return <ExperienceForm data={data.experience} onChange={setExperience} />;
      case "projects":
        return <ProjectsForm data={data.projects} onChange={setProjects} />;
      case "skills":
        return <SkillsForm data={data.skills} onChange={setSkills} />;
      case "education":
        return <EducationForm data={data.education} onChange={setEducation} />;
      case "certifications":
        return (
          <CertificationsForm
            data={data.certifications}
            onChange={setCertifications}
          />
        );
      case "awards":
        return <AwardsForm data={data.awards} onChange={setAwards} />;
      case "languages":
        return <LanguagesForm data={data.languages} onChange={setLanguages} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full space-y-2.5">
      {/* Top Controls & Clean Category Grid */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-2.5 shadow-sm space-y-2 shrink-0">
        {/* Quick Utility Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-800/80">
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadSample}
              icon={<Icon name="sparkles" size={12} />}
              className="text-xs px-2.5 py-1 h-7"
            >
              Load Demo Profile
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsResetConfirmOpen(true)}
              icon={<Icon name="trash" size={12} />}
              className="text-xs text-zinc-400 hover:text-red-400 px-2 py-1 h-7"
            >
              Clear
            </Button>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsExportModalOpen(true)}
              icon={<Icon name="download" size={12} />}
              className="text-xs px-2.5 py-1 h-7"
            >
              Export JSON
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsImportModalOpen(true)}
              icon={<Icon name="upload" size={12} />}
              className="text-xs px-2.5 py-1 h-7"
            >
              Import JSON
            </Button>
          </div>
        </div>

        {/* Clean 3-Column Category Grid (No scrolling needed, all 9 sections instantly visible) */}
        <div className="grid grid-cols-3 gap-1.5 pt-0.5 select-none">
          {sections.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-black font-bold shadow-sm ring-1 ring-white"
                    : "bg-zinc-950/70 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800"
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Icon name={item.icon} size={13} className="shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold shrink-0 ml-1 ${
                      isActive
                        ? "bg-black text-white"
                        : "bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Section Form Container (Scrollable independently) */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 min-h-0">
        <div className="animate-in fade-in duration-150">
          {renderActiveSectionForm()}
        </div>

        {/* Step Navigation Footer (Back / Next) */}
        <div className="flex items-center justify-between gap-3 pt-3 pb-2 border-t border-zinc-800">
          {prevSection ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveSection(prevSection.id)}
              icon={<Icon name="arrow-up" size={13} className="-rotate-90" />}
            >
              {prevSection.label}
            </Button>
          ) : (
            <div />
          )}

          <span className="text-xs text-zinc-500 font-mono">
            Section {currentIndex + 1} of {sections.length}
          </span>

          {nextSection ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setActiveSection(nextSection.id)}
              icon={<Icon name="arrow-down" size={13} className="-rotate-90" />}
              iconPosition="right"
            >
              {nextSection.label}
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setActiveSection("personal")}
              icon={<Icon name="arrow-up" size={13} className="rotate-180" />}
            >
              Back to Start
            </Button>
          )}
        </div>
      </div>

      {/* Export JSON Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Resume Data"
        description="Backup or transfer your developer resume in clean JSON format."
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsExportModalOpen(false)}
            >
              Close
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => storage.exportJson(data)}
              icon={<Icon name="download" size={14} />}
            >
              Download JSON File
            </Button>
          </>
        }
      >
        <div className="space-y-2">
          <Textarea
            rows={10}
            value={JSON.stringify(data, null, 2)}
            readOnly
            className="font-mono text-xs bg-zinc-950 text-zinc-300 border-zinc-800"
          />
          <p className="text-[11px] text-zinc-400">
            You can copy the raw JSON above or download it as a backup file.
          </p>
        </div>
      </Modal>

      {/* Import JSON Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => {
          setIsImportModalOpen(false);
          setImportError("");
        }}
        title="Import Resume Data"
        description="Paste previously exported resume JSON to restore your data."
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsImportModalOpen(false);
                setImportError("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleImportSubmit}
              disabled={!importJsonText.trim()}
            >
              Import Data
            </Button>
          </>
        }
      >
        <div className="space-y-2">
          <Textarea
            placeholder="Paste your resume JSON here..."
            rows={10}
            value={importJsonText}
            onChange={(e) => {
              setImportJsonText(e.target.value);
              setImportError("");
            }}
            error={importError}
            className="font-mono text-xs bg-zinc-950 text-zinc-200 border-zinc-800"
          />
        </div>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        title="Clear Resume Form"
        description="Are you sure you want to reset all fields? All inputs will be cleared."
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsResetConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => {
                reset();
                setIsResetConfirmOpen(false);
              }}
            >
              Confirm Clear
            </Button>
          </>
        }
      >
        <p className="text-xs text-zinc-400">
          This will clear all personal information, experience, projects, skills, education, awards, and languages. You can always reload the sample data or import a backup JSON later.
        </p>
      </Modal>
    </div>
  );
};
