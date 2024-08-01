import { Canvas } from "./core/canvas";
import { FPSCounter } from "./core/fpsCounter";
import { MainRenderer } from "./simulation/renderer/mainRenderer";
import { GlobalVariables } from "./core/globalVariables";
import { Mouse } from "./core/mouse";
import { UniformRegistry } from "./core/webgl/uniformRegistry";
import { UserInterface } from "./simulation/ui/UserInterface";
import "../../res/style/style.scss";
import { fixEveryPreload } from "./core/utils";
import { NodePlayground } from "./simulation/ui/NodePlayground";
import { VectorI2D } from "./core/vector2D";

export class Main {
    private fpsCounter = new FPSCounter();
    private userInterface = new UserInterface();
    private playground = new NodePlayground();
    private mainRenderer!: MainRenderer;

    public initialize(): void {
        // if (!this.bigEnoughScreen()) {
        //     throw new Error("Your screen is too small!");
        // }

        GlobalVariables.resolution = new VectorI2D(0, 0);
        GlobalVariables.canvas = this.playground.mainCanvas;
        GlobalVariables.ctx = GlobalVariables.canvas.getContext();
        const mouse = new Mouse();

        mouse.initialize();
        GlobalVariables.mouse = mouse;

        this.mainRenderer = new MainRenderer();

        UniformRegistry.initialize();
        this.mainRenderer.initialize();

        fixEveryPreload();
        this.startRunning();
    }

    public startRunning(): void {
        const dt = this.fpsCounter.start();
        GlobalVariables.time += dt / 1000;

        this.mainRenderer.frameUpdate();

        requestAnimationFrame(() => this.startRunning());
    }

    private bigEnoughScreen(): boolean {
        const screenWidth = window.innerWidth;
        console.log(screenWidth);
        return screenWidth > 600;
    }
}