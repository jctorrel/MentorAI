// routes/health.js
import express from "express";
import { logger } from "../utils/logger";
import type OpenAI from "openai";
import { AuthRequest } from "../middleware/authMiddleware";

export default function createHealthRouter(openai: OpenAI): express.Router {
    const router = express.Router();

    router.get("/health", async (_req:AuthRequest, res) => {
        try {
            const openaiOk = await testOpenAIConnection(openai);
            // Si ok => 200, sinon => 503
            res.status(openaiOk ? 200 : 503).json({ ok: true, time: new Date().toISOString() });
        } catch (error) {
            logger.error('Health check error:', error);
            res.status(500).json({ ok: false, error: 'health_check_failed' });
        }
    });

    return router;
}

async function testOpenAIConnection(openai: OpenAI): Promise<boolean> {
  try {
    await openai.models.list();
    return true;
  } catch (err) {
    logger.error("HealthCheck OpenAI failed:", err);
    return false;
  }
}