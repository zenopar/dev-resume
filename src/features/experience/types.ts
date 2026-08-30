export interface WorkExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  technologies: string[];
}

export type WorkExperience = WorkExperienceItem[];

export const createEmptyExperience = (): WorkExperienceItem => ({
  id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
  role: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
  technologies: [],
});
