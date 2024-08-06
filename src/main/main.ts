import {Canvas} from "./core/canvas";
import {FPSCounter} from "./core/fpsCounter";
import {GlobalVariables} from "./core/globalVariables";
import {fixEveryPreload} from "./core/utils";
import {VectorI2D} from "./core/vector2D";
import {UniformRegistry} from "./core/webgl/uniformRegistry";
import {MainRenderer} from "./simulation/renderer/mainRenderer";
import {Root} from "./simulation/root";
import {BrowserSupport} from "./simulation/ui/BrowserSupport";
import {UserInterface} from "./simulation/ui/UserInterface";
import "../assets/style/style.scss";

export class Main {
    private readonly browserSupport = new BrowserSupport();

    private readonly root = new Root();

    private readonly fpsCounter = new FPSCounter();
    private readonly userInterface = new UserInterface();
    private mainRenderer!: MainRenderer;

    public initialize(): void {
        GlobalVariables.resolution = new VectorI2D(0, 0);
        GlobalVariables.canvas = new Canvas();
        GlobalVariables.canvas.initialize();
        GlobalVariables.ctx = GlobalVariables.canvas.getWebGLContext();

        this.root.initialize();
        this.userInterface.initialize();

        this.mainRenderer = new MainRenderer();

        UniformRegistry.initialize();
        this.mainRenderer.initialize();

        fixEveryPreload();
        this.startRunning();
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