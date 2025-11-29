// src/db/programs.ts
import { logger } from "../utils/logger";
import { getDb } from "./db";

export interface Program {
  id: string;          // "A1", "B2", etc.
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
  return db.collection<Program>(COLLECTION).find().sort({ id: 1 }).toArray();
}

/**
 * Récupérer un programme par id
 */
export async function getProgram(id: string): Promise<Program | null> {
  const db = getDb();
  return db.collection<Program>(COLLECTION).findOne({ id });
}

/**
 * Mettre à jour ou créer un programme
 */
export async function upsertProgram(id: string, data: any): Promise<Program> {
  const db = getDb();
  const now = new Date();

  const result = await db.collection(COLLECTION).findOneAndUpdate(
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

  if (!result || !result.value) {
    logger.error("Échec upsertProgram() pour l'id :", id);
    throw new Error("Échec upsertProgram()");
  }

  return result.value;
}

/**
 * Supprimer un programme
 */
export async function deleteProgram(id: string): Promise<void> {
  const db = getDb();
  await db.collection(COLLECTION).deleteOne({ id });
}
