import {ButtonType} from "../../core/mouse";
import {Signal} from "../../core/signal";

export class AttachedMouse {
    public x = 0;
    public y = 0;

    public onMouseDrag = new Signal<[ButtonType, number, number]>();

    private isDragging = false;
    private draggingButton!: ButtonType;

    private element!: HTMLElement;

    public attachElement(element: HTMLElement): AttachedMouse {
        this.element = element;

        this.onMouseMove = (_, dx, dy) => {
            this.x += dx;
            this.y += dy;
            if (this.isDragging) this.onMouseDrag.dispatch(this.draggingButton, dx, dy);
        };

        this.onMouseButtonDown = b => {
            if (this.isDragging) return;
            this.isDragging = true;
            this.draggingButton = b as ButtonType;
        };

        this.onMouseButtonUp = b => {
            if (b === this.draggingButton) this.isDragging = false;
        };
        this.onMouseLeave = () => this.isDragging = false;

        return this;
    }

    set onMouseButtonDown(fun: (button: ButtonType | never) => unknown) {
        this.element.addEventListener("mousedown", e => fun(e.button));
    }

    set onMouseButtonUp(fun: (button: ButtonType | never) => unknown) {
        this.element.addEventListener("mouseup", e => fun(e.button));
    }

    set onMouseMove(fun: (button: ButtonType | never, dx: number, dy: number) => unknown) {
        this.element.addEventListener("mousemove", e => fun(e.button, e.clientX - this.x, e.clientY - this.y));
    }

    set onMouseEnter(fun: () => unknown) {
        this.element.addEventListener("mouseenter", () => fun());
    }

    set onMouseLeave(fun: () => unknown) {
        this.element.addEventListener("mouseleave", () => fun());
    }

    set onWheel(fun: (delta: number) => unknown) {
        this.element.addEventListener("wheel", e => fun(e.deltaY));
    }
}