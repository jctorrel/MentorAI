import { createServer } from "http";
import { buildApp } from "./src/routes";
import { getEnv } from "./src/utils/env";
import { logger } from "./src/utils/logger";

const app = buildApp();
const port = Number(getEnv("PORT", "4000"));

const server = createServer(app);
server.listen(port, () => {
  logger.info(`API démarrée sur http://localhost:${port}`);
});