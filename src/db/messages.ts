// src/db/messages.ts
import { getDb } from "./client";

export async function saveMessage(email :string, role:string, content:string) {
  const db = getDb();
  return db.collection("messages").insertOne({
    email,
    role,
    content,
    createdAt: new Date(),
  });
}

export async function getLastMessages(email:string, limit = 15) {
  const db = getDb();
  return db.collection("messages")
    .find({ email })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}
