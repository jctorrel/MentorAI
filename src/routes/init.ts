// routes/health.js
import express from "express";
import { logger } from "../utils/logger";
import type OpenAI from "openai";

export default function createInitRouter() {
    const router = express.Router();

    // Si ok => 200, sinon => 500
    router.get("/health", async (_req, res) => {
        try {
            res.status(200).json({ ok: true, time: new Date().toISOString() });
        } catch (error) {
            logger.error('Health check error:', error);
            res.status(500).json({ ok: false, error: 'health_check_failed' });
        }
    });

    return router;
}