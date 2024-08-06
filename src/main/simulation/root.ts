import { Mouse } from "../core/mouse";
import { GlobalVariables } from "../core/globalVariables";

export class Root {
    public mouse!: Mouse;

    public initialize(): void {
        this.mouse = new Mouse();
        GlobalVariables.mouse = this.mouse;
    }
}