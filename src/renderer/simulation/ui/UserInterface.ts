import { ButtonType } from "../../core/mouse";
import { createDiv, getElementById, getElementByQuery, toggleClass } from "../../core/utils";
import { AttachedMouse } from "../utils/AttachedMouse";
import { calculateFontColor, PossibleColors } from "./nodes/Node";

export class UserInterface {
    private body!: HTMLDivElement;
    private header!: HTMLDivElement;
    private selection!: HTMLDivElement;
    private buffer!: HTMLDivElement;

    private allNodes: HTMLElement[] = [];

    private expanded = false;
    private toggleable = true;

    private lastScrollY = 0;
    private grabbingSelection = false;
    private editingBuffer = false;

    public initialize(): void {
        this.body = getElementById("user-interface");
        this.header = getElementByQuery("#user-interface #header");
        this.selection = getElementByQuery("#user-interface #selection");
        this.buffer = getElementById("buffer-interface");

        { // Selection
            const attachedMouse = new AttachedMouse().attachElement(this.selection);
            attachedMouse.onMouseButtonDown.add(() => this.grabbingSelection = true);
            attachedMouse.onMouseMove.add(this.selectionDrag.bind(this));
            window.addEventListener("mouseup", () => this.grabbingSelection = false);

            this.selection.addEventListener("scroll", this.fixScrollFading.bind(this));
            window.addEventListener("resize", this.fixScrollFading.bind(this));
        }

        { // Playground
            const playground = getElementById("node-playground");
            const playgroundMouse = new AttachedMouse().attachElement(playground);
            playgroundMouse.onMouseButtonUp.add(() => !this.grabbingSelection ? this.toggleSelection(true) : null);
            playgroundMouse.onMouseMove.add(this.selectionDrag.bind(this));
        }

        { // Buffer
            const bufferHitBox = getElementById("buffer-hit-box");
            const bufferMouse = new AttachedMouse().attachElement(bufferHitBox);
            bufferMouse.onMouseEnter.add(this.toggleBuffer.bind(this, true));
            bufferMouse.onMouseLeave.add(this.toggleBuffer.bind(this, false));

            const plus = getElementById("buffer-more");
            plus.addEventListener("click", () => this.createNewTemplate());
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
            const node = this.createNode("Node", inputAmount, 1);
            this.allNodes.push(node);
        }
        this.fixScrollFading();

        for (let i = 0; i < 15; i++) {
            this.createNewTemplate();
        }
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
            const nodeRect = node.getBoundingClientRect();
            const topDiff = selectionRect.top - nodeRect.top;
            const bottomDiff = nodeRect.bottom - selectionRect.bottom;
            const diff = Math.max(topDiff, bottomDiff);

            if (diff > 0) {
                let alpha = diff / nodeRect.height / 0.6;
                alpha = Math.min(1, Math.max(0, alpha));
                node.style.setProperty("--node-max-scale", String(1 - alpha * 0.15));
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

        const color = PossibleColors[Math.floor(Math.random() * PossibleColors.length)];
        const textColor = calculateFontColor(color);
        node.style.setProperty("--node-name-color", textColor);
        node.style.setProperty("--node-color", color);

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

    public createNewTemplate(): void {
        const plus = getElementById("buffer-more");
        const container = getElementById("container");
        container.removeChild(plus);
        const template = createDiv({ classes: ["buffer"], contentEditable: "true", parent: container });
        container.appendChild(plus);

        template.addEventListener("keypress", e => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            template.blur();
        });
        template.addEventListener("focus", () => this.buffer.classList.add("expanded-edit"));
        template.addEventListener("blur", () => this.buffer.classList.remove("expanded-edit"));

        template.focus();
    }

    public toggleBuffer(state: boolean): void {
        const classList = this.buffer.classList;
        if (classList.contains("expanded") === state) return;

        if (state) {
            this.buffer.classList.add("expanded");
        } else {
            this.buffer.classList.remove("expanded");
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