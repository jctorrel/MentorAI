import express from "express";
import { logger } from "../utils/logger";

export default function createProgramsRouter() {
    const router = express.Router();

    router.get("/programs", async (_req, res) => {
        try {
            res.status(200).json({ ok: true, time: new Date().toISOString() });
        } catch (error) {
            logger.error('Program check error:', error);
            res.status(500).json({ ok: false, error: 'health_check_failed' });
        }
    });

    return router;
}