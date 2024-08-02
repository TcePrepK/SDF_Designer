import { FPSCounter } from "./core/fpsCounter";
import { MainRenderer } from "./simulation/renderer/mainRenderer";
import { GlobalVariables } from "./core/globalVariables";
import { UniformRegistry } from "./core/webgl/uniformRegistry";
import { UserInterface } from "./simulation/ui/UserInterface";
import { fixEveryPreload } from "./core/utils";
import { NodePlayground } from "./simulation/ui/NodePlayground";
import { VectorI2D } from "./core/vector2D";
import { BrowserSupport } from "./simulation/ui/BrowserSupport";
import "../../res/style/style.scss";
import { Root } from "./simulation/root";

export class Main {
    private readonly browserSupport = new BrowserSupport();

    private readonly root = new Root();

    private readonly fpsCounter = new FPSCounter();
    private readonly userInterface = new UserInterface();
    private readonly playground = new NodePlayground();
    private mainRenderer!: MainRenderer;

    public initialize(): void {
        GlobalVariables.resolution = new VectorI2D(0, 0);
        GlobalVariables.canvas = this.playground.mainCanvas;
        GlobalVariables.ctx = GlobalVariables.canvas.getContext();

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