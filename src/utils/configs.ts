// src/utils/prompts.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function loadConfig(name: string) {
    let config = {};

    try {
        const raw = fs.readFileSync(
            path.join(__dirname, "..", "..", "config", name),
            "utf8"
        );
        const parsed = JSON.parse(raw);
        config = { ...config, ...parsed };
        console.log("✅ Config mentor chargée");
    } catch (err) {
        console.error(
            "⚠️ Impossible de charger", name, "utilisation des valeurs par défaut.", err
        );
    }

    return config;
}