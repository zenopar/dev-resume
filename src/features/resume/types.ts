import { PersonalInfo } from "../personal-info/types";
import { AboutMe } from "../about-me/types";
import { WorkExperience } from "../experience/types";
import { Projects } from "../projects/types";
import { SkillsData } from "../skills/types";
import { Education } from "../education/types";
import { Certifications } from "../certifications/types";
import { Awards } from "../awards/types";
import { Languages } from "../languages/types";
import { ResumeLanguage } from "./translations";

export type ResumeTemplate = "modern" | "split" | "technical";
export type LayoutDensity = "compact" | "normal" | "spacious";
export type { ResumeLanguage };

export interface ResumeSettings {
  template: ResumeTemplate;
  density: LayoutDensity;
  fontSizeMultiplier: number; // 0.85 to 1.15
  spacingMultiplier: number;  // 0.8 to 1.2
  showIcons: boolean;
  language: ResumeLanguage;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  aboutMe: AboutMe;
  experience: WorkExperience;
  projects: Projects;
  skills: SkillsData;
  education: Education;
  certifications: Certifications;
  awards: Awards;
  languages: Languages;
  settings: ResumeSettings;
  lastModified: number;
}

export interface ResumeListItem {
  id: string;
  title: string;
  created_at: number;
  updated_at: number;
  is_active: boolean;
}


export const initialResumeSettings: ResumeSettings = {
  template: "modern",
  density: "normal",
  fontSizeMultiplier: 1.05,
  spacingMultiplier: 1.0,
  showIcons: true,
  language: "en",
};

export const initialResumeData: ResumeData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    title: "",
    email: "",
    phone: "",
    city: "",
    github: "",
    linkedin: "",
    website: "",
  },
  aboutMe: {
    summary: "",
  },
  experience: [],
  projects: [],
  skills: [],
  education: [],
  certifications: [],
  awards: [],
  languages: [],
  settings: initialResumeSettings,
  lastModified: Date.now(),
};
