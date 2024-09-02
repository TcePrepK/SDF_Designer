import {createDiv, getElementById} from "../../core/htmlUtils";
import {Template} from "./Template";
import {TemplateNode} from "../nodes/TemplateNode";
import {Root} from "../Root";

export class TemplateInterface {
    private root!: Root;

    private buffer!: HTMLDivElement;
    private container!: HTMLDivElement;
    private plus!: HTMLImageElement;

    private readonly templates: Template[] = [];
    private activeTemplate!: Template;

    public initialize(root: Root): void {
        this.root = root;

        this.buffer = getElementById("template-interface");
        this.container = getElementById("container");
        this.plus = getElementById("buffer-more");

        this.plus.addEventListener("click", () => this.createNewTemplate());

        this.createMainTemplate();
    }

    public updateTemplates(): void {
        for (const template of this.templates) {
            template.update();
        }
    }

    public updateFrame(): void {
        this.activeTemplate.getEnvironment().updateFrame();
    }

    public addNodeUpdate(node: TemplateNode): void {
        this.activeTemplate.addNodeUpdate(node);
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
        });

        template.addEventListener("blur", () => {
            this.buffer.classList.remove("edit");

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