// routes/health.js
import express from "express";
import { logger } from "../utils/logger";
import { getActiveModules } from "../utils/programs";
import type { ProgramModule, Programs } from "../utils/programs";
import { AuthRequest } from "../middleware/authMiddleware";

export default function createInitRouter(programs: Programs): express.Router {
    const router = express.Router();

    router.post("/init", async (_req:AuthRequest, res) => {
        const { programID } = _req.body;

        if (!programID) {
            return res
                .status(400)
                .json({ reply: "programID est requis." });
        }
        const modules: ProgramModule[] = getActiveModules(programs, programID);

        // Si ok => 200, sinon => 500
        try {
            res.status(200).json({ modules: modules });
        } catch (error) {
            logger.error('Init check error:', error);
            res.status(500).json({ error: 'init_check_failed' });
        }
    });

    return router;
}