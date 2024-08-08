import {createDiv, getElementById} from "../../../core/utils";
import {AttachedMouse} from "../../utils/AttachedMouse";
import {Template} from "./Template";

export class TemplateInterface {
    private buffer!: HTMLDivElement;
    private hitBox!: HTMLDivElement;
    private container!: HTMLDivElement;
    private plus!: HTMLImageElement;

    private readonly templates: Template[] = [];
    private activeTemplate!: Template;

    private namingTemplate = false;

    public initialize(): void {
        this.buffer = getElementById("template-interface");
        this.hitBox = getElementById("interface-hit-box");
        this.container = getElementById("container");
        this.plus = getElementById("buffer-more");

        const bufferMouse = new AttachedMouse().attachElement(this.hitBox);
        bufferMouse.onMouseEnter = this.toggleBuffer.bind(this, true);
        bufferMouse.onMouseLeave = this.toggleBuffer.bind(this, false);

        this.plus.addEventListener("click", () => this.createNewTemplate());

        this.createMainTemplate();
    }

    public update(): void {
    }

    public updateFrame(): void {
        this.activeTemplate.getEnvironment().updateFrame();
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
        const template = createDiv({classes: ["buffer"], contentEditable: "true", parent: this.container});
        this.container.appendChild(this.plus);

        template.addEventListener("keypress", e => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            template.blur();
        });
        template.addEventListener("focus", () => {
            this.buffer.classList.add("expanded-edit");
            this.namingTemplate = true;
        });
        template.addEventListener("blur", () => {
            this.namingTemplate = false;

            if (template.innerText === "") {
                template.remove();
                return;
            }

            this.buffer.classList.remove("expanded-edit");
            this.finalizeTemplate(template);
        });

        template.addEventListener("click", () => {
            if (this.namingTemplate) return;
        });

        template.focus();
    }

    public toggleBuffer(state: boolean): void {
        const classList = this.buffer.classList;
        if (classList.contains("expanded") === state) return;

        if (state) classList.add("expanded");
        else classList.remove("expanded");
    }

    public finalizeTemplate(template: HTMLDivElement): Template {
        template.contentEditable = "false";

        const name = template.innerText;
        const templateInstance = new Template(template, name);
        this.templates.push(templateInstance);

        template.addEventListener("click", () => this.switchTemplate(templateInstance));
        return templateInstance;
    }

    public switchTemplate(template: Template): void {
        if (this.activeTemplate === template) return;
        this.activeTemplate?.deactivate();
        this.activeTemplate = template;
        template.activate();
    }
}