import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import { ResumeData, ResumeListItem } from "@/features/resume/types";

let dbInstance: DatabaseSync | null = null;

export function isDbEnabled(): boolean {
  const envVal = process.env.USE_DB || process.env.NEXT_PUBLIC_USE_DB;
  return envVal === "true" || envVal === "1";
}

export function getDb(): DatabaseSync {
  if (!dbInstance) {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, "resumes.db");
    dbInstance = new DatabaseSync(dbPath);

    // Initialize table schema
    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS resumes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        data TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        is_active INTEGER DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS idx_resumes_updated ON resumes (updated_at DESC);
    `);
  }
  return dbInstance;
}

export function generateResumeTitle(data: ResumeData): string {
  const name = [data.personalInfo?.firstName, data.personalInfo?.lastName].filter(Boolean).join(" ");
  const role = data.personalInfo?.title;
  if (name && role) return `${name} – ${role}`;
  if (name) return `${name} CV`;
  if (role) return role;
  return "Developer Resume";
}

export interface DbResumeRow {
  id: string;
  title: string;
  data: string;
  created_at: number;
  updated_at: number;
  is_active: number;
}

export interface ResumeDetail {
  id: string;
  title: string;
  data: ResumeData;
  created_at: number;
  updated_at: number;
  is_active: boolean;
}

export function getAllResumes(): ResumeListItem[] {
  const db = getDb();
  const rows = db.prepare("SELECT id, title, created_at, updated_at, is_active FROM resumes ORDER BY updated_at DESC").all() as unknown as Omit<DbResumeRow, "data">[];
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    created_at: r.created_at,
    updated_at: r.updated_at,
    is_active: Boolean(r.is_active),
  }));
}

export function getResumeById(id: string): ResumeDetail | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM resumes WHERE id = ?").get(id) as unknown as DbResumeRow | undefined;
  if (!row) return null;

  try {
    const parsedData = JSON.parse(row.data) as ResumeData;
    return {
      id: row.id,
      title: row.title,
      data: parsedData,
      created_at: row.created_at,
      updated_at: row.updated_at,
      is_active: Boolean(row.is_active),
    };
  } catch (err) {
    console.error("Failed to parse resume JSON data from DB:", err);
    return null;
  }
}

export function getActiveResume(): ResumeDetail | null {
  const db = getDb();
  // Find currently active
  let row = db.prepare("SELECT * FROM resumes WHERE is_active = 1 LIMIT 1").get() as unknown as DbResumeRow | undefined;
  if (!row) {
    // Fallback to most recently updated
    row = db.prepare("SELECT * FROM resumes ORDER BY updated_at DESC LIMIT 1").get() as unknown as DbResumeRow | undefined;
    if (row) {
      db.prepare("UPDATE resumes SET is_active = 1 WHERE id = ?").run(row.id);
    }
  }

  if (!row) return null;

  try {
    const parsedData = JSON.parse(row.data) as ResumeData;
    return {
      id: row.id,
      title: row.title,
      data: parsedData,
      created_at: row.created_at,
      updated_at: row.updated_at,
      is_active: true,
    };
  } catch (err) {
    console.error("Failed to parse active resume JSON data from DB:", err);
    return null;
  }
}

export function createResume(title?: string, data?: ResumeData): ResumeDetail {
  const db = getDb();
  const id = crypto.randomUUID();
  const now = Date.now();
  const resumeData = data || ({} as ResumeData);
  const resumeTitle = title || (data ? generateResumeTitle(data) : "New Resume");

  // Deactivate others
  db.prepare("UPDATE resumes SET is_active = 0").run();

  const insert = db.prepare(`
    INSERT INTO resumes (id, title, data, created_at, updated_at, is_active)
    VALUES (?, ?, ?, ?, ?, 1)
  `);

  insert.run(id, resumeTitle, JSON.stringify(resumeData), now, now);

  return {
    id,
    title: resumeTitle,
    data: resumeData,
    created_at: now,
    updated_at: now,
    is_active: true,
  };
}

export function updateResume(id: string, data: ResumeData, title?: string): boolean {
  const db = getDb();
  const now = Date.now();

  if (title !== undefined) {
    const update = db.prepare(`
      UPDATE resumes
      SET data = ?, title = ?, updated_at = ?
      WHERE id = ?
    `);
    const result = update.run(JSON.stringify(data), title, now, id);
    return Number(result.changes) > 0;
  } else {
    const update = db.prepare(`
      UPDATE resumes
      SET data = ?, updated_at = ?
      WHERE id = ?
    `);
    const result = update.run(JSON.stringify(data), now, id);
    return Number(result.changes) > 0;
  }
}


export function renameResume(id: string, title: string): boolean {
  const db = getDb();
  const now = Date.now();
  const update = db.prepare("UPDATE resumes SET title = ?, updated_at = ? WHERE id = ?");
  const result = update.run(title, now, id);
  return Number(result.changes) > 0;
}

export function setActiveResume(id: string): boolean {
  const db = getDb();
  db.prepare("UPDATE resumes SET is_active = 0").run();
  const result = db.prepare("UPDATE resumes SET is_active = 1 WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}

export function deleteResume(id: string): boolean {
  const db = getDb();
  const target = db.prepare("SELECT is_active FROM resumes WHERE id = ?").get(id) as unknown as { is_active: number } | undefined;
  if (!target) return false;

  db.prepare("DELETE FROM resumes WHERE id = ?").run(id);

  // If deleted was active, promote another one
  if (target.is_active === 1) {
    const nextActive = db.prepare("SELECT id FROM resumes ORDER BY updated_at DESC LIMIT 1").get() as unknown as { id: string } | undefined;
    if (nextActive) {
      db.prepare("UPDATE resumes SET is_active = 1 WHERE id = ?").run(nextActive.id);
    }
  }

  return true;
}
