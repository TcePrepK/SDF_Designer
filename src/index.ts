import {Logger} from "./main/core/logger";
import {Main} from "./main/main";
import {ErrorScreen} from "./main/simulation/ui/ErrorScreen";

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
    ErrorScreen.setActive(msg as string);
}
