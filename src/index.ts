import { Logger } from "./renderer/core/logger";
import { Main } from "./renderer/main";

const logger = new Logger("Index Initialization", "✅");

logger.log("Renderer initialized successfully!");

logger.log("Imported main successfully!");
logger.log("Starting the main process...");

const main = new Main();
main.initialize();