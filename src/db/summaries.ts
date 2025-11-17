// src/db/summaries.ts
import { getDb } from "./client";

export async function getStudentSummary(email: string) {
  const db = getDb();
  const doc = await db.collection("student_summaries").findOne({ email });
  return doc?.summary || " - il n'y a pas encore de résumé - ";
}

export async function upsertStudentSummary(email: string, summary: string) {
  const db = getDb();
  await db.collection("student_summaries").updateOne(
    { email },
    { $set: { email, summary, updatedAt: new Date() } },
    { upsert: true }
  );
}
