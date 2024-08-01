import { getElementById, toggleClass } from "../../core/utils";

export class UserInterface {
    private readonly body!: HTMLDivElement;

    private expanded = true;
    private toggleable = true;

    public constructor() {
        this.body = getElementById("user-interface");
        toggleClass(this.body, "expanded");

        const handle = getElementById("drawer-handle");
        handle.addEventListener("click", () => this.toggleExpanded());
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
        setTimeout(() => this.toggleable = true, 600);
        toggleClass(this.body, "expanded");
    }

    private getAudio(state: string): HTMLAudioElement {
        return getElementById(`drawer-${state}`);
    }
}