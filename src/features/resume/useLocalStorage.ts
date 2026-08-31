import { useEffect, useState, useCallback, useRef } from "react";
import { ResumeData, ResumeListItem } from "./types";
import { sampleResumeData } from "./sampleData";
import {
  getStorageConfigAction,
  getCvsAction,
  createCvAction,
  updateCvAction,
  renameCvAction,
  setActiveCvAction,
  deleteCvAction,
} from "./actions/resume.action";

const STORAGE_KEY_CVS = "dev_resume_generator_cvs_v2";
const LEGACY_STORAGE_KEY = "dev_resume_generator_data_v1";

interface StoredLocalResume {
  id: string;
  title: string;
  data: ResumeData;
  created_at: number;
  updated_at: number;
  is_active: boolean;
}

function getLocalStoredResumes(): StoredLocalResume[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CVS);
    if (raw) {
      const parsed = JSON.parse(raw) as StoredLocalResume[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    // Check legacy single-resume storage for seamless upgrade
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const legacyData = JSON.parse(legacyRaw) as ResumeData;
      if (legacyData && legacyData.personalInfo) {
        const legacyTitle = [legacyData.personalInfo.firstName, legacyData.personalInfo.lastName]
          .filter(Boolean)
          .join(" ") || "Developer Resume";
        const initialItem: StoredLocalResume = {
          id: crypto.randomUUID ? crypto.randomUUID() : "cv-" + Date.now(),
          title: legacyTitle,
          data: legacyData,
          created_at: legacyData.lastModified || Date.now(),
          updated_at: legacyData.lastModified || Date.now(),
          is_active: true,
        };
        localStorage.setItem(STORAGE_KEY_CVS, JSON.stringify([initialItem]));
        return [initialItem];
      }
    }

    // Initialize default sample resume
    const defaultItem: StoredLocalResume = {
      id: crypto.randomUUID ? crypto.randomUUID() : "cv-" + Date.now(),
      title: "Sample Developer CV",
      data: sampleResumeData,
      created_at: Date.now(),
      updated_at: Date.now(),
      is_active: true,
    };
    localStorage.setItem(STORAGE_KEY_CVS, JSON.stringify([defaultItem]));
    return [defaultItem];
  } catch (err) {
    console.warn("Failed to read from localStorage:", err);
    return [];
  }
}

function saveLocalStoredResumes(items: StoredLocalResume[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_CVS, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save to localStorage:", err);
  }
}

export interface UseLocalStorageReturn {
  isDbMode: boolean;
  isLoading: boolean;
  saveStatus: "saved" | "saving" | "error";
  lastSavedAt: Date | null;
  cvList: ResumeListItem[];
  activeCvId: string | null;
  activeCvTitle: string;
  createCv: (title?: string, initialData?: ResumeData) => Promise<void>;
  duplicateCv: (id: string, newTitle?: string) => Promise<void>;
  switchCv: (id: string) => Promise<void>;
  renameCv: (id: string, newTitle: string) => Promise<void>;
  deleteCv: (id: string) => Promise<void>;
  refreshCvList: () => Promise<void>;
  exportJson: (data: ResumeData) => void;
  importJson: (jsonString: string) => ResumeData | null;
  clearStorage: () => void;
}

export const useLocalStorage = (
  data: ResumeData,
  onHydrate: (data: ResumeData) => void
): UseLocalStorageReturn => {
  const [isDbMode, setIsDbMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // CV state (works identically in both DB and LocalStorage mode)
  const [cvList, setCvList] = useState<ResumeListItem[]>([]);
  const [activeCvId, setActiveCvId] = useState<string | null>(null);
  const [activeCvTitle, setActiveCvTitle] = useState<string>("Developer Resume");

  // Keep a ref to avoid infinite save loops while switching CVs
  const isSwitchingRef = useRef<boolean>(false);
  const initialLoadDoneRef = useRef<boolean>(false);

  // Initial check & hydration: Check if USE_DB is enabled on backend via Server Action
  useEffect(() => {
    let isMounted = true;

    async function initStorage() {
      try {
        const config = await getStorageConfigAction();
        if (config.useDb) {
          if (!isMounted) return;
          setIsDbMode(true);

          // Fetch resumes from DB via Server Action
          const cvsData = await getCvsAction();
          if (isMounted && cvsData.activeResume) {
            setCvList(cvsData.resumes || []);
            setActiveCvId(cvsData.activeResume.id);
            setActiveCvTitle(cvsData.activeResume.title);
            if (cvsData.activeResume.data && Object.keys(cvsData.activeResume.data).length > 0) {
              onHydrate(cvsData.activeResume.data);
            }
            setLastSavedAt(new Date(cvsData.activeResume.updated_at || Date.now()));
            setIsHydrated(true);
            setIsLoading(false);
            initialLoadDoneRef.current = true;
            return;
          }
        }
      } catch (err) {
        console.warn("DB config check failed, using localStorage mode:", err);
      }

      // LocalStorage mode with full multi-CV support
      if (!isMounted) return;
      setIsDbMode(false);
      try {
        const localItems = getLocalStoredResumes();
        if (localItems.length > 0) {
          const activeItem = localItems.find((i) => i.is_active) || localItems[0];
          setCvList(
            localItems.map((i) => ({
              id: i.id,
              title: i.title,
              created_at: i.created_at,
              updated_at: i.updated_at,
              is_active: i.id === activeItem.id,
            }))
          );
          setActiveCvId(activeItem.id);
          setActiveCvTitle(activeItem.title);
          if (activeItem.data && Object.keys(activeItem.data).length > 0) {
            onHydrate(activeItem.data);
          }
          setLastSavedAt(new Date(activeItem.updated_at || Date.now()));
        }
      } catch (err) {
        console.warn("Failed to load resumes from localStorage:", err);
      } finally {
        if (isMounted) {
          setIsHydrated(true);
          setIsLoading(false);
          initialLoadDoneRef.current = true;
        }
      }
    }

    initStorage();

    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-save on data change once hydrated
  useEffect(() => {
    if (!isHydrated || !initialLoadDoneRef.current || isSwitchingRef.current || !activeCvId) return;

    setSaveStatus("saving");
    const timeout = setTimeout(async () => {
      if (isDbMode) {
        // Save to SQLite database via Server Action
        try {
          const result = await updateCvAction(activeCvId, data);
          if (result.success) {
            if (result.resumes) {
              setCvList(result.resumes);
            }
            setSaveStatus("saved");
            setLastSavedAt(new Date());
          } else {
            setSaveStatus("error");
          }
        } catch (err) {
          console.error("Failed to save resume to DB:", err);
          setSaveStatus("error");
        }
      } else {
        // Save to LocalStorage
        try {
          const localItems = getLocalStoredResumes();
          const targetIndex = localItems.findIndex((i) => i.id === activeCvId);
          const now = Date.now();
          if (targetIndex >= 0) {
            localItems[targetIndex].data = data;
            localItems[targetIndex].updated_at = now;
          } else {
            localItems.push({
              id: activeCvId,
              title: activeCvTitle || "Developer Resume",
              data,
              created_at: now,
              updated_at: now,
              is_active: true,
            });
          }
          saveLocalStoredResumes(localItems);
          setCvList(
            localItems.map((i) => ({
              id: i.id,
              title: i.title,
              created_at: i.created_at,
              updated_at: i.updated_at,
              is_active: i.id === activeCvId,
            }))
          );
          setSaveStatus("saved");
          setLastSavedAt(new Date(now));
        } catch (err) {
          console.error("Failed to save resume to localStorage:", err);
          setSaveStatus("error");
        }
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [data, isHydrated, isDbMode, activeCvId, activeCvTitle]);

  // Actions for both DB and LocalStorage modes
  const refreshCvList = useCallback(async () => {
    if (isDbMode) {
      try {
        const res = await getCvsAction();
        setCvList(res.resumes || []);
      } catch (err) {
        console.error("Failed to refresh CV list from DB:", err);
      }
    } else {
      const localItems = getLocalStoredResumes();
      setCvList(
        localItems.map((i) => ({
          id: i.id,
          title: i.title,
          created_at: i.created_at,
          updated_at: i.updated_at,
          is_active: i.id === activeCvId,
        }))
      );
    }
  }, [isDbMode, activeCvId]);

  const createCv = useCallback(
    async (title?: string, initialData?: ResumeData) => {
      const newTitle = title || "New Developer CV";
      const newData = initialData || sampleResumeData;

      if (isDbMode) {
        try {
          isSwitchingRef.current = true;
          setSaveStatus("saving");
          const result = await createCvAction({
            title: newTitle,
            data: newData,
          });

          if (result.success && result.resume) {
            setCvList(result.resumes || []);
            setActiveCvId(result.resume.id);
            setActiveCvTitle(result.resume.title);
            onHydrate(result.resume.data);
            setLastSavedAt(new Date(result.resume.updated_at));
            setSaveStatus("saved");
          }
        } catch (err) {
          console.error("Failed to create new CV in DB:", err);
          setSaveStatus("error");
        } finally {
          setTimeout(() => {
            isSwitchingRef.current = false;
          }, 100);
        }
      } else {
        // LocalStorage mode
        try {
          isSwitchingRef.current = true;
          setSaveStatus("saving");
          const localItems = getLocalStoredResumes();
          localItems.forEach((i) => (i.is_active = false));

          const newId = crypto.randomUUID ? crypto.randomUUID() : "cv-" + Date.now();
          const now = Date.now();
          const newItem: StoredLocalResume = {
            id: newId,
            title: newTitle,
            data: newData,
            created_at: now,
            updated_at: now,
            is_active: true,
          };
          localItems.unshift(newItem);
          saveLocalStoredResumes(localItems);

          setCvList(
            localItems.map((i) => ({
              id: i.id,
              title: i.title,
              created_at: i.created_at,
              updated_at: i.updated_at,
              is_active: i.id === newId,
            }))
          );
          setActiveCvId(newId);
          setActiveCvTitle(newTitle);
          onHydrate(newData);
          setLastSavedAt(new Date(now));
          setSaveStatus("saved");
        } catch (err) {
          console.error("Failed to create new CV in localStorage:", err);
          setSaveStatus("error");
        } finally {
          setTimeout(() => {
            isSwitchingRef.current = false;
          }, 100);
        }
      }
    },
    [isDbMode, onHydrate]
  );

  const duplicateCv = useCallback(
    async (id: string, newTitle?: string) => {
      if (isDbMode) {
        try {
          isSwitchingRef.current = true;
          setSaveStatus("saving");
          const currentItem = cvList.find((c) => c.id === id);
          const titleToUse = newTitle || `${currentItem ? currentItem.title : "Resume"} (Copy)`;

          const result = await createCvAction({
            title: titleToUse,
            cloneFromId: id,
          });

          if (result.success && result.resume) {
            setCvList(result.resumes || []);
            setActiveCvId(result.resume.id);
            setActiveCvTitle(result.resume.title);
            onHydrate(result.resume.data);
            setLastSavedAt(new Date(result.resume.updated_at));
            setSaveStatus("saved");
          }
        } catch (err) {
          console.error("Failed to duplicate CV in DB:", err);
          setSaveStatus("error");
        } finally {
          setTimeout(() => {
            isSwitchingRef.current = false;
          }, 100);
        }
      } else {
        // LocalStorage mode
        try {
          isSwitchingRef.current = true;
          setSaveStatus("saving");
          const localItems = getLocalStoredResumes();
          const source = localItems.find((i) => i.id === id);
          const titleToUse = newTitle || (source ? `${source.title} (Copy)` : "Resume (Copy)");
          const clonedData = source ? JSON.parse(JSON.stringify(source.data)) : sampleResumeData;

          localItems.forEach((i) => (i.is_active = false));
          const newId = crypto.randomUUID ? crypto.randomUUID() : "cv-" + Date.now();
          const now = Date.now();
          const newItem: StoredLocalResume = {
            id: newId,
            title: titleToUse,
            data: clonedData,
            created_at: now,
            updated_at: now,
            is_active: true,
          };
          localItems.unshift(newItem);
          saveLocalStoredResumes(localItems);

          setCvList(
            localItems.map((i) => ({
              id: i.id,
              title: i.title,
              created_at: i.created_at,
              updated_at: i.updated_at,
              is_active: i.id === newId,
            }))
          );
          setActiveCvId(newId);
          setActiveCvTitle(titleToUse);
          onHydrate(clonedData);
          setLastSavedAt(new Date(now));
          setSaveStatus("saved");
        } catch (err) {
          console.error("Failed to duplicate CV in localStorage:", err);
          setSaveStatus("error");
        } finally {
          setTimeout(() => {
            isSwitchingRef.current = false;
          }, 100);
        }
      }
    },
    [isDbMode, cvList, onHydrate]
  );

  const switchCv = useCallback(
    async (id: string) => {
      if (id === activeCvId) return;

      if (isDbMode) {
        try {
          isSwitchingRef.current = true;
          setSaveStatus("saving");
          const result = await setActiveCvAction(id);

          if (result.success && result.resume) {
            setCvList(result.resumes || []);
            setActiveCvId(result.resume.id);
            setActiveCvTitle(result.resume.title);
            onHydrate(result.resume.data);
            setLastSavedAt(new Date(result.resume.updated_at));
            setSaveStatus("saved");
          }
        } catch (err) {
          console.error("Failed to switch CV in DB:", err);
          setSaveStatus("error");
        } finally {
          setTimeout(() => {
            isSwitchingRef.current = false;
          }, 100);
        }
      } else {
        // LocalStorage mode
        try {
          isSwitchingRef.current = true;
          setSaveStatus("saving");
          const localItems = getLocalStoredResumes();
          localItems.forEach((i) => (i.is_active = i.id === id));
          const target = localItems.find((i) => i.id === id);

          if (target) {
            saveLocalStoredResumes(localItems);
            setCvList(
              localItems.map((i) => ({
                id: i.id,
                title: i.title,
                created_at: i.created_at,
                updated_at: i.updated_at,
                is_active: i.id === id,
              }))
            );
            setActiveCvId(target.id);
            setActiveCvTitle(target.title);
            onHydrate(target.data);
            setLastSavedAt(new Date(target.updated_at));
            setSaveStatus("saved");
          }
        } catch (err) {
          console.error("Failed to switch CV in localStorage:", err);
          setSaveStatus("error");
        } finally {
          setTimeout(() => {
            isSwitchingRef.current = false;
          }, 100);
        }
      }
    },
    [isDbMode, activeCvId, onHydrate]
  );

  const renameCv = useCallback(
    async (id: string, newTitle: string) => {
      const trimmed = newTitle.trim();
      if (!trimmed) return;

      if (isDbMode) {
        try {
          const result = await renameCvAction(id, trimmed);
          if (result.success) {
            if (result.resumes) {
              setCvList(result.resumes);
            }
            if (id === activeCvId) {
              setActiveCvTitle(trimmed);
            }
          }
        } catch (err) {
          console.error("Failed to rename CV in DB:", err);
        }
      } else {
        // LocalStorage mode
        try {
          const localItems = getLocalStoredResumes();
          const target = localItems.find((i) => i.id === id);
          if (target) {
            target.title = trimmed;
            target.updated_at = Date.now();
            saveLocalStoredResumes(localItems);
            setCvList(
              localItems.map((i) => ({
                id: i.id,
                title: i.title,
                created_at: i.created_at,
                updated_at: i.updated_at,
                is_active: i.id === activeCvId,
              }))
            );
            if (id === activeCvId) {
              setActiveCvTitle(trimmed);
            }
          }
        } catch (err) {
          console.error("Failed to rename CV in localStorage:", err);
        }
      }
    },
    [isDbMode, activeCvId]
  );

  const deleteCv = useCallback(
    async (id: string) => {
      if (isDbMode) {
        try {
          isSwitchingRef.current = true;
          const result = await deleteCvAction(id);

          if (result.success) {
            setCvList(result.resumes || []);
            if (result.activeResume) {
              setActiveCvId(result.activeResume.id);
              setActiveCvTitle(result.activeResume.title);
              onHydrate(result.activeResume.data);
              setLastSavedAt(new Date(result.activeResume.updated_at));
            }
          }
        } catch (err) {
          console.error("Failed to delete CV in DB:", err);
        } finally {
          setTimeout(() => {
            isSwitchingRef.current = false;
          }, 100);
        }
      } else {
        // LocalStorage mode
        try {
          isSwitchingRef.current = true;
          let localItems = getLocalStoredResumes();
          const wasActive = localItems.find((i) => i.id === id)?.is_active;
          localItems = localItems.filter((i) => i.id !== id);

          if (localItems.length === 0) {
            const defaultItem: StoredLocalResume = {
              id: crypto.randomUUID ? crypto.randomUUID() : "cv-" + Date.now(),
              title: "Sample Developer CV",
              data: sampleResumeData,
              created_at: Date.now(),
              updated_at: Date.now(),
              is_active: true,
            };
            localItems = [defaultItem];
          } else if (wasActive) {
            localItems[0].is_active = true;
          }

          saveLocalStoredResumes(localItems);
          const nextActive = localItems.find((i) => i.is_active) || localItems[0];

          setCvList(
            localItems.map((i) => ({
              id: i.id,
              title: i.title,
              created_at: i.created_at,
              updated_at: i.updated_at,
              is_active: i.id === nextActive.id,
            }))
          );
          setActiveCvId(nextActive.id);
          setActiveCvTitle(nextActive.title);
          onHydrate(nextActive.data);
          setLastSavedAt(new Date(nextActive.updated_at));
        } catch (err) {
          console.error("Failed to delete CV in localStorage:", err);
        } finally {
          setTimeout(() => {
            isSwitchingRef.current = false;
          }, 100);
        }
      }
    },
    [isDbMode, onHydrate]
  );

  const exportJson = useCallback((resumeData: ResumeData) => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeData, null, 2));
      const downloadAnchor = document.createElement("a");
      const filename = `${(resumeData.personalInfo.firstName || "developer")}_${(resumeData.personalInfo.lastName || "resume")}_cv.json`.toLowerCase().replace(/\s+/g, "_");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", filename);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error("Export JSON failed:", err);
    }
  }, []);

  const importJson = useCallback((jsonString: string): ResumeData | null => {
    try {
      const parsed = JSON.parse(jsonString) as ResumeData;
      if (!parsed || typeof parsed !== "object") throw new Error("Invalid JSON");
      return parsed;
    } catch (err) {
      console.error("Import JSON failed:", err);
      return null;
    }
  }, []);

  const clearStorage = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_CVS);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  }, []);

  return {
    isDbMode,
    isLoading,
    saveStatus,
    lastSavedAt,
    cvList,
    activeCvId,
    activeCvTitle,
    createCv,
    duplicateCv,
    switchCv,
    renameCv,
    deleteCv,
    refreshCvList,
    exportJson,
    importJson,
    clearStorage,
  };
};
