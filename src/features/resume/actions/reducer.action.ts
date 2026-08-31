import { PersonalInfo } from "../../personal-info/types";
import { AboutMe } from "../../about-me/types";
import { WorkExperience } from "../../experience/types";
import { Projects } from "../../projects/types";
import { SkillsData } from "../../skills/types";
import { Education } from "../../education/types";
import { Certifications } from "../../certifications/types";
import { Awards } from "../../awards/types";
import { Languages } from "../../languages/types";
import { ResumeData, ResumeSettings } from "../types";

export type ResumeAction =
  | { type: "SET_PERSONAL_INFO"; payload: PersonalInfo }
  | { type: "SET_ABOUT_ME"; payload: AboutMe }
  | { type: "SET_EXPERIENCE"; payload: WorkExperience }
  | { type: "SET_PROJECTS"; payload: Projects }
  | { type: "SET_SKILLS"; payload: SkillsData }
  | { type: "SET_EDUCATION"; payload: Education }
  | { type: "SET_CERTIFICATIONS"; payload: Certifications }
  | { type: "SET_AWARDS"; payload: Awards }
  | { type: "SET_LANGUAGES"; payload: Languages }
  | { type: "SET_SETTINGS"; payload: Partial<ResumeSettings> }
  | { type: "LOAD_SAMPLE_DATA" }
  | { type: "RESET_RESUME" }
  | { type: "HYDRATE_RESUME"; payload: ResumeData };

export const setPersonalInfo = (payload: PersonalInfo): ResumeAction => ({
  type: "SET_PERSONAL_INFO",
  payload,
});

export const setAboutMe = (payload: AboutMe): ResumeAction => ({
  type: "SET_ABOUT_ME",
  payload,
});

export const setExperience = (payload: WorkExperience): ResumeAction => ({
  type: "SET_EXPERIENCE",
  payload,
});

export const setProjects = (payload: Projects): ResumeAction => ({
  type: "SET_PROJECTS",
  payload,
});

export const setSkills = (payload: SkillsData): ResumeAction => ({
  type: "SET_SKILLS",
  payload,
});

export const setEducation = (payload: Education): ResumeAction => ({
  type: "SET_EDUCATION",
  payload,
});

export const setCertifications = (payload: Certifications): ResumeAction => ({
  type: "SET_CERTIFICATIONS",
  payload,
});

export const setAwards = (payload: Awards): ResumeAction => ({
  type: "SET_AWARDS",
  payload,
});

export const setLanguages = (payload: Languages): ResumeAction => ({
  type: "SET_LANGUAGES",
  payload,
});

export const setSettings = (payload: Partial<ResumeSettings>): ResumeAction => ({
  type: "SET_SETTINGS",
  payload,
});

export const loadSampleData = (): ResumeAction => ({
  type: "LOAD_SAMPLE_DATA",
});

export const resetResume = (): ResumeAction => ({
  type: "RESET_RESUME",
});

export const hydrateResume = (payload: ResumeData): ResumeAction => ({
  type: "HYDRATE_RESUME",
  payload,
});
