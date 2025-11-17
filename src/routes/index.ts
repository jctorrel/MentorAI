
import express from "express";
import createHealthRouter from "./health.js";
import createChatRouter from "./chat.js";

export default function createApiRouter() {
    const router = express.Router();

    router.use("/api", createHealthRouter());
    router.use("/api", createChatRouter());

    return router;
}