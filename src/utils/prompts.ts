// src/utils/prompts.ts
import fs from "fs";
import path from "path";
import { logger } from "./logger";

// Use project root as base directory to remain compatible with tests (ts-jest)
const PROJECT_ROOT = process.cwd();

export function loadPrompt(name: string): string {
  const filePath = path.join(PROJECT_ROOT, "config", "prompts", name);
  try {
    logger.info(`✅ Fichier de prompts chargé : ${name}`);
    return fs.readFileSync(filePath, "utf8");
  } catch (err) {
    logger.error(`❌ Impossible de charger le prompt ${name} :`, err);
    return "";
  }
}

// Template engine: {{ var }}
export function render(template: string, vars: Record<string, unknown>): string {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
    const value = (vars as any)[key];
    return value !== undefined && value !== null ? String(value) : "";
  });
}