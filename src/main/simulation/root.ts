import {AttachedMouse} from "./utils/AttachedMouse";
import {NodeInterface} from "./ui/nodes/NodeInterface";
import {TemplateInterface} from "./ui/templates/TemplateInterface";
import {Template} from "./ui/templates/Template";

export class Root {
    public windowMouse!: AttachedMouse;

    public nodeInterface = new NodeInterface();
    public templateInterface = new TemplateInterface();

    public activeTemplate!: Template;

    public initialize(): void {
        this.windowMouse = AttachedMouse.getAttachment(document.body);

        this.nodeInterface.initialize(this);
        this.templateInterface.initialize(this);
    }
}