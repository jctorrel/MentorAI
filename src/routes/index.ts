
import express from "express";
import createHealthRouter from "./health";
import createChatRouter from "./chat";

export default function createApiRouter(args: any) {
    const router = express.Router();

    router.use("/api", createHealthRouter());
    router.use("/api", createChatRouter(args));

    return router;
}