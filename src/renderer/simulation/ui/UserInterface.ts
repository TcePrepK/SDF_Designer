import { createDiv, getElementById, getElementByQuery, toggleClass } from "../../core/utils";
import { AttachedMouse } from "../utils/AttachedMouse";
import { ButtonType } from "../../core/mouse";

export class UserInterface {
    private body!: HTMLDivElement;
    private header!: HTMLDivElement;
    private selection!: HTMLDivElement;

    private allNodes: HTMLElement[] = [];

    private expanded = true;
    private toggleable = true;

    private lastScrollY = 0;
    private currentlyScrolling = false;

    public initialize(): void {
        this.body = getElementById("user-interface");
        // toggleClass(this.body, "expanded"); // TODO: Remove comment

        this.header = getElementByQuery("#user-interface #header");
        this.selection = getElementByQuery("#user-interface #selection");

        const attachedMouse = new AttachedMouse().attachElement(this.selection);
        attachedMouse.onMouseDrag.add((this.selectionDrag.bind(this)));
        attachedMouse.onMouseButtonUp.add((this.selectionUp.bind(this)));

        const handle = getElementById("drawer-handle");
        handle.addEventListener("click", () => this.toggleExpanded());

        this.removeLater();
    }

    public update(): void {
        if (this.currentlyScrolling) return;
        if (Math.abs(this.lastScrollY) <= 0.1) return;

        this.fixScrollFading();
        this.lastScrollY -= Math.sign(this.lastScrollY) * 0.1;
        this.selection.scrollBy(0, this.lastScrollY);
    }

    private removeLater(): void {
        for (let i = 0; i < 15; i++) {
            const node = this.createNode("Node", 2, 1);
            this.allNodes.push(node);
        }

        this.fixScrollFading();
        this.selection.addEventListener("scroll", this.fixScrollFading.bind(this));
        window.addEventListener("resize", this.fixScrollFading.bind(this));
    }

    private selectionDrag(button: ButtonType, _: number, dy: number): void {
        if (button !== ButtonType.LEFT) return;
        this.currentlyScrolling = true;
        this.lastScrollY = -dy;

        this.selection.scrollBy(0, this.lastScrollY);
    }

    private selectionUp(button: ButtonType): void {
        if (button !== ButtonType.LEFT) return;
        this.currentlyScrolling = false;
    }

    private fixScrollFading(): void {
        const selectionRect = this.selection.getBoundingClientRect();
        for (const node of this.allNodes) {
            const nodeRect = node.getBoundingClientRect();
            const topDiff = selectionRect.top - nodeRect.top;
            const bottomDiff = nodeRect.bottom - selectionRect.bottom;
            const diff = Math.max(topDiff, bottomDiff);

            if (diff > 0) {
                let alpha = diff / nodeRect.height / 0.6;
                alpha = Math.min(1, Math.max(0, alpha));
                node.style.setProperty("--node-max-scale", String(1 - alpha * 0.1));
            } else {
                node.style.setProperty("--node-max-scale", "1");
            }
        }
    }

    private createNode(name: string, inputs: number, outputs: number): HTMLElement {
        const nodeHolder = createDiv({ classes: ["holder"], parent: this.selection });
        const node = createDiv({ classes: ["node", "preload"], parent: nodeHolder },
            createDiv({ classes: ["name"], innerText: name })
        );

        const inputPort = createDiv({ classes: ["input_ports"], parent: node });
        const outputPort = createDiv({ classes: ["output_ports"], parent: node });

        for (let i = 0; i < inputs; i++) {
            createDiv({ classes: ["input"], parent: inputPort });
        }

        for (let i = 0; i < outputs; i++) {
            createDiv({ classes: ["output"], parent: outputPort });
        }

        return node;
    }

    public toggleExpanded(): void {
        if (!this.toggleable) return;
        this.toggleable = false;

        this.expanded = !this.expanded;
        if (this.expanded) {
            this.getAudio("opening").play();
        } else {
            this.getAudio("closing").play();
        }

        getElementById("node-playground").style.filter = `blur(${this.expanded ? 0 : 1}px)`;

        setTimeout(() => this.toggleable = true, 400);
        toggleClass(this.body, "expanded");
    }

    private getAudio(state: string): HTMLAudioElement {
        return getElementById(`drawer-${state}`);
    }
}