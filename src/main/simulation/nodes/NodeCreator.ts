import {createCanvas, createDiv, createElement, createInput} from "../../core/utils";
import {TemplateNode} from "./TemplateNode";
import {NodePort, PortType} from "./NodePort";
import {NodeParams} from "./NodeInterface";
import {AttachedMouse} from "../utils/AttachedMouse";

export const PossibleColors: Array<string> = [
    "#FF5733", // Red-Orange
    "#33FF57", // Green
    "#3357FF", // Blue
    "#F1C40F", // Yellow
    "#9B59B6", // Purple
    "#E74C3C", // Red
    "#1ABC9C", // Turquoise
    "#2ECC71", // Green
    "#3498DB", // Light Blue
    "#E67E22", // Orange
    "#ECF0F1", // Light Grey
    "#95A5A6", // Grey
    "#34495E", // Dark Blue
    "#16A085", // Teal
    "#27AE60", // Dark Green
    "#2980B9", // Dark Blue
    "#8E44AD", // Dark Purple
    "#F39C12", // Yellow Orange
    "#D35400", // Dark Orange
    "#C0392B", // Dark Red
    "#BDC3C7", // Silver
    "#7F8C8D", // Gray
    "#FF69B4", // Hot Pink
    "#8B4513", // Saddle Brown
    "#808000", // Olive
    "#FFA07A", // Light Salmon
    "#800080", // Purple
    "#BDB76B", // Dark Khaki
    "#00CED1", // Dark Turquoise
    "#FFD700", // Gold
    "#FF4500", // Orange Red
    "#DA70D6", // Orchid
    "#ADFF2F", // Green Yellow
    "#FFE4C4", // Bisque
    "#4682B4", // Steel Blue
    "#D2691E", // Chocolate
    "#FF1493", // Deep Pink
    "#7CFC00", // Lawn Green
    "#00FA9A", // Medium Spring Green
    "#F0E68C", // Khaki
    "#5F9EA0", // Cadet Blue
    "#7B68EE", // Medium Slate Blue
    "#9400D3", // Dark Violet
    "#FF6347", // Tomato
    "#6A5ACD", // Slate Blue
    "#00FF7F", // Spring Green
    "#FA8072", // Salmon
    "#20B2AA", // Light Sea Green
    "#778899", // Light Slate Gray
    "#B0C4DE", // Light Steel Blue
    "#FFDEAD", // Navajo White
    "#7FFF00", // Chartreuse
    "#8A2BE2", // Blue Violet
    "#FFB6C1", // Light Pink
    "#00FF00", // Lime
    "#4169E1" // Royal Blue
];

export interface NodeData {
    holder: HTMLDivElement | null;
    body: HTMLDivElement;
    canvas: HTMLCanvasElement | null;

    name: string;
    inputs: Array<NodePort<PortType.INPUT>>;
    outputs: Array<NodePort<PortType.OUTPUT>>;

    hasCanvas: boolean;

    color: string;
}

export class NodeCreator {
    public static createData(params: NodeParams, parent?: HTMLElement): NodeData {
        const nodeHolder = createDiv({ classes: ["holder"], parent: parent });
        const body = createDiv({ classes: ["node", "preload"], parent: nodeHolder },
            createDiv({ classes: ["name"], innerText: params.name })
        );

        const color = PossibleColors[Math.floor(Math.random() * PossibleColors.length)];
        body.style.setProperty("--node-color", color);

        const portHolder = createDiv({ classes: ["port-holder"], parent: body });
        const inputPort = createDiv({ classes: ["inputs", "ports"], parent: portHolder });
        const outputPort = createDiv({ classes: ["outputs", "ports"], parent: portHolder });

        const finalData: NodeData = {
            holder: nodeHolder,
            body: body,
            canvas: null,
            name: params.name,
            inputs: [],
            outputs: [],
            hasCanvas: params.hasCanvas,
            color: color
        };
        const onlyOutput = params.inputs.length === 0;
        finalData.inputs = this.createPorts(params.inputs, PortType.INPUT, finalData, inputPort, onlyOutput);
        finalData.outputs = this.createPorts(params.outputs, PortType.OUTPUT, finalData, outputPort, onlyOutput);

        createDiv({ classes: ["footer"], parent: body });

        let canvas: HTMLCanvasElement | null = null;
        if (params.hasCanvas) {
            const canvasWrapper = createDiv({ classes: ["canvas-wrapper"], parent: body });
            canvas = createCanvas({ classes: ["canvas"], parent: canvasWrapper });
            canvas.width = 256;
            canvas.height = 256;
        }

        return finalData;
    }

    public static createTemplateData(data: NodeData, forTemplate = false): NodeData {
        const body = createDiv({ classes: ["node"] },
            createDiv({ classes: ["name"], innerText: data.name })
        );

        body.style.setProperty("--node-color", data.color);

        const portHolder = createDiv({ classes: ["port-holder"], parent: body });
        const inputPort = createDiv({ classes: ["inputs", "ports"], parent: portHolder });
        const outputPort = createDiv({ classes: ["outputs", "ports"], parent: portHolder });

        const onlyOutput = data.inputs.length === 0;
        const finalData: NodeData = { ...data, body: body, inputs: [], outputs: [] };
        finalData.inputs = this.createPorts(data.inputs.map(d => d.name), PortType.INPUT, finalData, inputPort, onlyOutput, forTemplate);
        finalData.outputs = this.createPorts(data.outputs.map(d => d.name), PortType.OUTPUT, finalData, outputPort, onlyOutput, forTemplate);
        finalData.holder = null;

        const footer = createDiv({ classes: ["footer"], parent: body });

        finalData.canvas = null;
        if (data.hasCanvas) {
            const canvasWrapper = createDiv({ classes: ["canvas-wrapper"], parent: body });
            const canvas = createCanvas({ classes: ["canvas"], parent: canvasWrapper });
            canvas.width = 256;
            canvas.height = 256;
            finalData.canvas = canvas;

            const ctx = canvas.getContext("2d")!;
            ctx.fillStyle = "red";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "blue";
            ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

            AttachedMouse.getAttachment(footer).onClick = () => canvasWrapper.classList.toggle("enabled");
            AttachedMouse.getAttachment(canvas).onClick = () => canvasWrapper.classList.toggle("enabled");
        }

        return finalData;
    }

    private static createPorts<T = NodePort>(names: Array<string | null>, type: PortType.INPUT | PortType.OUTPUT, data: NodeData, parent: HTMLDivElement, onlyOutput: boolean, forTemplate = false): Array<T> {
        const results: Array<T> = [];

        for (let i = 0; i < names.length; i++) {
            const name = names[i];

            const portData = createDiv({ classes: [`${type}_data`, "port_data"], parent: parent });

            const port = createDiv({ classes: [type, "port"] });
            const label = name ? createElement("label", { classes: ["port_name"], innerText: name }) : "";
            const input = createInput({
                classes: ["port_value"],
                type: "number",
                placeholder: "Auto",
                disabled: !forTemplate
            });

            if (type === PortType.INPUT) {
                portData.append(port, label, input);
            } else if (onlyOutput) {
                portData.append(input, label, port);
            } else {
                portData.append(label, port);
            }

            results.push(new NodePort(data, portData, port, name ?? "NaN", type) as unknown as T);
        }

        return results;
    }

    public static createTemplateNode(data: NodeData): TemplateNode {
        const box = data.body.getBoundingClientRect();
        const centerX = box.left + box.width / 2;
        const centerY = box.top + box.height / 2;

        const clone = this.createTemplateData(data, true);
        return new TemplateNode(clone, centerX, centerY);
    }
}