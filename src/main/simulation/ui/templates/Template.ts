import {TemplateEnvironment} from "./TemplateEnvironment";
import {TemplateNode} from "../nodes/TemplateNode";
import {ConnectionManager} from "../connections/ConnectionManager";
import {Root} from "../../root";

export class Template {
    private root!: Root;

    public body: HTMLDivElement;
    public name: string;

    private environment = new TemplateEnvironment();

    public constructor(root: Root, body: HTMLDivElement, name: string) {
        this.body = body;
        this.body = body;
        this.name = name;

        this.environment.initialize(root);
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

    public getConnectionManager(): ConnectionManager {
        return this.environment.connectionManager;
    }
}