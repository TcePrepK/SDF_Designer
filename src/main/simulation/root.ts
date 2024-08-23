import {AttachedMouse} from "./utils/AttachedMouse";
import {NodeInterface} from "./nodes/NodeInterface";
import {TemplateInterface} from "./templates/TemplateInterface";
import {Template} from "./templates/Template";
import {BaseNodes} from "./nodes/BaseNodes";

export class Root {
    public windowMouse!: AttachedMouse;

    public nodeInterface = new NodeInterface();
    public templateInterface = new TemplateInterface();

    public activeTemplate!: Template;

    public initialize(): void {
        this.windowMouse = AttachedMouse.getAttachment(document.body);

        this.nodeInterface.initialize(this);
        this.templateInterface.initialize(this);
        BaseNodes.initialize(this);
    }
}