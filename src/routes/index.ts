import express from "express";
import cors from "cors";
import path from "path";

export function buildApp() {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Static
  const publicDir = path.join(process.cwd(), "src", "public");
  app.use(express.static(publicDir));

  // Routes API minimales
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, time: new Date().toISOString() });
  });

  return app;
}
