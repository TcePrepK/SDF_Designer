import {getElementById, getElementByQuery, toggleClass} from "../../../core/utils";
import {AttachedMouse} from "../../utils/AttachedMouse";
import {ButtonType} from "../../../core/mouse";
import {VisualNode} from "./VisualNode";

export class NodeInterface {
    private body!: HTMLDivElement;
    private selection!: HTMLDivElement;

    private allNodes: VisualNode[] = [];

    private expanded = false;
    private toggleable = true;

    private lastScrollY = 0;
    private grabbingSelection = false;

    public initialize(): void {
        this.body = getElementById("node-interface");
        this.selection = getElementByQuery("#node-interface #selection");

        { // Selection
            const attachedMouse = new AttachedMouse().attachElement(this.selection);
            attachedMouse.onDown = () => this.grabbingSelection = true;
            attachedMouse.onMove = this.selectionDrag.bind(this);

            window.addEventListener("mouseup", () => this.grabbingSelection = false);

            this.selection.addEventListener("scroll", this.fixScrollFading.bind(this));
            window.addEventListener("resize", this.fixScrollFading.bind(this));
        }

        { // Playground
            const playground = getElementById("node-playground");
            const playgroundMouse = new AttachedMouse().attachElement(playground);
            playgroundMouse.onUp = () => !this.grabbingSelection ? this.toggleSelection(true) : null;
            playgroundMouse.onMove = this.selectionDrag.bind(this);
        }

        { // Handle
            const handle = getElementById("drawer-handle");
            handle.addEventListener("click", () => this.toggleSelection());
        }

        this.removeLater();
    }

    public update(): void {
        if (this.grabbingSelection) return;
        if (Math.abs(this.lastScrollY) <= 0.1) return;

        this.fixScrollFading();
        this.lastScrollY -= Math.sign(this.lastScrollY) * 0.15;
        this.selection.scrollBy(0, this.lastScrollY);
    }

    private removeLater(): void {
        for (let i = 0; i < 15; i++) {
            const inputAmount = Math.floor(Math.random() * 3) + 1;
            const node = new VisualNode("Node", inputAmount, 1, this.selection);
            this.allNodes.push(node);
        }
        this.fixScrollFading();

        // for (let i = 0; i < 15; i++) {
        //     this.createNewTemplate();
        // }
    }

    private selectionDrag(button: ButtonType, _: number, dy: number): void {
        if (!this.grabbingSelection) return;
        if (button !== ButtonType.LEFT) return;
        this.lastScrollY = -dy;

        this.selection.scrollBy(0, this.lastScrollY);
    }

    private fixScrollFading(): void {
        const selectionRect = this.selection.getBoundingClientRect();
        for (const node of this.allNodes) {
            const nodeRect = node.getHitBox();
            const topDiff = selectionRect.top - nodeRect.top;
            const bottomDiff = nodeRect.bottom - selectionRect.bottom;
            const diff = Math.max(topDiff, bottomDiff);

            if (diff > 0) {
                let alpha = diff / nodeRect.height / 0.6;
                alpha = Math.min(1, Math.max(0, alpha));
                node.setScaleMultiplier(1 - alpha * 0.15);
            } else {
                node.setScaleMultiplier(1);
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