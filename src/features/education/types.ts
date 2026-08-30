export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  details: string;
}

export type Education = EducationItem[];

export const createEmptyEducation = (): EducationItem => ({
  id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
  school: "",
  degree: "",
  startDate: "",
  endDate: "",
  details: "",
});
