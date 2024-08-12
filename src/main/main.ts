import {Canvas} from "./core/canvas";
import {FPSCounter} from "./core/fpsCounter";
import {GlobalVariables} from "./core/globalVariables";
import {fixEveryPreload} from "./core/utils";
import {VectorI2D} from "./core/vector2D";
import {UniformRegistry} from "./core/webgl/uniformRegistry";
import {MainRenderer} from "./simulation/renderer/mainRenderer";
import {BrowserSupport} from "./simulation/ui/BrowserSupport";
import "../assets/style/style.scss";
import {UserInterface} from "./simulation/ui/UserInterface";
import {ErrorScreen} from "./simulation/ui/ErrorScreen";

export class Main {
    private readonly browserSupport = new BrowserSupport();

    private readonly userInterface = new UserInterface();

    private readonly fpsCounter = new FPSCounter();
    private mainRenderer!: MainRenderer;

    public initialize(): void {
        GlobalVariables.resolution = new VectorI2D(0, 0);
        GlobalVariables.canvas = new Canvas();
        GlobalVariables.canvas.initialize();
        GlobalVariables.ctx = GlobalVariables.canvas.getWebGLContext();

        this.userInterface.initialize();

        this.mainRenderer = new MainRenderer();

        UniformRegistry.initialize();
        this.mainRenderer.initialize();

        this.preload();
        this.startRunning();
    }

    private preload(): void {
        fixEveryPreload();
        ErrorScreen.setInactive();
    }

    public startRunning(): void {
        const dt = this.fpsCounter.start();
        GlobalVariables.time += dt / 1000;

        this.userInterface.update();
        this.mainRenderer.frameUpdate();

        // TODO: This should happen when update happens, not every frame!!!
        this.userInterface.updateFrame();

        requestAnimationFrame(() => this.startRunning());
    }

    private bigEnoughScreen(): boolean {
        const screenWidth = window.innerWidth;
        console.log(screenWidth);
        return screenWidth > 600;
    }
}