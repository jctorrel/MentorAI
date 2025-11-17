// src/db/students.ts
import { getDb } from "./client";

export async function upsertStudent(email: string, data = {}) {
  const db = getDb();
  await db.collection("students").updateOne(
    { email },
    {
      $setOnInsert: { createdAt: new Date(), email },
      $set: { ...data, updatedAt: new Date() }
    },
    { upsert: true }
  );
}

export async function getStudent(email: string) {
  const db = getDb();
  return db.collection("students").findOne({ email });
}

export async function setStudentProgram(email: string, programId: string) {
  const db = getDb();
  await db.collection("students").updateOne(
    { email },
    { $set: { programId, updatedAt: new Date() } },
    { upsert: true }
  );
}
