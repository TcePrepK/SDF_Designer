import {Root} from "../Root";
import {Category} from "./NodeInterface";

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

export class InitialNodes {
    public static initialize(root: Root): void {
        const nodeInterface = root.nodeInterface;

        { // Initial Nodes
            nodeInterface.setupNode({
                name: "Pixel",
                inputs: [],
                outputs: [{
                    name: "Pixel Pos"
                }],
                category: Category.LOGIC,
                color: this.randomColor()
            });
        }

        { // Test
            nodeInterface.setupNode({
                name: "Test",
                inputs: [
                    {
                        name: "A",
                        manual: true
                    }
                ],
                outputs: [{}],
                opp: args => args.A * 2 - 1,

                category: Category.LOGIC,
                color: this.randomColor()
            });
        }

        { // Logic
            nodeInterface.setupNode({
                name: "Abs",
                inputs: [
                    {
                        name: "A",
                        manual: true
                    }
                ],
                outputs: [{}],
                opp: args => Math.abs(args.A),

                category: Category.LOGIC,
                color: this.randomColor()
            });

            nodeInterface.setupNode({
                name: "Min",
                inputs: [
                    {
                        name: "A",
                        manual: true
                    },
                    {
                        name: "B",
                        manual: true
                    }
                ],
                outputs: [{}],
                opp: args => Math.min(args.A, args.B),

                category: Category.LOGIC,
                color: this.randomColor()
            });

            nodeInterface.setupNode({
                name: "Max",
                inputs: [
                    {
                        name: "A",
                        manual: true
                    },
                    {
                        name: "B",
                        manual: true
                    }
                ],
                outputs: [{}],
                opp: args => Math.max(args.A, args.B),

                category: Category.LOGIC,
                color: this.randomColor()
            });
        }

        { // Math
            nodeInterface.setupNode({
                name: "Const",
                inputs: [],
                outputs: [{
                    manual: true
                }],
                category: Category.MATH,
                color: this.randomColor()
            });

            nodeInterface.setupNode({
                name: "End",
                inputs: [{}],
                outputs: [],
                category: Category.MATH,
                color: this.randomColor()
            });
        }
    }

    private static randomColor(): string {
        return PossibleColors[Math.floor(Math.random() * PossibleColors.length)];
    }
}