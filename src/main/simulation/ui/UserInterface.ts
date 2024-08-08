import {TemplateInterface} from "./templates/TemplateInterface";
import {NodeInterface} from "./nodes/NodeInterface";

export class UserInterface {
    private nodeInterface = new NodeInterface();
    private templateInterface = new TemplateInterface();

    public initialize(): void {
        this.nodeInterface.initialize();
        this.templateInterface.initialize();
    }

    public update(): void {
        // this.nodeInterface.update();
        // this.templateInterface.update();
    }

    public updateFrame(): void {
        this.templateInterface.updateFrame();
    }
}