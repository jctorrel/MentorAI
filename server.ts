import { createServer } from "https";
import fs from "node:fs";
import path from "node:path";

import buildApp from "./src/app";
import { logger } from "./src/utils/logger";
import getEnv from "./src/utils/env";
import { shutdown } from "./src/utils/shutdown";

const port = Number(getEnv("PORT", "4000"));

// Start
const app = await buildApp();

// HTTPs server
const keyPath = getEnv("SSL_KEY_PATH");
const certPath = getEnv("SSL_CERT_PATH");

const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
};

const server = createServer(httpsOptions, app);

// Signaux
process.on("SIGINT", () => shutdown("SIGINT", server));
process.on("SIGTERM", () => shutdown("SIGTERM", server));
process.on("uncaughtException", (e) => {
    logger.error("uncaughtException", e);
    shutdown("uncaughtException", server);
});
process.on("unhandledRejection", (e) => {
    logger.error("unhandledRejection", e as any);
    shutdown("unhandledRejection", server);
});

// Listen
server.listen(port, () => {
    logger.info(`API démarrée sur https://localhost:${port}`);
});