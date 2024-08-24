import {getElementById, getElementByQuery, toggleClass} from "../../core/utils";
import {NodeCreator, NodeData} from "./NodeCreator";
import {AttachedMouse} from "../utils/AttachedMouse";
import {Root} from "../root";
import {TemplateNode} from "./TemplateNode";
import {ButtonType} from "../../core/mouse";

export enum Category {
    ALL = "All",
    NONE = "None",
    LOGIC = "Logic",
    MATH = "Math",
}

export type NodeParams = {
    name: string;
    inputs: Array<string | null>;
    outputs: Array<string>;
    hasCanvas: boolean;
    category: Exclude<Category, Category.ALL>;
};

export class NodeInterface {
    private root!: Root;

    private body!: HTMLDivElement;
    private selection!: HTMLDivElement;

    private allNodes: NodeData[] = [];
    private categoryToNodes: Map<Category, NodeData[]> = new Map();
    private currentCategory: Category = Category.ALL;

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

        { // Catergories
            this.setupCategory("all", Category.ALL);
            this.setupCategory("logic", Category.LOGIC);
            this.setupCategory("math", Category.MATH);
        }
    }

    private setupCategory(name: string, category: Category): void {
        this.categoryToNodes.set(category, []);

        let timeout: NodeJS.Timeout | null = null;
        const element = getElementById(`category-${name}`);
        element.addEventListener("click", () => {
            for (const node of this.allNodes) {
                node.holder!.classList.add("hidden");
                node.body.classList.add("wobble");
            }

            const nodes = this.categoryToNodes.get(category)!;
            for (const node of nodes) {
                const classes = node.holder!.classList;
                classes.remove("hidden");
            }

            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                for (const node of this.allNodes) {
                    node.body.classList.remove("wobble");
                }
            }, 0);
            this.fixScrollFading();
        });
    }

    public setupNode(params: NodeParams): NodeData {
        const node = NodeCreator.createData(params, this.selection);

        { // Categories
            this.allNodes.push(node);
            if (params.category !== Category.NONE) {
                this.categoryToNodes.get(Category.ALL)!.push(node);
                this.categoryToNodes.get(params.category)!.push(node);
            }
        }

        { // Dragging
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
        }

        return node;
    }

    private fixScrollFading(): void {
        const nodes = this.categoryToNodes.get(this.currentCategory)!;
        const selectionRect = this.selection.getBoundingClientRect();
        for (const node of nodes) {
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