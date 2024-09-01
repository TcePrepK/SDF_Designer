import {NodePort, PortType} from "./NodePort";
import {createCanvas, createDiv, createElement, createInput} from "../../core/utils";
import {NodeInput, NodeOutput, NodeParams, NoName} from "./NodeInterface";

export class BaseNode {
    public body!: HTMLDivElement;
    public canvas!: HTMLCanvasElement;
    public footer!: HTMLDivElement;
    public canvasWrapper!: HTMLDivElement;

    public params!: NodeParams;

    public inputs!: Array<NodePort<PortType.INPUT>>;
    public outputs!: Array<NodePort<PortType.OUTPUT>>;

    public name: string;
    public color: string;

    public constructor(name: string, color: string) {
        this.name = name;
        this.color = color;
    }

    /**
     * Initialized the node to a parent element. Can be playground or interface.
     * @param params
     * @param parent
     */
    public initializeElements(parent: HTMLElement | undefined = undefined, params: NodeParams | undefined = undefined): BaseNode {
        params = params ?? this.params;
        this.params = params;

        const nodeHolder = createDiv({ classes: ["holder"], parent: parent });
        this.body = createDiv({ classes: ["node", "preload"], parent: nodeHolder },
            createDiv({ classes: ["name"], innerText: this.name })
        );

        this.body.style.setProperty("--node-color", this.color);

        { // Ports
            const portHolder = createDiv({ classes: ["port-holder"], parent: this.body });
            const inputPort = createDiv({ classes: ["inputs", "ports"], parent: portHolder });
            const outputPort = createDiv({ classes: ["outputs", "ports"], parent: portHolder });

            this.inputs = this.createPorts(params.inputs, PortType.INPUT, inputPort);
            this.outputs = this.createPorts(params.outputs, PortType.OUTPUT, outputPort);
        }

        { // Canvas
            this.footer = createDiv({ classes: ["footer"], parent: this.body });
            this.canvasWrapper = createDiv({ classes: ["canvas-wrapper"], parent: this.body });
            this.canvas = createCanvas({ classes: ["canvas"], parent: this.canvasWrapper });
            this.canvas.width = 256;
            this.canvas.height = 256;
        }

        return this;
    }

    private createPorts<T = NodePort>(datas: Array<NodeInput | NodeOutput>, type: PortType.INPUT | PortType.OUTPUT, divParent: HTMLDivElement): Array<T> {
        const results: Array<T> = [];

        for (const data of datas) {
            const portData = createDiv({ classes: [`${type}_data`, "port_data"], parent: divParent });

            const port = createDiv({ classes: [type, "port"] });
            const label = data.name ? createElement("label", { classes: ["port_name"], innerText: data.name }) : null;
            const input = data.manual ? createInput({
                classes: ["port_value"],
                type: "number",
                placeholder: "Auto",
                disabled: true
            }) : null;

            if (type === PortType.INPUT) {
                portData.append(port, label ?? "", input ?? "");
            } else {
                portData.append(input ?? "", label ?? "", port);
            }

            results.push(new NodePort(this, portData, port, input, data.name ?? NoName, type) as unknown as T);
        }

        return results;
    }
}