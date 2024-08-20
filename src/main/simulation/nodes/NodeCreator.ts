import {createDiv, createElement, createInput} from "../../core/utils";
import {TemplateNode} from "./TemplateNode";
import {NodePort, PortType} from "./NodePort";

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

    name: string;
    inputs: Array<NodePort<PortType.INPUT>>;
    outputs: Array<NodePort<PortType.OUTPUT>>;

    color: string;
}

export class NodeCreator {
    public static createData(name: string, inputCount: number, outputCount: number, parent?: HTMLElement): NodeData {
        const nodeHolder = createDiv({ classes: ["holder"], parent: parent });
        const body = createDiv({ classes: ["node", "preload"], parent: nodeHolder },
            createDiv({ classes: ["name"], innerText: name })
        );

        const color = PossibleColors[Math.floor(Math.random() * PossibleColors.length)];
        body.style.setProperty("--node-color", color);

        const inputPort = createDiv({ classes: ["inputs"], parent: body });
        const outputPort = createDiv({ classes: ["outputs"], parent: body });

        const finalData: NodeData = {
            holder: nodeHolder,
            body: body,
            name: name,
            inputs: [],
            outputs: [],
            color: color
        };
        finalData.inputs = this.createPorts(inputCount, PortType.INPUT, finalData, inputPort);
        finalData.outputs = this.createPorts(outputCount, PortType.OUTPUT, finalData, outputPort);

        return finalData;
    }

    public static cloneData(data: NodeData, forTemplate = false): NodeData {
        const body = createDiv({ classes: ["node", "preload"] },
            createDiv({ classes: ["name"], innerText: data.name })
        );

        body.style.setProperty("--node-color", data.color);

        const inputPort = createDiv({ classes: ["inputs"], parent: body });
        const outputPort = createDiv({ classes: ["outputs"], parent: body });

        const finalData: NodeData = { ...data, body: body, inputs: [], outputs: [] };
        finalData.inputs = this.createPorts(data.inputs.length, PortType.INPUT, finalData, inputPort, forTemplate);
        finalData.outputs = this.createPorts(data.outputs.length, PortType.OUTPUT, finalData, outputPort, forTemplate);
        finalData.holder = null;

        return finalData;
    }

    private static createPorts<T = NodePort>(times: number, type: PortType.INPUT | PortType.OUTPUT, data: NodeData, parent: HTMLDivElement, forTemplate = false): Array<T> {
        const ports: Array<T> = [];

        for (let i = 0; i < times; i++) {
            const name = String.fromCharCode(65 + i);

            let element: HTMLDivElement;
            let port: HTMLDivElement;
            if (type === PortType.INPUT) {
                port = createDiv({ classes: ["input"] }),
                element = createDiv({ classes: ["input_data"], parent: parent },
                    port,
                    createElement("label", { classes: ["input_name"], innerText: name }),
                    createInput({ classes: ["input_value"], type: "number", disabled: !forTemplate })
                );
            } else {
                port = createDiv({ classes: ["output"], parent: parent });
                element = port;
            }

            ports.push(new NodePort(data, element, port, name, type) as unknown as T);
        }

        return ports;
    }

    public static createTemplateNode(data: NodeData): TemplateNode {
        const box = data.body.getBoundingClientRect();
        const centerX = box.left + box.width / 2;
        const centerY = box.top + box.height / 2;

        const clone = this.cloneData(data, true);
        clone.body.style.width = `${box.width}px`;

        return new TemplateNode(clone, centerX, centerY);
    }
}