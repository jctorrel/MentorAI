import express from "express";
import cors from "cors";
import path from "path";

import { initMongo } from "./db";
import createApiRouter from "./routes";
import getEnv from "./utils/env";


const mongoUri = getEnv("MONGODB_URI");

export function buildApp() {
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

  return app;
}