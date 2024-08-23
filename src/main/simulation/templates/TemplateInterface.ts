import {createDiv, getElementById} from "../../core/utils";
import {Template} from "./Template";
import {TemplateNode} from "../nodes/TemplateNode";
import {Root} from "../root";

export class TemplateInterface {
    private root!: Root;

    private buffer!: HTMLDivElement;
    private hitBox!: HTMLDivElement;
    private container!: HTMLDivElement;
    private plus!: HTMLImageElement;

    private readonly templates: Template[] = [];
    private activeTemplate!: Template;

    private namingTemplate = false;

    public initialize(root: Root): void {
        this.root = root;

        this.buffer = getElementById("template-interface");
        this.hitBox = getElementById("interface-hit-box");
        this.container = getElementById("container");
        this.plus = getElementById("buffer-more");

        this.plus.addEventListener("click", () => this.createNewTemplate());

        this.createMainTemplate();
    }

    public updateFrame(): void {
        this.activeTemplate.getEnvironment().updateFrame();
    }

    public addTemplateNode(node: TemplateNode): void {
        this.activeTemplate.addNode(node);
    }

    public removeTemplateNode(node: TemplateNode): void {
        this.activeTemplate.removeNode(node);
    }

    private createMainTemplate(): void {
        this.plus.remove();
        const mainTemplate = createDiv({
            classes: ["buffer"],
            innerText: "Main",
            contentEditable: "true",
            parent: this.container
        });
        const template = this.finalizeTemplate(mainTemplate);
        this.container.appendChild(this.plus);

        this.switchTemplate(template);
    }

    public createNewTemplate(): void {
        this.container.removeChild(this.plus);
        const template = createDiv({ classes: ["buffer"], contentEditable: "true", parent: this.container });
        this.container.appendChild(this.plus);

        template.addEventListener("keypress", e => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            template.blur();
        });

        template.addEventListener("focus", () => {
            this.buffer.classList.add("edit");
            this.namingTemplate = true;
        });

        template.addEventListener("blur", () => {
            this.buffer.classList.remove("edit");
            this.namingTemplate = false;

            if (template.innerText === "") {
                template.remove();
                return;
            }

            this.finalizeTemplate(template);
        });

        template.focus();
    }

    public finalizeTemplate(template: HTMLDivElement): Template {
        template.contentEditable = "false";

        const name = template.innerText;
        const templateInstance = new Template(this.root, template, name);
        this.templates.push(templateInstance);

        template.addEventListener("click", () => this.switchTemplate(templateInstance));
        return templateInstance;
    }

    public switchTemplate(template: Template): void {
        if (this.activeTemplate === template) return;
        this.activeTemplate?.deactivate();
        this.activeTemplate = template;
        this.root.activeTemplate = template;
        template.activate();
    }
}