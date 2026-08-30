import { useEffect, useState, useCallback } from "react";
import { ResumeData } from "./types";

const STORAGE_KEY = "dev_resume_generator_data_v1";

export interface UseLocalStorageReturn {
  saveStatus: "saved" | "saving" | "error";
  lastSavedAt: Date | null;
  exportJson: (data: ResumeData) => void;
  importJson: (jsonString: string) => ResumeData | null;
  clearStorage: () => void;
}

export const useLocalStorage = (
  data: ResumeData,
  onHydrate: (data: ResumeData) => void
): UseLocalStorageReturn => {
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initial hydration from localStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as ResumeData;
          if (parsed && parsed.personalInfo) {
            onHydrate(parsed);
            setLastSavedAt(new Date(parsed.lastModified || Date.now()));
          }
        }
      }
    } catch (err) {
      console.warn("Failed to load resume from localStorage:", err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Auto-save on data change once hydrated
  useEffect(() => {
    if (!isHydrated) return;

    setSaveStatus("saving");
    const timeout = setTimeout(() => {
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          setSaveStatus("saved");
          setLastSavedAt(new Date());
        }
      } catch (err) {
        console.error("Failed to save resume to localStorage:", err);
        setSaveStatus("error");
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [data, isHydrated]);

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
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    saveStatus,
    lastSavedAt,
    exportJson,
    importJson,
    clearStorage,
  };
};
