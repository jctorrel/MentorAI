// routes/health.js
import express from "express";
import { logger } from "../utils/logger";
import { openai } from "../app";

export default function createHealthRouter() {
    const router = express.Router();

    router.get("/health", async (_req, res) => {
        try {
            const openaiOk = await testOpenAIConnection();
            // Si ok => 200, sinon => 503
            res.status(openaiOk ? 200 : 503).json({ ok: true, time: new Date().toISOString() });
        } catch (error) {
            logger.error('Health check error:', error);
            res.status(500).json({ ok: false, error: 'health_check_failed' });
        }
    });

    return router;
}

async function testOpenAIConnection(): Promise<boolean> {
  try {
    // Appel ultra léger
    await openai.models.list();
    return true;
  } catch (err) {
    logger.error("HealthCheck OpenAI failed:", err);
    return false;
  }
}