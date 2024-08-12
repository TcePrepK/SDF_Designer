import {getElementById, getElementByQuery} from "../../core/utils";
import {Logger} from "../../core/logger";

const logger = new Logger("Error Screen", "❌");

export class ErrorScreen {
    static setInactive(): void {
        getElementById("error-screen").remove();
    }

    static setActive(msg: string | null = null): void {
        if (msg) getElementByQuery("#error-screen .error").innerHTML = msg;
        getElementById("main-screen").remove();

        logger.toggleName();
        logger.error(msg);
    }
}