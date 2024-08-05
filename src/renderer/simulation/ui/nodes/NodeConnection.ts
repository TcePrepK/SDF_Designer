import { TemplateNode } from "./TemplateNode";

export class NodeConnection {
    private from: TemplateNode;
    private to: TemplateNode;

    public constructor(from: TemplateNode, to: TemplateNode) {
        this.from = from;
        this.to = to;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#f00";
        ctx.fillRect(0, 0, 10, 10);
    }
}