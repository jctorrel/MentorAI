import express from "express";
import cors from "cors";
import path from "path";

import { initMongo } from "./db/client.js";
import createApiRouter from "./routes/index.js";
import getEnv from "./utils/env.js";
import loadPrompt from "./utils/prompts.js";


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

  // Prompts
  loadPrompt("mentor-system.txt");

  return app;
}