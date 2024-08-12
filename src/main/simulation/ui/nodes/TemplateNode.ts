import {AttachedMouse} from "../../utils/AttachedMouse";
import {ButtonType} from "../../../core/mouse";
import {Root} from "../../root";
import {getElementById} from "../../../core/utils";
import {NodeData} from "./NodeData";

export class TemplateNode {
    public readonly body!: HTMLElement;
    private dragDiv!: HTMLDivElement;

    private root!: Root;
    private data: NodeData;

    private relativeX = 0;
    private relativeY = 0;
    private centerX: number;
    private centerY: number;

    private dragging = false;
    private dragX = 0;
    private dragY = 0;

    public constructor(data: NodeData, body: HTMLDivElement, x: number, y: number) {
        this.dragDiv = getElementById("node-drag");

        this.data = data;
        this.body = body;

        this.centerX = x;
        this.centerY = y;

        this.updateTransform();
        this.body.classList.add("template");
    }

    public initialize(root: Root, event: MouseEvent): void {
        this.root = root;

        { // Dragging
            this.startDragging(event);

            const attach = AttachedMouse.getAttachment(this.body);
            attach.onUp = button => {
                if (button !== ButtonType.LEFT) return;
                this.stopDragging();
            };

            attach.onDownRaw = event => {
                if (event.button !== ButtonType.LEFT) return;
                this.root.nodeInterface.toggleSelection(true);
                this.startDragging(event);
            };

            const windowMouse = root.windowMouse;
            windowMouse.onMoveRaw = event => {
                if (!this.dragging) return;
                this.updatePosition(event.clientX + this.dragX, event.clientY + this.dragY);
            };
        }

        { // Ports
            const allPorts = [...this.data.inputs, ...this.data.outputs];
            allPorts.forEach(port => {
                const attach = AttachedMouse.getAttachment(port);
                attach.onDownRaw = event => {
                    if (event.button !== ButtonType.LEFT) return;
                    this.root.nodeInterface.toggleSelection(true);
                    this.startDragging(event);
                };
            });
        }
    }

    public startDragging(event: MouseEvent): void {
        if (this.dragging) return;

        this.root.templateInterface.removeTemplateNode(this);
        this.dragDiv.appendChild(this.body);

        this.body.classList.add("dragging");
        this.dragging = true;

        this.dragX = this.centerX - event.clientX;
        this.dragY = this.centerY - event.clientY;
    }

    public stopDragging(): void {
        if (!this.dragging) return;

        this.dragDiv.removeChild(this.body);
        this.root.templateInterface.addTemplateNode(this);

        this.body.classList.remove("dragging");
        this.dragging = false;
    }

    public updatePosition(dx: number, dy: number): void {
        this.centerX = dx;
        this.centerY = dy;
        this.updateTransform();
    }

    public updateRelative(relativeX: number, relativeY: number): void {
        this.relativeX += relativeX;
        this.relativeY += relativeY;
        this.updateTransform();
    }

    private updateTransform(): void {
        const centerX = this.centerX + this.relativeX;
        const centerY = this.centerY + this.relativeY;
        this.body.style.left = `${centerX}px`;
        this.body.style.top = `${centerY}px`;
    }
}