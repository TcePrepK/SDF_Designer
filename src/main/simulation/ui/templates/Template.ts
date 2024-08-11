import {TemplateEnvironment} from "./TemplateEnvironment";
import {TemplateNode} from "../nodes/TemplateNode";

export class Template {
    public body: HTMLDivElement;
    public name: string;

    private environment = new TemplateEnvironment();

    public constructor(body: HTMLDivElement, name: string) {
        this.body = body;
        this.name = name;
    }

    public addNode(node: TemplateNode): void {
        this.environment.addNode(node);
    }

    public removeNode(node: TemplateNode): void {
        this.environment.removeNode(node);
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