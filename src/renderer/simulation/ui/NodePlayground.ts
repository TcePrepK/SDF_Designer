import { getElementById, getElementByQuery } from "../../core/utils";

export class NodePlayground {
    private readonly body: HTMLDivElement;
    private readonly canvas: HTMLCanvasElement;
    private readonly background: HTMLDivElement;

    public constructor() {
        this.body = getElementById("node-playground");
        this.canvas = getElementById("playground-canvas");
        this.background = getElementByQuery("#node-playground #background");

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        window.addEventListener("resize", () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.drawGridLines();
        });
        this.drawGridLines();
    }

    private drawGridLines(): void {
        const x = 0;
        const y = 0;

        this.background.style.left = `${x}px`;
        this.background.style.top = `${y}px`;
        this.lines(x, y, 128, 2, "#454570");
        this.lines(x, y, 32, 1, "#353560");
    }

    private lines(x: number, y: number, size: number, width: number, color: string): void {
        const ctx = this.canvas.getContext("2d")!;
        const w = this.canvas.width;
        const h = this.canvas.height;

        const ox = (x - w / 2) % size;
        const oy = (y - h / 2) % size;

        ctx.strokeStyle = color;
        ctx.lineWidth = width;

        for (let i = ox; i < w; i += size) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, h);
            ctx.stroke();
        }

        for (let i = oy; i < h; i += size) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(w, i);
            ctx.stroke();
        }
    }
}