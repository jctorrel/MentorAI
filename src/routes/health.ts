// routes/health.js
import express from "express";
import { logger } from "../utils/logger.js";

export default function createHealthRouter() {
    const router = express.Router();

    router.get("/health", async (_req, res) => {
        try {
            // Si ok => 200, sinon => 503
            res.status(true ? 200 : 503).json({ ok: true, time: new Date().toISOString() });
        } catch (error) {
            logger.error('Health check error:', error);
            res.status(500).json({ ok: false, error: 'health_check_failed' });
        }
    });

    return router;
}