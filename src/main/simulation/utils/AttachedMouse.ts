import {ButtonType} from "../../core/mouse";

export class AttachedMouse {
    public x = 0;
    public y = 0;

    private element!: HTMLElement;

    public attachElement(element: HTMLElement): AttachedMouse {
        this.element = element;

        this.onMove = (_, dx, dy) => {
            this.x += dx;
            this.y += dy;
        };

        return this;
    }

    set onDown(fun: (button: ButtonType | never) => unknown) {
        this.element.addEventListener("mousedown", e => fun(e.button));
    }

    set onUp(fun: (button: ButtonType | never) => unknown) {
        this.element.addEventListener("mouseup", e => fun(e.button));
    }

    set onClick(fun: (button: ButtonType | never) => unknown) {
        this.element.addEventListener("click", e => fun(e.button));
    }

    set onMove(fun: (button: ButtonType | never, dx: number, dy: number) => unknown) {
        this.element.addEventListener("mousemove", e => fun(e.button, e.movementX, e.movementY));
    }

    set onDrag(fun: (dx: number, dy: number) => unknown) {
        this.element.addEventListener("drag", e => fun(e.movementX, e.movementY));
    }

    set onDragStart(fun: () => unknown) {
        this.element.addEventListener("dragstart", () => fun());
    }

    set onDragStop(fun: () => unknown) {
        this.element.addEventListener("dragend", () => fun());
    }

    set onDragOver(fun: () => unknown) {
        this.element.addEventListener("dragover", () => fun());
    }

    set onEnter(fun: () => unknown) {
        this.element.addEventListener("mouseenter", () => fun());
    }

    set onLeave(fun: () => unknown) {
        this.element.addEventListener("mouseleave", () => fun());
    }

    set onWheel(fun: (delta: number) => unknown) {
        this.element.addEventListener("wheel", e => fun(e.deltaY));
    }
}