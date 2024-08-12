import {AttachedMouse} from "./utils/AttachedMouse";
import {NodeInterface} from "./ui/nodes/NodeInterface";
import {TemplateInterface} from "./ui/templates/TemplateInterface";

export class Root {
    public windowMouse!: AttachedMouse;

    public nodeInterface = new NodeInterface();
    public templateInterface = new TemplateInterface();

    public initialize(): void {
        this.windowMouse = AttachedMouse.getAttachment(document.body);

        this.nodeInterface.initialize(this);
        this.templateInterface.initialize();
    }
}