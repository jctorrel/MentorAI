import express from "express";
import cors from "cors";
import path from "path";
import OpenAI from "openai";

import { initMongo } from "./db/client";
import createApiRouter from "./routes/index";
import getEnv from "./utils/env";
import { loadPrompt } from "./utils/prompts";
import loadConfig from "./utils/configs";


const mongoUri = getEnv("MONGODB_URI");
// OpenAI client
export const openai = new OpenAI({ apiKey: getEnv("OPENAI_API_KEY") });

export default function buildApp(): express.Express {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // DB
  initMongo(mongoUri);

  // Configs
  const mentorConfig = loadConfig("mentor-config.json");
  const programs = loadConfig("programs.json");

  // Prompts
  const mentorSystemTemplate = loadPrompt("mentor-system.txt");
  const summarySystemTemplate = loadPrompt("summary-system.txt");

  
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