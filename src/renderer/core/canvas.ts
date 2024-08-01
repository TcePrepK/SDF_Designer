import { checkFor, createCanvas } from "./utils";
import { VectorI2D } from "./vector2D";
import { Signal } from "./signal";

export class Canvas {
    private mainCanvas!: HTMLCanvasElement;
    private context!: WebGL2RenderingContext;

    public WIDTH!: number;
    public HEIGHT!: number;

    public onResize = new Signal<[width: number, height: number]>();
    private resizeTimeout!: NodeJS.Timeout;

    public initialize(parent: HTMLElement | null = null): void {
        if (!parent) parent = document.body;
        this.mainCanvas = createCanvas({ parent });
        this.updateResolution();

        this.context = this.mainCanvas.getContext("webgl2") as WebGL2RenderingContext;
        checkFor(this.context, "Unable to initialize WebGL. Your browser or machine may not support it.");

        parent.addEventListener("resize", () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(this.updateResolution.bind(this), 100);
        });
    }

    private updateResolution(): void {
        this.WIDTH = Math.min(600, window.innerWidth * 0.8);
        this.WIDTH = 0;
        this.HEIGHT = this.WIDTH;
        this.mainCanvas.width = this.WIDTH;
        this.mainCanvas.height = this.HEIGHT;

        this.onResize.dispatch(this.WIDTH, this.HEIGHT);
    }

    public getContext(): WebGL2RenderingContext {
        return this.context;
    }

    public getResolution(): VectorI2D {
        return new VectorI2D(this.WIDTH, this.HEIGHT);
    }

    public getElement(): HTMLCanvasElement {
        return this.mainCanvas;
    }
}