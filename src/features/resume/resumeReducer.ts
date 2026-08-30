import { ResumeData, initialResumeData } from "./types";
import { ResumeAction } from "./actions";
import { sampleResumeData } from "./sampleData";

export const resumeReducer = (
  state: ResumeData,
  action: ResumeAction
): ResumeData => {
  switch (action.type) {
    case "SET_PERSONAL_INFO":
      return {
        ...state,
        personalInfo: action.payload,
        lastModified: Date.now(),
      };

    case "SET_ABOUT_ME":
      return {
        ...state,
        aboutMe: action.payload,
        lastModified: Date.now(),
      };

    case "SET_EXPERIENCE":
      return {
        ...state,
        experience: action.payload,
        lastModified: Date.now(),
      };

    case "SET_PROJECTS":
      return {
        ...state,
        projects: action.payload,
        lastModified: Date.now(),
      };

    case "SET_SKILLS":
      return {
        ...state,
        skills: action.payload,
        lastModified: Date.now(),
      };

    case "SET_EDUCATION":
      return {
        ...state,
        education: action.payload,
        lastModified: Date.now(),
      };

    case "SET_CERTIFICATIONS":
      return {
        ...state,
        certifications: action.payload,
        lastModified: Date.now(),
      };

    case "SET_AWARDS":
      return {
        ...state,
        awards: action.payload,
        lastModified: Date.now(),
      };

    case "SET_LANGUAGES":
      return {
        ...state,
        languages: action.payload,
        lastModified: Date.now(),
      };

    case "SET_SETTINGS":
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
        lastModified: Date.now(),
      };

    case "LOAD_SAMPLE_DATA":
      return {
        ...sampleResumeData,
        lastModified: Date.now(),
      };

    case "RESET_RESUME":
      return {
        ...initialResumeData,
        lastModified: Date.now(),
      };

    case "HYDRATE_RESUME":
      return {
        ...action.payload,
        lastModified: Date.now(),
      };

    default:
      return state;
  }
};
