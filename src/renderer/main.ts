import { Canvas } from "./core/canvas";
import { FPSCounter } from "./core/fpsCounter";
import { GlobalVariables } from "./core/globalVariables";
import { fixEveryPreload } from "./core/utils";
import { VectorI2D } from "./core/vector2D";
import { UniformRegistry } from "./core/webgl/uniformRegistry";
import { MainRenderer } from "./simulation/renderer/mainRenderer";
import { Root } from "./simulation/root";
import { BrowserSupport } from "./simulation/ui/BrowserSupport";
import { NodePlayground } from "./simulation/ui/NodePlayground";
import { UserInterface } from "./simulation/ui/UserInterface";
import "../../res/style/style.scss";

export class Main {
    private readonly browserSupport = new BrowserSupport();

    private readonly root = new Root();

    private readonly fpsCounter = new FPSCounter();
    private readonly userInterface = new UserInterface();
    private readonly playground = new NodePlayground();
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

        requestAnimationFrame(() => this.startRunning());
    }

    private bigEnoughScreen(): boolean {
        const screenWidth = window.innerWidth;
        console.log(screenWidth);
        return screenWidth > 600;
    }
}