import {ButtonType} from "../../core/mouse";

export class AttachedMouse {
    public x = 0;
    public y = 0;

    private isDragging = false;
    private draggingButton!: ButtonType;

    private element!: HTMLElement;

    public attachElement(element: HTMLElement): AttachedMouse {
        this.element = element;

        this.onMove = (_, dx, dy) => {
            this.x += dx;
            this.y += dy;
        };

        this.onDown = b => {
            if (this.isDragging) return;
            this.isDragging = true;
            this.draggingButton = b as ButtonType;
        };

        this.onUp = b => {
            if (b === this.draggingButton) this.isDragging = false;
        };
        this.onLeave = () => this.isDragging = false;

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

    set onDrag(fun: (button: ButtonType | never, dx: number, dy: number) => unknown) {
        this.onMove = (_, dx, dy) => {
            if (this.isDragging) fun(this.draggingButton, dx, dy);
        };
    }

    set onDragStart(fun: (button: ButtonType | never) => unknown) {
        this.onDown = () => {
            if (this.isDragging) return;
            fun(this.draggingButton);
        };
    }

    set onDragStop(fun: (button: ButtonType | never) => unknown) {
        this.onUp = b => {
            if (b === this.draggingButton) fun(this.draggingButton);
        };
        this.onLeave = () => fun(this.draggingButton);
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