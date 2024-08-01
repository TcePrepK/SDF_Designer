import { createDiv, createElement, getElementById } from "../../core/utils";

export class ErrorScreen {
    public constructor(msg: string) {
        const mainScreen = getElementById("main-screen");
        mainScreen.style.display = "none";

        const errorScreen = createDiv({ parent: document.body, id: "error-screen" },
            createElement("h1", { classes: ["top"], innerText: "UH OH!" }),
            createDiv({ classes: ["error"], innerText: msg })
        );
    }
}