
import express from "express";
import createHealthRouter from "./health";
import createProgramsRouter from "./programs";
import createChatRouter from "./chat";

export default function createApiRouter(args: any) {
    const router = express.Router();

    router.use("/api", createHealthRouter());
    router.use("/api", createProgramsRouter());
    router.use("/api", createChatRouter(args));

    return router;
}