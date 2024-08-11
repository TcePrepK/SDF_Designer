import {createDiv} from "../../../core/utils";
import {TemplateNode} from "./TemplateNode";

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

export function calculateFontColor(color: string): string {
    const rgb = parseInt(color.slice(1), 16);
    const r = (rgb >> 16) & 0xFF;
    const g = (rgb >> 8) & 0xFF;
    const b = rgb & 0xFF;

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000" : "#fff";
}

export class VisualNode {
    public name: string;
    public inputs: number;
    public outputs: number;

    private readonly body: HTMLDivElement;

    public constructor(name: string, inputs: number, outputs: number, parent: HTMLElement | undefined = undefined) {
        this.name = name;
        this.inputs = inputs;
        this.outputs = outputs;

        const nodeHolder = createDiv({classes: ["holder"], parent: parent});
        this.body = createDiv({classes: ["node", "preload"], parent: nodeHolder},
            createDiv({classes: ["name"], innerText: name})
        );

        const color = PossibleColors[Math.floor(Math.random() * PossibleColors.length)];
        const textColor = calculateFontColor(color);
        this.body.style.setProperty("--node-name-color", textColor);
        this.body.style.setProperty("--node-color", color);

        const inputPort = createDiv({classes: ["input_ports"], parent: this.body});
        const outputPort = createDiv({classes: ["output_ports"], parent: this.body});

        for (let i = 0; i < inputs; i++) {
            createDiv({classes: ["input"], parent: inputPort});
        }

        for (let i = 0; i < outputs; i++) {
            createDiv({classes: ["output"], parent: outputPort});
        }
    }

    public getTemplateNode(): TemplateNode {
        const box = this.getHitBox();
        const centerX = box.left + box.width / 2;
        const centerY = box.top + box.height / 2;
        const width = box.width;

        const clone = this.body.cloneNode(true) as HTMLElement;
        clone.style.width = `${width}px`;

        return new TemplateNode(this.name, clone, centerX, centerY);
    }

    public setScaleMultiplier(opacity: number): void {
        this.body.style.setProperty("--node-scale-multiplier", String(opacity));
    }

    public getHitBox(): DOMRect {
        return this.body.getBoundingClientRect();
    }

    public getBody(): HTMLDivElement {
        return this.body;
    }
}