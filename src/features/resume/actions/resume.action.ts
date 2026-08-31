"use server";

import { resumeService } from "../services/resume.service";
import { ResumeData, ResumeListItem } from "../types";
import { ResumeDetail } from "@/lib/db";

export async function getStorageConfigAction(): Promise<{ useDb: boolean }> {
  return { useDb: resumeService.isDbEnabled() };
}

export async function getCvsAction(): Promise<{
  resumes: ResumeListItem[];
  activeResume: ResumeDetail | null;
}> {
  return resumeService.getOrInitializeActive();
}

export async function createCvAction(params: {
  title?: string;
  data?: ResumeData;
  cloneFromId?: string;
}): Promise<{
  success: boolean;
  resume: ResumeDetail | null;
  resumes: ResumeListItem[];
}> {
  const result = resumeService.create(params);
  return {
    success: Boolean(result.resume),
    resume: result.resume,
    resumes: result.resumes,
  };
}

export async function updateCvAction(
  id: string,
  data: ResumeData,
  title?: string
): Promise<{ success: boolean; resumes: ResumeListItem[] }> {
  return resumeService.update(id, data, title);
}

export async function renameCvAction(
  id: string,
  title: string
): Promise<{ success: boolean; resumes: ResumeListItem[] }> {
  return resumeService.rename(id, title);
}

export async function setActiveCvAction(
  id: string
): Promise<{
  success: boolean;
  resume: ResumeDetail | null;
  resumes: ResumeListItem[];
}> {
  const result = resumeService.setActive(id);
  return {
    success: Boolean(result.resume),
    resume: result.resume,
    resumes: result.resumes,
  };
}

export async function deleteCvAction(
  id: string
): Promise<{
  success: boolean;
  resumes: ResumeListItem[];
  activeResume: ResumeDetail | null;
}> {
  const result = resumeService.delete(id);
  return {
    success: true,
    resumes: result.resumes,
    activeResume: result.activeResume,
  };
}
