
import express from "express";
import createHealthRouter from "./health";
import createChatRouter from "./chat";
import createInitRouter from "./init";

export default function createApiRouter(args: any): express.Router {
    const router = express.Router();

    router.use("/api", createHealthRouter(args.openai));
    router.use("/api", createInitRouter(args.programs));
    router.use("/api", createChatRouter(args));

    return router;
}