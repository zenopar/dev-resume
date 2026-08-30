export interface LanguageItem {
  id: string;
  name: string;
  proficiency: string;
}

export type Languages = LanguageItem[];

export const PROFICIENCY_OPTIONS = [
  { value: "Native", label: "Native" },
  { value: "C2", label: "C2" },
  { value: "C1", label: "C1" },
  { value: "B2", label: "B2" },
  { value: "B1", label: "B1" },
  { value: "A2", label: "A2" },
  { value: "A1", label: "A1" },
];

export const createEmptyLanguage = (): LanguageItem => ({
  id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
  name: "",
  proficiency: "B2",
});
