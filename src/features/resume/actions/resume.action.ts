"use server";

import { cookies } from "next/headers";
import { resumeService } from "../services/resume.service";
import { ResumeData, ResumeListItem } from "../types";
import { ResumeDetail } from "@/lib/db";
import { authService } from "@/features/auth/services/auth.service";

function ensureDbEnabled() {
  if (!resumeService.isDbEnabled()) {
    throw new Error("Database storage is disabled (USE_DB=false).");
  }
}

async function ensureAuthorized() {
  if (authService.isAuthRequired()) {
    const cookieStore = await cookies();
    const token = cookieStore.get("cv_auth_session")?.value;
    if (!authService.verifySessionToken(token)) {
      throw new Error("Unauthorized: Studio password authentication required.");
    }
  }
}

export async function getStorageConfigAction(): Promise<{ useDb: boolean }> {
  await ensureAuthorized();
  return { useDb: resumeService.isDbEnabled() };
}

export async function getCvsAction(): Promise<{
  resumes: ResumeListItem[];
  activeResume: ResumeDetail | null;
}> {
  await ensureAuthorized();
  ensureDbEnabled();
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
  await ensureAuthorized();
  ensureDbEnabled();
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
  await ensureAuthorized();
  ensureDbEnabled();
  return resumeService.update(id, data, title);
}

export async function renameCvAction(
  id: string,
  title: string
): Promise<{ success: boolean; resumes: ResumeListItem[] }> {
  await ensureAuthorized();
  ensureDbEnabled();
  return resumeService.rename(id, title);
}

export async function setActiveCvAction(
  id: string
): Promise<{
  success: boolean;
  resume: ResumeDetail | null;
  resumes: ResumeListItem[];
}> {
  await ensureAuthorized();
  ensureDbEnabled();
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
  await ensureAuthorized();
  ensureDbEnabled();
  const result = resumeService.delete(id);
  return {
    success: true,
    resumes: result.resumes,
    activeResume: result.activeResume,
  };
}
