// src/utils/prompts.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function loadPrompt(name: string) {
  const filePath = path.join(__dirname, "..", "..", "config", "prompts", name);
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (err) {
    console.error(`❌ Impossible de charger le prompt ${name} :`, err);
    return "";
  }
}

// Tiny template engine: {{ var }}
function render(template: string, vars: []) {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
    return Object.prototype.hasOwnProperty.call(vars, key) &&
      vars[key] !== undefined &&
      vars[key] !== null
      ? String(vars[key])
      : "";
  });
}