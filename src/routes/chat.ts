// routes/health.js
import express from "express";
import { saveMessage } from "../db/messages";
import { logger } from "../utils/logger";

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
        await saveMessage(email, "user", message);
    });

    return router;
}
