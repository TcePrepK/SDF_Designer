import { Logger } from "./renderer/core/logger";
import { Main } from "./renderer/main";
import { ErrorScreen } from "./renderer/simulation/ui/ErrorScreen";

const logger = new Logger("Index Initialization", "✅");

logger.log("Renderer initialized successfully!");

logger.log("Imported main successfully!");
logger.log("Starting the main process...");

try {
    const main = new Main();
    main.initialize();
} catch (error) {
    let msg = error;
    if (error instanceof Error) msg = error.message;
    new ErrorScreen(msg as string);
}
