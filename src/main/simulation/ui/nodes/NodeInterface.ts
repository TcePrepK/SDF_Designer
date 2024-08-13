import {getElementById, getElementByQuery, toggleClass} from "../../../core/utils";
import {NodeCreator} from "./NodeCreator";
import {AttachedMouse} from "../../utils/AttachedMouse";
import {Root} from "../../root";
import {TemplateNode} from "./TemplateNode";
import {ButtonType} from "../../../core/mouse";
import {NodeData} from "./NodeData";

export class NodeInterface {
    private root!: Root;

    private body!: HTMLDivElement;
    private selection!: HTMLDivElement;

    private allNodes: NodeData[] = [];

    private expanded = false;
    private toggleable = true;

    private dragging: TemplateNode | null = null;

    public initialize(root: Root): void {
        this.root = root;

        this.body = getElementById("node-interface");
        this.selection = getElementByQuery("#node-interface #selection");

        { // Selection
            this.selection.addEventListener("scroll", this.fixScrollFading.bind(this));
            window.addEventListener("resize", this.fixScrollFading.bind(this));
        }

        { // Handle
            const handle = getElementById("drawer-handle");
            handle.addEventListener("click", () => this.toggleSelection());
        }

        { // Closing Selection
            const playground = getElementById("node-playground");
            const attachment = AttachedMouse.getAttachment(playground);
            attachment.onUp = this.toggleSelection.bind(this, true);
        }

        { // Dragging Node
            const windowMouse = this.root.windowMouse;
            windowMouse.onLeave = () => {
                if (!this.dragging) return;
                this.dragging.stopDragging();
                this.dragging = null;
            };
        }

        this.removeLater();
    }

    private removeLater(): void {
        for (let i = 0; i < 15; i++) {
            const inputAmount = Math.floor(Math.random() * 3) + 1;
            this.setupNode("Node", inputAmount, 1);
        }
        this.fixScrollFading();

        // for (let i = 0; i < 15; i++) {
        //     this.createNewTemplate();
        // }
    }

    private setupNode(name: string, inputAmount: number, outputAmount: number): NodeData {
        const node = NodeCreator.createData(name, inputAmount, outputAmount, this.selection);
        this.allNodes.push(node);

        let interval: NodeJS.Timeout | null = null;
        const nodeBody = node.body;
        const nodeAttached = AttachedMouse.getAttachment(nodeBody);
        nodeAttached.onDownRaw = event => {
            if (event.button !== ButtonType.LEFT) return;
            interval = setTimeout(() => {
                this.dragging = NodeCreator.createTemplateNode(node);
                this.dragging.initialize(this.root, event);

                this.toggleSelection(false);
            }, 100);
        };

        nodeAttached.onClick = () => {
            if (interval) clearInterval(interval);
        };

        return node;
    }

    private fixScrollFading(): void {
        const selectionRect = this.selection.getBoundingClientRect();
        for (const node of this.allNodes) {
            const nodeRect = node.body.getBoundingClientRect();
            const topDiff = selectionRect.top - nodeRect.top;
            const bottomDiff = nodeRect.bottom - selectionRect.bottom;
            const diff = Math.max(topDiff, bottomDiff);

            if (diff > 0) {
                let alpha = diff / nodeRect.height / 0.6;
                alpha = Math.min(1, Math.max(0, alpha));
                node.body.style.setProperty("--node-scale-multiplier", String(1 - alpha * 0.15));
            } else {
                node.body.style.setProperty("--node-scale-multiplier", "1");
            }
        }
    }

    public toggleSelection(outside = false): void {
        if (!this.toggleable) return;
        if (outside && !this.expanded) return;
        this.toggleable = false;

        this.expanded = !this.expanded;
        if (this.expanded) {
            this.getAudio("opening").play();
        } else {
            this.getAudio("closing").play();
        }

        getElementById("node-playground").style.filter = `blur(${this.expanded ? 2 : 0}px)`;

        setTimeout(() => this.toggleable = true, 400);
        toggleClass(this.body, "expanded");
    }

    private getAudio(state: string): HTMLAudioElement {
        return getElementById(`drawer-${state}`);
    }
}