export type ResumeLanguage = "en" | "cs";

export interface ResumeSectionLabels {
  aboutMe: string;
  profile: string;
  summary: string;
  experience: string;
  projects: string;
  featuredProjects: string;
  skills: string;
  education: string;
  certifications: string;
  awards: string;
  languages: string;
  contact: string;
  technologies: string;
  stack: string;
  keywords: string;
  present: string;
}

export const resumeLabels: Record<ResumeLanguage, ResumeSectionLabels> = {
  en: {
    aboutMe: "About Me",
    profile: "Profile",
    summary: "Summary",
    experience: "Work Experience",
    projects: "Projects",
    featuredProjects: "Projects",
    skills: "Technical Skills",
    education: "Education",
    certifications: "Certifications",
    awards: "Honors & Awards",
    languages: "Languages",
    contact: "Contact",
    technologies: "Technologies:",
    stack: "Stack:",
    keywords: "Keywords:",
    present: "Present",
  },
  cs: {
    aboutMe: "O mně",
    profile: "Profil",
    summary: "Souhrn",
    experience: "Pracovní zkušenosti",
    projects: "Projekty",
    featuredProjects: "Projekty",
    skills: "Technické dovednosti",
    education: "Vzdělání",
    certifications: "Certifikace",
    awards: "Ocenění a úspěchy",
    languages: "Jazyky",
    contact: "Kontakt",
    technologies: "Technologie:",
    stack: "Technologie:",
    keywords: "Klíčová slova:",
    present: "Současnost",
  },
};

export const getResumeLabels = (lang: ResumeLanguage = "en"): ResumeSectionLabels => {
  return resumeLabels[lang] || resumeLabels.en;
};
