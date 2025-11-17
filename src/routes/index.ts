
import express from "express";
import createHealthRouter from "./health";
import createChatRouter from "./chat";

export default function createApiRouter() {
    const router = express.Router();

    router.use("/api", createHealthRouter());
    router.use("/api", createChatRouter());

    return router;
}