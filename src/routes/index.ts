
import express from "express";
import createHealthRouter from "./health";

export default function createApiRouter() {
    const router = express.Router();

    router.use("/api", createHealthRouter());

    return router;
}