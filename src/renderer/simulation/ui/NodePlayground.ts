import { createCanvas, getElementById } from "../../core/utils";
import { Canvas } from "../../core/canvas";

export class NodePlayground {
    private body: HTMLDivElement;

    mainCanvas: Canvas;

    public constructor() {
        this.body = getElementById("node-playground");
        this.mainCanvas = new Canvas();

        this.mainCanvas.initialize(this.body);
    }
}