// routes/health.js
import express from "express";

import { getStudentSummary, createStudentSummary } from "../db/summaries";
import { logger } from "../utils/logger";
import { render } from "../utils/prompts";
import getProgramPrompt from "../utils/programs";
import getEnv from "../utils/env";

const MENTOR_MODEL = getEnv("MENTOR_MODEL");


export default function createChatRouter(args: any) {
    const router = express.Router();

    router.post("/chat", async (_req, res) => {
        try {
            const { email, message, programID } = _req.body;

            if (!email || !message || !programID) {
                return res
                    .status(400)
                    .json({ reply: "email, message et programID sont requis." });
            }

            // Construction du prompt
            const previousSummary = await getStudentSummary(email);
            const systemPrompt = getSystemPrompt(args, email, programID, previousSummary);

            // OpenAI
            const reply = await args.openai.responses.create({
                model: MENTOR_MODEL,
                instructions: systemPrompt,
                input: message
            });
            const mentorReply = reply.output_text.trim();

            // Réponse du mentor
            res.json({ mentorReply });

            // Création du résumé
            await createStudentSummary(args.summarySystemTemplate, email, message, mentorReply);
        } catch (err) {
            logger.error("❌ Erreur /api/chat :", err);

            return res.status(500).json({
                reply:
                    "Je rencontre un problème technique. Réessaie dans un moment ou signale-le à l'équipe."
            });
        }
    });

    return router;
}

function getSystemPrompt(args: any, email: string, programID: string, summary: string) {
    const program_context = getProgramPrompt(args.programs, programID);

    return render(args.mentorSystemTemplate, {
        "email": email,
        "school_name": args.mentorConfig.school_name,
        "tone": args.mentorConfig.tone,
        "rules": args.mentorConfig.rules,
        "summary": summary || "- Aucun historique significatif pour l'instant.",
        "program": program_context
    });
}
