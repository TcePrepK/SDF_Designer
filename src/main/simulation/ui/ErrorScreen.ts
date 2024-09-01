import {getElementById, getElementByQuery} from "../../core/utils";
import {Logger} from "../../core/logger";

const logger = new Logger("Error Screen", "❌");

export class ErrorScreen {
    static setInactive(): void {
        const screen = getElementById("error-screen");
        screen.style.display = "none";
    }

    static setActive(error: unknown = null): void {
        let msg = error;
        if (error instanceof Error) msg = error.message;

        if (error) {
            getElementById("error-screen")!.style.display = "flex";
            getElementByQuery("#error-screen .error").innerHTML = `<span>Error: </span> ${msg}`;
        }

        getElementById("main-screen").remove();

        logger.toggleName();
        logger.toggleSymbol();
        logger.error(error);
    }
}