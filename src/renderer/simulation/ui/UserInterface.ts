import { createDiv, getElementById, toggleClass } from "../../core/utils";

export class UserInterface {
    private readonly body!: HTMLDivElement;
    private readonly header!: HTMLDivElement;
    private readonly selection!: HTMLDivElement;

    private allNodes: HTMLElement[] = [];

    private expanded = true;
    private toggleable = true;

    public constructor() {
        this.body = getElementById("user-interface");
        toggleClass(this.body, "expanded");

        this.header = createDiv({ id: "header", parent: this.body });
        this.selection = createDiv({ id: "selection", parent: this.body });

        const handle = getElementById("drawer-handle");
        handle.addEventListener("click", () => this.toggleExpanded());

        this.removeLater();
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

    private fixScrollFading(): void {
        const selectionRect = this.selection.getBoundingClientRect();
        for (const node of this.allNodes) {
            const nodeRect = node.getBoundingClientRect();
            const topDiff = selectionRect.top - nodeRect.top;
            const bottomDiff = nodeRect.bottom - selectionRect.bottom;
            const diff = Math.max(topDiff, bottomDiff);

            node.style.opacity = "1";
            if (diff > 0) {
                const height = nodeRect.height * 0.8;
                node.style.opacity = String(1 - diff / height);
            }
        }
    }

    private createNode(name: string, inputs: number, outputs: number): HTMLElement {
        const node = createDiv({ classes: ["node", "preload"], parent: this.selection },
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
        setTimeout(() => this.toggleable = true, 400);
        toggleClass(this.body, "expanded");
    }

    private getAudio(state: string): HTMLAudioElement {
        return getElementById(`drawer-${state}`);
    }
}