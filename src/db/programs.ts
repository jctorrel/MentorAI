// src/db/programs.ts
import { logger } from "../utils/logger";
import { getDb } from "./db";

export interface Program {
  key: string;          // "A1", "B2", etc.
  label: string;
  objectives: string;
  level: string;
  resources: string[];
  modules: Array<{
    id: string;
    label: string;
    start_month: number;
    end_month: number;
    content: string[];
  }>;
  updatedAt: Date;
  createdAt: Date;
}

const COLLECTION = "programs";

/**
 * Liste des programmes
 */
export async function listPrograms(): Promise<Program[]> {
  const db = getDb();
  return db.collection<Program>(COLLECTION).find().sort({ key: 1 }).toArray();
}

/**
 * Récupérer un programme par id
 */
export async function getProgram(key: string): Promise<Program | null> {
  const db = getDb();
  return db.collection<Program>(COLLECTION).findOne({ key });
}

/**
 * Mettre à jour ou créer un programme
 */
export async function upsertProgram(key: string, data: Partial<Program>): Promise<Program> {
  const db = getDb();
  const now = new Date();

  const { label, objectives, level, resources, modules } = data;

  const update = {
    $set: {
      key,
      label,
      objectives,
      level,
      resources,
      modules,
      updatedAt: now,
    },
    $setOnInsert: {
      createdAt: now,
    },
  };
  
  const result = await db
    .collection<Program>(COLLECTION)
    .findOneAndUpdate(
      { key }, 
      update, 
      { 
        upsert: true, 
        returnDocument: "after" 
      }
    );

  if (!result || !result.key) {
    logger.error("Échec upsertProgram() pour la clé :", key);
    throw new Error("Échec upsertProgram()");
  }

  return result;
}

/**
 * Supprimer un programme
 */
export async function deleteProgram(key: string): Promise<void> {
  const db = getDb();
  await db.collection(COLLECTION).deleteOne({ key });
}
