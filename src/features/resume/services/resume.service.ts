import {
  isDbEnabled,
  getAllResumes,
  getActiveResume,
  getResumeById,
  createResume,
  updateResume,
  renameResume,
  setActiveResume,
  deleteResume,
  ResumeDetail,
} from "@/lib/db";
import { ResumeData, ResumeListItem } from "../types";
import { sampleResumeData } from "../sampleData";

export const resumeService = {
  isDbEnabled(): boolean {
    return isDbEnabled();
  },

  getAll(): ResumeListItem[] {
    return getAllResumes();
  },

  getById(id: string): ResumeDetail | null {
    return getResumeById(id);
  },

  getActive(): ResumeDetail | null {
    return getActiveResume();
  },

  getOrInitializeActive(): { resumes: ResumeListItem[]; activeResume: ResumeDetail | null } {
    if (!isDbEnabled()) {
      return { resumes: [], activeResume: null };
    }

    let resumes = getAllResumes();
    let activeResume = getActiveResume();

    if (resumes.length === 0 || !activeResume) {
      activeResume = createResume("Sample Developer CV", sampleResumeData);
      resumes = getAllResumes();
    }

    return { resumes, activeResume };
  },

  create(params: {
    title?: string;
    data?: ResumeData;
    cloneFromId?: string;
  }): { resume: ResumeDetail | null; resumes: ResumeListItem[] } {
    if (!isDbEnabled()) {
      return { resume: null, resumes: [] };
    }

    let resumeData = params.data;
    if (params.cloneFromId) {
      const source = getResumeById(params.cloneFromId);
      if (source) {
        resumeData = JSON.parse(JSON.stringify(source.data));
      }
    }

    const created = createResume(params.title, resumeData || sampleResumeData);
    const resumes = getAllResumes();

    return { resume: created, resumes };
  },

  update(id: string, data: ResumeData, title?: string): { success: boolean; resumes: ResumeListItem[] } {
    if (!isDbEnabled()) {
      return { success: false, resumes: [] };
    }

    const updated = updateResume(id, data, title);
    const resumes = getAllResumes();
    return { success: updated, resumes };
  },

  rename(id: string, title: string): { success: boolean; resumes: ResumeListItem[] } {
    if (!isDbEnabled()) {
      return { success: false, resumes: [] };
    }

    const renamed = renameResume(id, title);
    const resumes = getAllResumes();
    return { success: renamed, resumes };
  },

  setActive(id: string): { resume: ResumeDetail | null; resumes: ResumeListItem[] } {
    if (!isDbEnabled()) {
      return { resume: null, resumes: [] };
    }

    setActiveResume(id);
    const resume = getResumeById(id);
    const resumes = getAllResumes();
    return { resume, resumes };
  },

  delete(id: string): { resumes: ResumeListItem[]; activeResume: ResumeDetail | null } {
    if (!isDbEnabled()) {
      return { resumes: [], activeResume: null };
    }

    deleteResume(id);
    let resumes = getAllResumes();
    let activeResume = getActiveResume();

    if (resumes.length === 0 || !activeResume) {
      activeResume = createResume("Sample Developer CV", sampleResumeData);
      resumes = getAllResumes();
    }

    return { resumes, activeResume };
  },
};
