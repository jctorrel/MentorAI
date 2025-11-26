// src/db/programs.ts
import { getDb } from "./db";

export interface ProgramModule {
  id: string;
  label: string;
  start_month: number;
  end_month: number;
  content: string[];
}

export interface Program {
  id: string;
  label: string;
  objectives: string;
  level: string;
  resources: string[];
  modules: ProgramModule[];
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION = "programs";

// Pour récupérer un programme par ID
export async function getProgramById(id: string): Promise<Program | null> {
  const db = getDb();
  return db.collection<Program>(COLLECTION).findOne({ id });
}

// Pour récupérer tous les programmes dans un objet { [id]: Program }
export async function getProgramsMap(): Promise<Record<string, Program>> {
  const db = getDb();
  const programs = await db.collection<Program>(COLLECTION).find().toArray();
  const map: Record<string, Program> = {};
  for (const p of programs) {
    map[p.id] = p;
  }
  return map;
}

// Pour lister simplement tous les programmes
export async function listPrograms(): Promise<Program[]> {
  const db = getDb();
  return db.collection<Program>(COLLECTION).find().sort({ id: 1 }).toArray();
}

// Pour insérer ou mettre à jour un programme
export async function upsertProgram(id: string, data: Omit<Program, "id" | "createdAt" | "updatedAt">): Promise<Program | null> {
  const db = getDb();
  const now = new Date();

  const result = await db.collection<Program>(COLLECTION).findOneAndUpdate(
    { id },
    {
      $set: {
        id,
        ...data,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true, returnDocument: "after" }
  );

  if (result && !result.id) {
    throw new Error(`Échec upsert program id=${id}`);
  }

  return result;
}

// Pour insérer à partir d'un objet style programs.json
export async function upsertProgramsFromObject(obj: Record<string, any>): Promise<void> {
  const entries = Object.entries(obj);
  for (const [id, value] of entries) {
    const { label, objectives, level, resources, modules } = value as any;
    await upsertProgram(id, {
      label,
      objectives,
      level,
      resources,
      modules,
    });
  }
}
