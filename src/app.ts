import express from "express";
import cors from "cors";
import path from "path";

import { initMongo } from "./db/client.js";
import createApiRouter from "./routes/index.js";
import getEnv from "./utils/env.js";
import loadPrompt from "./utils/prompts.js";
import loadConfig from "./utils/configs.js";


const mongoUri = getEnv("MONGODB_URI");

export default function buildApp() {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Static
  const publicDir = path.join(process.cwd(), "src", "public");
  app.use(express.static(publicDir));

  // DB
  initMongo(mongoUri);

  // Routes
  app.use(createApiRouter());

  // Configs
  const mentorConfig = loadConfig("mentor-config.json");
  const programs = loadConfig("programs.json");

  console.log(programs);

  // Prompts
  const mentorSystemTemplate = loadPrompt("mentor-system.txt");
  const summarySystemTemplate = loadPrompt("summary-system.txt");

  return app;
}