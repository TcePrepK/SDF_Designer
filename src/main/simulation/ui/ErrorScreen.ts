import { createDiv, createElement, getElementById } from "../../core/utils";
import { Logger } from "../../core/logger";

const logger = new Logger("Error Screen", "❌");

export class ErrorScreen {
    public constructor(msg: string) {
        logger.toggleName();
        logger.error(msg);

        const mainScreen = getElementById("main-screen");
        mainScreen.style.display = "none";

        const errorScreen = createDiv({ parent: document.body, id: "error-screen" },
            createElement("h1", { classes: ["top"], innerText: "UH OH!" }),
            createDiv({ classes: ["error"], innerText: msg })
        );
    }
}