import { ButtonType } from "../../core/mouse";
import { Signal } from "../../core/signal";

export class AttachedMouse {
    public x = 0;
    public y = 0;

    public onMouseButtonDown = new Signal<[ButtonType, void]>();
    public onMouseButtonUp = new Signal<[ButtonType, void]>();
    public onMouseButtonLeave = new Signal<[ButtonType, void]>();
    public onMouseDrag = new Signal<[ButtonType, number, number, void]>();
    public onWheelScroll = new Signal<[number, void]>();

    private isDragging = false;
    private draggingButton!: ButtonType;

    public attachElement(element: HTMLElement): AttachedMouse {
        element.addEventListener("mousemove", e => {
            const dx = e.clientX - this.x;
            const dy = e.clientY - this.y;
            this.x += dx;
            this.y += dy;

            if (this.isDragging) this.onMouseDrag.dispatch(this.draggingButton, dx, dy);
        });

        element.addEventListener("mousedown", e => {
            this.onMouseButtonDown.dispatch(e.button);

            this.isDragging = true;
            this.draggingButton = e.button;
        });

        element.addEventListener("mouseup", e => {
            this.onMouseButtonUp.dispatch(e.button);
            this.isDragging = false;
        });

        element.addEventListener("mouseleave", e => {
            this.onMouseButtonLeave.dispatch(e.button);
            if (this.isDragging) this.onMouseButtonUp.dispatch(e.button);
            this.isDragging = false;
        });

        element.addEventListener("wheel", e => {
            this.onWheelScroll.dispatch(e.deltaY);
        });

        return this;
    }
}