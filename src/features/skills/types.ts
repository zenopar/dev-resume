export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}

export type SkillsData = SkillCategory[];

export const createEmptySkillCategory = (categoryName = "New Category"): SkillCategory => ({
  id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
  category: categoryName,
  skills: [],
});
