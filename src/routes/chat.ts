// routes/health.js
import express from "express";

import { saveMessage } from "../db/messages";
import { getStudentSummary } from "../db/summaries";
import { getLastMessages } from "../db/messages";
import { logger } from "../utils/logger";
import { render } from "../utils/prompts";
import getEnv from "../utils/env";
import { openai } from "../app";

const log = getEnv("LOG_MESSAGES") !== "false";
const MENTOR_MODEL = getEnv("MENTOR_MODEL");


export default function createChatRouter(args: any) {
    const router = express.Router();

    router.post("/chat", async (_req, res) => {
        const { email, message, programID } = _req.body;

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

        // Construction du prompt
        const previousSummary = await getStudentSummary(email);
        const lastUserMessage = await getLastMessages(email);
        const summary = render(args.summarySystemTemplate, { "last_user_message": lastUserMessage, "previous_summary": previousSummary });

        const systemPrompt = getSystemPrompt(args, email, programID, summary);

        // OpenAI
        const reply = await openai.responses.create({
            model: MENTOR_MODEL,
            instructions: systemPrompt,
            input: message
        });
        const assistantReply = reply.output_text.trim();
    });

    return router;
}

function getSystemPrompt(args: any, email: string, programID: string, summary: string) {
    return render(args.mentorSystemTemplate, {
        "email": email,
        "school_name": args.mentorConfig.school_name,
        "tone": args.mentorConfig.tone,
        "rules": args.mentorConfig.rules,
        "summary": summary || "- Aucun historique significatif pour l'instant.",
        "program_context": args.programs[programID]
    });
}
