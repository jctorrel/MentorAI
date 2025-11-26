
import express from "express";

import { requireAuth } from "../middleware/authMiddleware";
import createHealthRouter from "./health";
import createChatRouter from "./chat";
import createInitRouter from "./init";
import createAuthRouter from "./auth";
import { logger } from "../utils/logger";

export default function createApiRouter(args: any): express.Router {
    const router = express.Router();

    // Routes publiques
    router.use("/api/auth", createAuthRouter());

    // Routes protégées
    router.use(requireAuth);
    router.use("/api", createHealthRouter(args.openai));
    router.use("/api", createInitRouter(args.programs));
    router.use("/api", createChatRouter(args));

    logger.info('✅ API routes initialized.');

    return router;
}