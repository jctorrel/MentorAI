import express from "express";
import cors from "cors";
import OpenAI from "openai";

import { initMongo } from "./db/db";
import createApiRouter from "./routes/index";
import getEnv from "./utils/env";
import { logger } from "./utils/logger";
import { getPromptContent } from "./db/prompts";
import loadConfig from "./utils/configs";

// DB
const mongoUri = getEnv("MONGODB_URI");
// OpenAI client
export const openai = new OpenAI({ apiKey: getEnv("OPENAI_API_KEY") });
// Prompts
const mentorPromptTemplate = getEnv("MENTOR_PROMPT_TEMPLATE");
const summaryPromptTemplate = getEnv("SUMMARY_PROMPT_TEMPLATE");

export default async function buildApp(): Promise<express.Express>{
  const app = express();

  // Middlewares
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(express.json());

  // DB
  await initMongo(mongoUri);

  // Configs
  const mentorConfig = loadConfig("mentor-config.json");
  const programs = loadConfig("programs.json");

  // Prompts
  const mentorSystemTemplate: Promise<string | null> = getPromptContent(mentorPromptTemplate);
  const summarySystemTemplate: Promise<string | null> = getPromptContent(summaryPromptTemplate);

  if(!mentorSystemTemplate) {
    logger.error(`❌ Prompt mentor introuvable pour la clé : ${mentorPromptTemplate}`);
    throw new Error(`Prompt mentor introuvable pour la clé : ${mentorPromptTemplate}`);
  }
  if(!summarySystemTemplate) {
    logger.error(`❌ Prompt mentor introuvable pour la clé : ${mentorPromptTemplate}`);
    throw new Error(`Prompt summary introuvable pour la clé : ${summaryPromptTemplate}`);
  }

  // Routes
  app.use(createApiRouter({
    openai,
    mentorSystemTemplate,
    summarySystemTemplate,
    mentorConfig,
    programs
  }));

  return app;
}


/*
import fs from "fs/promises";
import path from "path";
import { upsertPrompt } from "../src/db/prompts";

async function main() {
  const { db } = await initMongo(process.env.MONGODB_URI!, process.env.MONGODB_DBNAME);

const PROJECT_ROOT = process.cwd();
  const promptsDir = path.join(PROJECT_ROOT, "config", "prompts");
  const files = await fs.readdir(promptsDir);

  for (const file of files) {
    if (!file.endsWith(".txt")) continue;
    const key = path.basename(file, ".txt");
    const content = await fs.readFile(path.join(promptsDir, file), "utf8");
    await upsertPrompt(key, content, { label: key, type: "system" });
    console.log(`✅ Importé : ${file} -> key=${key}`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});*/