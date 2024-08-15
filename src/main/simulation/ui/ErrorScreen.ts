import {getElementById, getElementByQuery} from "../../core/utils";
import {Logger} from "../../core/logger";

const logger = new Logger("Error Screen", "❌");

export class ErrorScreen {
    static setInactive(): void {
        const screen = getElementById("error-screen");
        screen.style.display = "none";
    }

    static setActive(msg: string | null = null): void {
        if (msg) {
            getElementById("error-screen")!.style.display = "flex";
            getElementByQuery("#error-screen .error").innerHTML = `<span>Error: </span> ${msg}`;
        }

        getElementById("main-screen").remove();

        logger.toggleName();
        logger.error(msg);
    }
}