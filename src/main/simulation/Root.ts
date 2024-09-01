import {AttachedMouse} from "../core/AttachedMouse";
import {NodeInterface} from "./nodes/NodeInterface";
import {TemplateInterface} from "./templates/TemplateInterface";
import {Template} from "./templates/Template";
import {InitialNodes} from "./nodes/InitialNodes";

export class Root {
    public windowMouse!: AttachedMouse<HTMLBodyElement>;
    public windowWidth = 0;
    public windowHeight = 0;

    public nodeInterface = new NodeInterface();
    public templateInterface = new TemplateInterface();

    public activeTemplate!: Template;

    public initialize(): void {
        this.windowMouse = AttachedMouse.getAttachment(document.body as HTMLBodyElement);

        this.nodeInterface.initialize(this);
        InitialNodes.initialize(this);
        this.templateInterface.initialize(this);

        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        document.body.dispatchEvent(new Event("resize"));
        window.addEventListener("resize", () => {
            this.windowWidth = window.innerWidth;
            this.windowHeight = window.innerHeight;
            document.body.dispatchEvent(new Event("resize"));
        });
    }

    public update(): void {
        this.templateInterface.updateTemplates();
    }

    public updateFrame(): void {
        this.templateInterface.updateFrame();
    }
}