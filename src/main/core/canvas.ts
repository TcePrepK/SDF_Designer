import { Signal } from "./signal";
import { checkFor, createCanvas, ElementArgs } from "./utils";

export type DrawParameters = {
    width: number;
    height: number;
    ctx: WebGL2RenderingContext;
};

export class Canvas {
    private mainCanvas!: HTMLCanvasElement;

    public WIDTH!: number;
    public HEIGHT!: number;

    public onResize = new Signal<[width: number, height: number]>();

    public initialize(data: Partial<HTMLCanvasElement> & ElementArgs = {}): void {
        if (!data.parent) data.parent = document.body;
        this.mainCanvas = createCanvas(data);

        checkFor(this.getWebGLContext(), "Unable to initialize WebGL. Your browser or machine may not support it.");
    }

    public getWebGLContext(): WebGL2RenderingContext {
        return this.mainCanvas.getContext("webgl2")!;
    }

    public getWebGLDrawParameters(): DrawParameters {
        return {
            width: this.mainCanvas.width,
            height: this.mainCanvas.height,
            ctx: this.getWebGLContext()
        };
    }
}