import {FPSCounter} from "./core/fpsCounter";
import {GlobalVariables} from "./core/globalVariables";
import {fixEveryPreload} from "./core/htmlUtils";
import {BrowserSupport} from "./simulation/ui/BrowserSupport";
import "../assets/style/style.scss";
import {ErrorScreen} from "./simulation/ui/ErrorScreen";
import {Root} from "./simulation/Root";

export class Main {
    private readonly root = new Root();

    private readonly fpsCounter = new FPSCounter();

    public initialize(): void {
        BrowserSupport.initialize();
        this.root.initialize();

        this.preload();
        this.startRunning();
    }

    private preload(): void {
        fixEveryPreload();
        ErrorScreen.setInactive();
    }

    public startRunning(): void {
        const dt = this.fpsCounter.update();
        GlobalVariables.time += dt / 1000;

        this.root.update();
        this.root.updateFrame();

        requestAnimationFrame(() => this.startRunning());
    }

    private bigEnoughScreen(): boolean {
        const screenWidth = window.innerWidth;
        console.log(screenWidth);
        return screenWidth > 600;
    }
}