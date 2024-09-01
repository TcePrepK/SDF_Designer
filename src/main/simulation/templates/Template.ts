import {TemplateEnvironment} from "./TemplateEnvironment";
import {TemplateNode} from "../nodes/TemplateNode";
import {ConnectionManager} from "../connections/ConnectionManager";
import {Root} from "../Root";

export class Template {
    private root!: Root;

    public body: HTMLDivElement;
    public name: string;

    private updateQueue: Set<TemplateNode> = new Set();
    private environment = new TemplateEnvironment();

    public constructor(root: Root, body: HTMLDivElement, name: string) {
        this.body = body;
        this.body = body;
        this.name = name;

        this.environment.initialize(root);
    }

    public update(): void {
        if (this.updateQueue.size === 0) return;

        let previousUpdate = true;
        while (this.updateQueue.size > 0) {
            const [node] = this.updateQueue;
            previousUpdate = node.updateValues(previousUpdate);

            this.updateQueue.delete(node);
        }
    }

    public addNodeUpdate(node: TemplateNode): void {
        // if (this.updateQueue.has(node)) return;
        this.updateQueue.add(node);

        const outputs = node.outputs;
        for (const output of outputs) {
            const network = output.network;
            if (!network) continue;

            const next = network.getNext();
            this.addNodeUpdate(next[0]);
        }
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