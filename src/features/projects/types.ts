export interface ProjectEntry {
  id: string;
  name: string;
  role: string;
  website: string;
  technologies: string[];
  description: string;
}

// Alias for backwards compatibility
export type ProjectItem = ProjectEntry;
export type Projects = ProjectEntry[];

export const createEmptyProject = (): ProjectEntry => ({
  id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
  name: "",
  role: "",
  website: "",
  technologies: [],
  description: "",
});
