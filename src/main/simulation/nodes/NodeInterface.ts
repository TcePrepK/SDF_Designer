import {getElementById, getElementByQuery, toggleClass} from "../../core/utils";
import {AttachedMouse, ButtonType} from "../../core/AttachedMouse";
import {Root} from "../Root";
import {TemplateNode} from "./TemplateNode";
import {BaseNode} from "./BaseNode";

export enum Category {
    ALL = "All",
    LOGIC = "Logic",
    MATH = "Math",
}

export type NodeInput = {
    name?: string;
    manual?: boolean;
};

export type OperationFunction = (args: Record<string, number>) => number;
export type NodeOutput = {
    name?: string;
    manual?: boolean;
};

export type NodeParams = {
    name: string;
    color: string;
    inputs: Array<NodeInput>;
    outputs: Array<NodeOutput>;
    opp?: OperationFunction;
    category: Exclude<Category, Category.ALL>;
};

export const NoName = "No Name Specified";

export class NodeInterface {
    private root!: Root;

    private body!: HTMLDivElement;
    private selection!: HTMLDivElement;

    private allNodes: BaseNode[] = [];
    private categoryToNodes: Map<Category, BaseNode[]> = new Map();
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

        // TODO: Holder is no more stored, change the css to hide the holder whenever it is empty or in this case everything is hidden.

        let timeout: NodeJS.Timeout | null = null;
        const element = getElementById(`category-${name}`);
        element.addEventListener("click", () => {
            for (const node of this.allNodes) {
                // node.holder!.classList.add("hidden");
                node.body.classList.add("wobble");
            }

            // const nodes = this.categoryToNodes.get(category)!;
            // for (const node of nodes) {
            //     const classes = node.holder!.classList;
            //     classes.remove("hidden");
            // }

            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                for (const node of this.allNodes) {
                    node.body.classList.remove("wobble");
                }
            }, 0);
            this.fixScrollFading();
        });
    }

    public setupNode(params: NodeParams): BaseNode {
        const node = new BaseNode(params.name, params.color).initializeElements(this.selection, params);

        { // Categories
            this.allNodes.push(node);
            this.categoryToNodes.get(Category.ALL)!.push(node);
            this.categoryToNodes.get(params.category)!.push(node);
        }

        { // Dragging
            let interval: NodeJS.Timeout | null = null;
            const nodeBody = node.body;
            const nodeAttached = AttachedMouse.getAttachment(nodeBody);
            nodeAttached.onDownRaw = event => {
                if (event.button !== ButtonType.LEFT) return;
                interval = setTimeout(() => {
                    const w = this.root.windowWidth;
                    const h = this.root.windowHeight;

                    const box = nodeBody.getBoundingClientRect();
                    const centerX = box.left + box.width / 2 - w / 2;
                    const centerY = box.top + box.height / 2 - h / 2;

                    this.dragging = new TemplateNode(node, centerX, centerY);
                    this.dragging.initialize(this.root);
                    this.dragging.startDragging(event);

                    this.toggleSelection(false);
                }, 100);
            };

            nodeAttached.onClick = () => {
                if (interval) clearInterval(interval);
            };
        }

        return node;
    }

    public getNodeByName(name: string): BaseNode | null {
        return this.allNodes.find(node => node.name.toUpperCase() === name.toUpperCase()) ?? null;
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
            // this.getAudio("opening").play();
        } else {
            // this.getAudio("closing").play();
        }

        getElementById("node-playground").style.filter = `blur(${this.expanded ? 2 : 0}px)`;

        setTimeout(() => this.toggleable = true, 400);
        toggleClass(this.body, "expanded");
    }

    private getAudio(state: string): HTMLAudioElement {
        return getElementById(`drawer-${state}`);
    }
}