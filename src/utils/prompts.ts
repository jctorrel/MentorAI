// src/utils/prompts.ts

import fs from "fs/promises";
import path from "path";
import { initMongo } from "../db/db";
import { upsertPrompt } from "../db/prompts";

const PROJECT_ROOT = process.cwd();

// Template engine: {{ var }}
export default function render(template: string, vars: Record<string, unknown>): string {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
    const value = (vars as any)[key];
    return value !== undefined && value !== null ? String(value) : "";
  });
}


export async function importPromptFileToDB() {
  const { db } = await initMongo(process.env.MONGODB_URI!, process.env.MONGODB_DBNAME);

  const promptsDir = path.join(PROJECT_ROOT, "config", "prompts");
  const files = await fs.readdir(promptsDir);

  for (const file of files) {
    if (!file.endsWith(".txt")) continue;
    const key = path.basename(file, ".txt");
    const content = await fs.readFile(path.join(promptsDir, file), "utf8");
    console.log(key, content);
    await upsertPrompt(key, content, { label: key });
    console.log(`✅ Importé : ${file} -> key=${key}`);
  }

  process.exit(0);
}