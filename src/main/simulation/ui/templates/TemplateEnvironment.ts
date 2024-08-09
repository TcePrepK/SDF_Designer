import {ButtonType} from "../../../core/mouse";
import {getElementById, getElementByQuery} from "../../../core/utils";
import {AttachedMouse} from "../../utils/AttachedMouse";
import {NodeConnection} from "../nodes/NodeConnection";

export class TemplateEnvironment {
    public readonly canvas: HTMLCanvasElement;
    public readonly ctx: CanvasRenderingContext2D;
    private readonly mouse = new AttachedMouse();

    private readonly background: HTMLDivElement;

    private activeState = false;

    private width = 0;
    private height = 0;

    private x = 0;
    private y = 0;

    private readonly nodeConnections: NodeConnection[] = [];

    private grabbing = false;

    public constructor() {
        this.canvas = getElementById("playground-canvas");
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.background = getElementByQuery("#node-playground #background");

        const playground = getElementById("node-playground");
        this.mouse.attachElement(playground);

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.initialize();
    }

    public initialize(): void {
        { // Window resize
            window.addEventListener("resize", () => {
                this.width = window.innerWidth;
                this.height = window.innerHeight;
                this.canvas.width = this.width;
                this.canvas.height = this.height;
                // this.ctx.reset();
                this.ctx.translate(this.width / 2, this.height / 2);
            });
            // this.ctx.reset();
            this.ctx.translate(this.width / 2, this.height / 2);
        }

        { // Mouse
            this.mouse.onDown = (button: ButtonType) => {
                if (this.activeState && button === ButtonType.RIGHT) this.grabbing = true;
            };

            this.mouse.onUp = (button: ButtonType) => {
                if (this.activeState && button === ButtonType.RIGHT) this.grabbing = false;
            };

            this.mouse.onLeave = () => {
                this.grabbing = false;
            };

            this.mouse.onMove = (_, dx: number, dy: number) => {
                if (!this.activeState || !this.grabbing) return;
                this.x += dx;
                this.y += dy;
            };
        }
    }

    public updateFrame(): void {
        this.ctx.clearRect(-this.width / 2, -this.height / 2, this.width, this.height);
        this.ctx.save();
        this.ctx.translate(this.x, this.y);

        this.handleBackground();
        this.nodeConnections.forEach(connection => connection.render(this.ctx));

        this.ctx.restore();
    }

    private handleBackground(): void {
        this.background.style.left = `${this.x}px`;
        this.background.style.top = `${this.y}px`;

        this.lines(128, 2, "#454570");
        this.lines(32, 1, "#353560");
    }

    private lines(size: number, width: number, color: string): void {
        const ctx = this.ctx;
        ctx.strokeStyle = color;
        ctx.lineWidth = width;

        const w = this.width / 2;
        const h = this.height / 2;

        const left = Math.floor(-w / size) * size;
        const top = Math.floor(-h / size) * size;
        const right = Math.ceil(w / size) * size;
        const bottom = Math.ceil(h / size) * size;

        for (let i = left; i < right; i++) {
            ctx.beginPath();
            ctx.moveTo(i * size, top * size);
            ctx.lineTo(i * size, bottom * size);
            ctx.stroke();
        }

        for (let i = top; i < bottom; i++) {
            ctx.beginPath();
            ctx.moveTo(left * size, i * size);
            ctx.lineTo(right * size, i * size);
            ctx.stroke();
        }
    }

    public activate(): void {
        this.activeState = true;
    }

    public deactivate(): void {
        this.activeState = false;
    }
}