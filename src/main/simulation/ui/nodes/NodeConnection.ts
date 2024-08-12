import {VisualNode} from "./VisualNode";

export class NodeConnection {
    private from: VisualNode;
    private to: VisualNode;

    public constructor(from: VisualNode, to: VisualNode) {
        this.from = from;
        this.to = to;
    }

    public render(ctx: CanvasRenderingContext2D): void {
        // const xa = this.from.x;
        // const xb = this.to.x;
        // const ya = this.from.y;
        // const yb = this.to.y;
        // const dist = Math.sqrt((xa - xb) ** 2 + (ya - yb) ** 2);
        // const totalTime = Math.round(dist / 15);
        //
        // for (let i = 0; i <= totalTime; i++) {
        //     const t = i / totalTime;
        //
        //     // Cubic Bezier
        //     const x = xa * (1 - t) ** 3 + 3 * (xa + xb) / 2 * (1 - t) * t + xb * t ** 3;
        //     const y = ya * (1 - t) ** 2 * (1 + 2 * t) + yb * t * t * (3 - 2 * t);
        //
        //     ctx.strokeStyle = "#999";
        //     ctx.lineWidth = 2;
        //
        //     ctx.beginPath();
        //     ctx.arc(x, y, 5, 0, 2 * Math.PI);
        //     ctx.stroke();
        // }
    }
}