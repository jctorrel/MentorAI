import express from "express";
import cors from "cors";
import OpenAI from "openai";

import { initMongo } from "./db/db";
import createApiRouter from "./routes/index";
import getEnv from "./utils/env";
import { logger } from "./utils/logger";
import { getPromptContent } from "./db/prompts";
import { getMentorConfig } from "./db/config";
import { listPrograms } from "./db/programs";

// DB
const mongoUri = getEnv("MONGODB_URI");
// OpenAI client
export const openai = new OpenAI({ apiKey: getEnv("OPENAI_API_KEY") });
// Prompts
const mentorPromptTemplate = getEnv("MENTOR_PROMPT_TEMPLATE");
const summaryPromptTemplate = getEnv("SUMMARY_PROMPT_TEMPLATE");

export default async function buildApp(): Promise<express.Express> {
  const app = express();

  // Middlewares
  app.use(cors({ origin: "https://localhost:3000", credentials: true }));
  app.use(express.json());

  // DB
  await initMongo(mongoUri);

  // Config
  const mentorConfig = await getMentorConfig();

  // Programs
  const programs = await listPrograms();

  // Prompts
  const mentorSystemTemplate: string | null = await getPromptContent(mentorPromptTemplate);
  const summarySystemTemplate: string | null = await getPromptContent(summaryPromptTemplate);

  if (!mentorConfig) {
    logger.error("Config introuvable");
    throw new Error("Config introuvable");
  }
  if (!programs) {
    logger.error("Programs introuvables");
    throw new Error("Programs introuvables");
  }
  if (!mentorSystemTemplate) {
    logger.error(`Prompt mentor introuvable pour la clé : ${mentorPromptTemplate}`);
    throw new Error(`Prompt mentor introuvable pour la clé : ${mentorPromptTemplate}`);
  }
  if (!summarySystemTemplate) {
    logger.error(`Prompt summary introuvable pour la clé : ${summaryPromptTemplate}`);
    throw new Error(`Prompt summary introuvable pour la clé : ${summaryPromptTemplate}`);
  }

  logger.info("✅ Config et prompts chargés");

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