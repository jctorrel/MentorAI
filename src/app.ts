import express from "express";
import cors from "cors";
import path from "path";

import createApiRouter from "./routes"

export function buildApp() {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Static
  const publicDir = path.join(process.cwd(), "src", "public");
  app.use(express.static(publicDir));

  // Routes
  app.use(createApiRouter());

  return app;
}