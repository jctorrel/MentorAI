import { createServer } from "http";
import { initMongo, getDb, closeMongo } from "./src/db";
import { buildApp } from "./src/app";
import { getEnv } from "./src/utils/env";
import { logger } from "./src/utils/logger";
import express from "express";

const port = Number(getEnv("PORT", "4000"));
const mongoUri = getEnv("MONGODB_URI");

// Start
const app = buildApp();
initMongo(mongoUri);

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("uncaughtException", (e) => {
    logger.error("uncaughtException", e);
    shutdown("uncaughtException");
});
process.on("unhandledRejection", (e) => {
    logger.error("unhandledRejection", e as any);
    shutdown("unhandledRejection");
});

// Listen
const server = createServer(app);
server.listen(port, () => {
    logger.info(`API démarrée sur http://localhost:${port}`);
});

// Quit
const shutdown = async (sig: string) => {
    logger.warn(`Reçu ${sig}, arrêt en cours...`);
    await closeMongo();

    server.close(() => {
        logger.info("Serveur arrêté proprement");
        process.exit(0);
    });
    setTimeout(() => process.exit(1), 5000).unref();
};