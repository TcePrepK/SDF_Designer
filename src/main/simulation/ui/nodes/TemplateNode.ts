import {AttachedMouse} from "../../utils/AttachedMouse";
import {ButtonType} from "../../../core/mouse";
import {Root} from "../../root";
import {getElementById} from "../../../core/utils";
import {NodeData} from "./NodeCreator";

export class TemplateNode {
    private data: NodeData;
    public body: HTMLDivElement;
    private dragDiv!: HTMLDivElement;

    private root!: Root;

    private relativeX = 0;
    private relativeY = 0;
    private centerX: number;
    private centerY: number;

    private dragging = false;
    private dragX = 0;
    private dragY = 0;

    private grabBlock = false;

    public constructor(data: NodeData, x: number, y: number) {
        this.dragDiv = getElementById("node-drag");

        this.data = data;
        this.body = data.body;

        this.centerX = x;
        this.centerY = y;

        this.updateTransform();
        this.body.classList.add("template");
    }

    public initialize(root: Root, event: MouseEvent): void {
        this.root = root;

        const windowMouse = root.windowMouse;
        { // Dragging
            // When initialize called, the node is already in dragging state
            this.startDragging(event);

            const attach = AttachedMouse.getAttachment(this.data.body);
            attach.onUp = button => {
                if (button !== ButtonType.LEFT) return;
                this.stopDragging();
            };

            attach.onDownRaw = event => {
                if (event.button !== ButtonType.LEFT || this.grabBlock) return;

                this.root.nodeInterface.toggleSelection(true);
                this.startDragging(event);
            };

            windowMouse.onMoveRaw = event => {
                if (!this.dragging) return;
                this.updatePosition(event.clientX + this.dragX, event.clientY + this.dragY);
            };
        }

        { // Ports
            const allPorts = [...this.data.inputs, ...this.data.outputs];
            allPorts.forEach(port => {
                const attach = AttachedMouse.getAttachment(port.port);
                attach.onDownRaw = event => {
                    if (event.button !== ButtonType.LEFT) return;
                    this.grabBlock = true;

                    const template = this.root.activeTemplate;
                    const connectionManager = template.getConnectionManager();
                    const stopConnection = connectionManager.toggleConnection(port);
                    if (!stopConnection) event.stopPropagation();
                };

                windowMouse.onUp = button => {
                    if (button !== ButtonType.LEFT) return;
                    this.grabBlock = false;
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

    public activate(): void {
        this.body.style.display = "flex";
    }

    public deactivate(): void {
        this.body.style.display = "none";
    }
}