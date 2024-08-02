import { Logger } from "../../core/logger";
import { getElementByQuery } from "../../core/utils";

export enum Browser {
    Chrome,
    Firefox,
    Safari,
    Edge,
    IE,
    Opera,
    Unknown
}

const logger = new Logger("Browser Support", "✔️");

export class BrowserSupport {
    private readonly browser: Browser;

    public constructor() {
        this.browser = this.detectBrowser();
        logger.log("Browser: " + Browser[this.browser]);

        this.selectorScrollbar();
    }

    private selectorScrollbar(): void {
        if (this.browser !== Browser.Firefox) return;
        const selection = getElementByQuery("#user-interface #selection");
        if (selection) selection.style.scrollbarWidth = "none";
    }

    private detectBrowser(): Browser {
        const userAgent = navigator.userAgent;

        if (/chrome|crios|crmo/i.test(userAgent)) {
            return Browser.Chrome;
        } else if (/firefox|fxios/i.test(userAgent)) {
            return Browser.Firefox;
        } else if (/safari/i.test(userAgent)) {
            return Browser.Safari;
        } else if (/edg/i.test(userAgent)) {
            return Browser.Edge;
        } else if (/trident/i.test(userAgent)) {
            return Browser.IE;
        } else if (/opr\//i.test(userAgent)) {
            return Browser.Opera;
        } else {
            return Browser.Unknown;
        }
    }
}
