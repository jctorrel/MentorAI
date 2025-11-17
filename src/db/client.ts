// src/db/index.ts
import { Db, MongoClient } from "mongodb";
import { logger } from "../utils/logger";

let client: MongoClient | undefined;
let db: Db | undefined;

export async function initMongo(uri: string, dbName: string = "") {
  if (db) return { client, db };

  if (!uri) throw new Error("MONGODB_URI manquant");
  client = new MongoClient(uri);

  await client.connect();
  db = dbName ? client.db(dbName) : client.db();

  // Indexes minimaux (idempotents)
  await Promise.all([
    db.collection("messages").createIndex({ email: 1, createdAt: -1 }),
    db.collection("student_summaries").createIndex({ email: 1 }, { unique: true }),
    db.collection("students").createIndex({ email: 1 }, { unique: true }),
  ]);

  logger.info("✅ Mongo connecté");
  return { client, db };
}

export function getDb() {
  if (!db) throw new Error("Mongo non initialisé. Appellez initMongo() d'abord.");
  return db;
}

export async function closeMongo() {
  if (client) {
    await client.close();
    logger.info("🛑 MongoDB déconnecté");
  }
}
