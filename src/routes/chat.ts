// routes/health.js
import express from "express";
import { saveMessage } from "../db/messages";
import { getStudentSummary } from "../db/summaries";
import { logger } from "../utils/logger";

import getEnv from "../utils/env";
const log = getEnv("LOG_MESSAGES") !== "false";


export default function createChatRouter() {
    const router = express.Router();

    router.post("/chat", async (_req, res) => {
        const { email, message, programId } = _req.body;

        if (!email || !message) {
            logger.error("Message reçu mais le format ne correspond pas");
            return res
                .status(400)
                .json({ reply: "email et message sont requis." });
        }

        // Log message utilisateur
        if (log !== false) {
            await saveMessage(email, "user", message);
        }
        const summary = await getStudentSummary(email);
    });

    return router;
}
