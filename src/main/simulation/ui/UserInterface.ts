import {Root} from "../root";

export class UserInterface {
    private root = new Root();

    public initialize(): void {
        this.root.initialize();
    }

    public update(): void {
        // this.root.nodeInterface.update();
        // this.root.templateInterface.update();
    }

    public updateFrame(): void {
        this.root.templateInterface.updateFrame();
    }
}