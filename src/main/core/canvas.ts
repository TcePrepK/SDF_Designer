import {Signal} from "./signal";
import {createCanvas, ElementArgs} from "./htmlUtils";

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
        this.mainCanvas = createCanvas();
    }
}