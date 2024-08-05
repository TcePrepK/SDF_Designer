import { TemplateEnvironment } from "./TemplateEnvironment";

export class Template {
    public body: HTMLDivElement;
    public name: string;

    private environment = new TemplateEnvironment();

    public constructor(body: HTMLDivElement, name: string) {
        this.body = body;
        this.name = name;
    }

    public activate(): void {
        this.body.classList.add("active");
        this.environment.activate();
    }

    public deactivate(): void {
        this.body.classList.remove("active");
        this.environment.deactivate();
    }

    public getEnvironment(): TemplateEnvironment {
        return this.environment;
    }
}