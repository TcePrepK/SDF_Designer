import {getElementById} from "../../core/utils";
import {AttachedMouse, ButtonType} from "../../core/AttachedMouse";
import {TemplateNode} from "../nodes/TemplateNode";
import {ConnectionManager} from "../connections/ConnectionManager";
import {Root} from "../Root";

export class TemplateEnvironment {
    private root!: Root;

    private readonly background: HTMLDivElement;
    private readonly nodeHolder: HTMLDivElement;

    public readonly canvas: HTMLCanvasElement;
    public readonly ctx: CanvasRenderingContext2D;

    private activeState = false;

    private x = 0;
    private y = 0;

    private readonly templateNodes: TemplateNode[] = [];
    public readonly connectionManager = new ConnectionManager();

    private grabbing = false;

    public constructor() {
        this.background = getElementById("background");
        this.nodeHolder = getElementById("node-holder");

        this.canvas = getElementById("playground-canvas");
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    }

    public initialize(root: Root): void {
        this.root = root;
        this.connectionManager.initialize(this.root);

        { // Window resize
            const w = this.root.windowWidth;
            const h = this.root.windowHeight;
            this.canvas.width = w;
            this.canvas.height = h;
            this.ctx.translate(w / 2, h / 2);

            this.root.windowMouse.onResize = (w, h) => {
                this.canvas.width = w;
                this.canvas.height = h;
                this.ctx.translate(w / 2, h / 2);
            };
        }

        { // Canvas movement
            const playground = getElementById("node-playground");
            const attachment = AttachedMouse.getAttachment(playground);

            attachment.onDown = (button: ButtonType) => {
                if (this.activeState && button === ButtonType.RIGHT) this.grabbing = true;
            };

            attachment.onUp = (button: ButtonType) => {
                if (this.activeState && button === ButtonType.RIGHT) this.grabbing = false;
            };

            attachment.onLeave = () => this.grabbing = false;

            attachment.onMove = (dx: number, dy: number) => {
                if (!this.activeState || !this.grabbing) return;
                this.x += dx;
                this.y += dy;

                this.templateNodes.forEach(node => node.updateRelative(dx, dy));
            };
        }

        { // Initial Nodes
            const nodeInterface = this.root.nodeInterface;
            const data = nodeInterface.getNodeByName("pixel")!;
            const templateNode = new TemplateNode(data, 0, 0).initialize(this.root);
            templateNode.setupPixelNode();
            this.addNode(templateNode);
        }
    }

    public updateFrame(): void {
        const w = this.root.windowWidth / 2;
        const h = this.root.windowHeight / 2;

        // Clear canvas
        this.ctx.clearRect(-w, -h, 2 * w, 2 * h);

        { // Render background lines
            this.ctx.save();
            this.ctx.translate(this.x, this.y);

            this.renderGrids();

            this.ctx.restore();
        }

        { // Render connections
            this.ctx.save();
            this.ctx.translate(-w, -h);

            this.connectionManager.render(this.ctx);

            this.ctx.restore();
        }
    }

    public addNode(node: TemplateNode): void {
        if (this.templateNodes.includes(node)) return;
        this.nodeHolder.appendChild(node.body);
        this.templateNodes.push(node);
    }

    public removeNode(node: TemplateNode): void {
        if (!this.templateNodes.includes(node)) return;
        this.nodeHolder.removeChild(node.body);
        this.templateNodes.splice(this.templateNodes.indexOf(node), 1);
    }

    private renderGrids(): void {
        this.background.style.left = `${this.x}px`;
        this.background.style.top = `${this.y}px`;

        this.lines(128, 2, "#454570");
        this.lines(32, 1, "#353560");
    }

    private lines(size: number, width: number, color: string): void {
        const ctx = this.ctx;
        ctx.strokeStyle = color;
        ctx.lineWidth = width;

        const w = this.root.windowWidth / 2;
        const h = this.root.windowHeight / 2;

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
        this.templateNodes.forEach(node => node.activate());
    }

    public deactivate(): void {
        this.activeState = false;
        this.templateNodes.forEach(node => node.deactivate());
    }
}