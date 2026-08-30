"use client";

import React, { createContext, useContext, useReducer, useCallback } from "react";
import { ResumeData, ResumeSettings } from "./types";
import { resumeReducer } from "./resumeReducer";
import { sampleResumeData } from "./sampleData";
import { useLocalStorage, UseLocalStorageReturn } from "./useLocalStorage";
import * as actions from "./actions";
import { PersonalInfo } from "../personal-info/types";
import { AboutMe } from "../about-me/types";
import { WorkExperience } from "../experience/types";
import { Projects } from "../projects/types";
import { SkillsData } from "../skills/types";
import { Education } from "../education/types";
import { Certifications } from "../certifications/types";
import { Awards } from "../awards/types";
import { Languages } from "../languages/types";

interface ResumeContextType {
  data: ResumeData;
  storage: UseLocalStorageReturn;
  // Feature-specific mutators
  setPersonalInfo: (info: PersonalInfo) => void;
  setAboutMe: (about: AboutMe) => void;
  setExperience: (exp: WorkExperience) => void;
  setProjects: (projects: Projects) => void;
  setSkills: (skills: SkillsData) => void;
  setEducation: (edu: Education) => void;
  setCertifications: (certs: Certifications) => void;
  setAwards: (awards: Awards) => void;
  setLanguages: (languages: Languages) => void;
  setSettings: (settings: Partial<ResumeSettings>) => void;
  loadSample: () => void;
  reset: () => void;
  hydrate: (data: ResumeData) => void;
}

const ResumeContext = createContext<ResumeContextType | null>(null);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Start with sample data so the user immediately sees a populated, working 1-page CV
  const [data, dispatch] = useReducer(resumeReducer, sampleResumeData);

  const handleHydrate = useCallback((loadedData: ResumeData) => {
    dispatch(actions.hydrateResume(loadedData));
  }, []);

  const storage = useLocalStorage(data, handleHydrate);

  const setPersonalInfo = useCallback((info: PersonalInfo) => {
    dispatch(actions.setPersonalInfo(info));
  }, []);

  const setAboutMe = useCallback((about: AboutMe) => {
    dispatch(actions.setAboutMe(about));
  }, []);

  const setExperience = useCallback((exp: WorkExperience) => {
    dispatch(actions.setExperience(exp));
  }, []);

  const setProjects = useCallback((projects: Projects) => {
    dispatch(actions.setProjects(projects));
  }, []);

  const setSkills = useCallback((skills: SkillsData) => {
    dispatch(actions.setSkills(skills));
  }, []);

  const setEducation = useCallback((edu: Education) => {
    dispatch(actions.setEducation(edu));
  }, []);

  const setCertifications = useCallback((certs: Certifications) => {
    dispatch(actions.setCertifications(certs));
  }, []);

  const setAwards = useCallback((awards: Awards) => {
    dispatch(actions.setAwards(awards));
  }, []);

  const setLanguages = useCallback((languages: Languages) => {
    dispatch(actions.setLanguages(languages));
  }, []);

  const setSettings = useCallback((settings: Partial<ResumeSettings>) => {
    dispatch(actions.setSettings(settings));
  }, []);

  const loadSample = useCallback(() => {
    dispatch(actions.loadSampleData());
  }, []);

  const reset = useCallback(() => {
    dispatch(actions.resetResume());
  }, []);

  const hydrate = useCallback((customData: ResumeData) => {
    dispatch(actions.hydrateResume(customData));
  }, []);

  return (
    <ResumeContext.Provider
      value={{
        data,
        storage,
        setPersonalInfo,
        setAboutMe,
        setExperience,
        setProjects,
        setSkills,
        setEducation,
        setCertifications,
        setAwards,
        setLanguages,
        setSettings,
        loadSample,
        reset,
        hydrate,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = (): ResumeContextType => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
};
