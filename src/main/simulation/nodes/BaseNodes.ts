import {Root} from "../root";
import {Category} from "./NodeInterface";

export class BaseNodes {
    public static initialize(root: Root): void {
        const nodeInterface = root.nodeInterface;

        { // Initial Nodes
            const category = Category.NONE;
            nodeInterface.setupNode({
                name: "Pixel",
                inputs: [],
                outputs: ["Px", "Py"],
                hasCanvas: true,
                category: category
            });
        }
        { // Logic
            const category = Category.LOGIC;
            nodeInterface.setupNode({
                name: "Min(A, B)",
                inputs: ["", ""],
                outputs: [""],
                hasCanvas: false,
                category: category
            });

            nodeInterface.setupNode({
                name: "Test",
                inputs: ["A", "B"],
                outputs: ["O"],
                hasCanvas: false,
                category: category
            });
        }

        { // Math
            const category = Category.MATH;
            nodeInterface.setupNode({
                name: "Const",
                inputs: [],
                outputs: [""],
                hasCanvas: false,
                category: category
            });

            nodeInterface.setupNode({
                name: "End",
                inputs: [""],
                outputs: [],
                hasCanvas: false,
                category: category
            });
        }

        for (let i = 0; i < 10; i++) {
            const inputAmount = Math.floor(Math.random() * 4);
            let outputAmount = Math.floor(Math.random() * 3);
            if (inputAmount + outputAmount === 0) outputAmount = 1;

            const random2 = Math.floor(Math.random() * 2);
            const categories: [Category.LOGIC, Category.MATH] = [Category.LOGIC, Category.MATH];

            const random4 = Math.floor(Math.random() * 4);
            const names = ["Node", "End", "A ∩ B", "A ∪ B"];

            nodeInterface.setupNode({
                name: names[random4],
                inputs: new Array(inputAmount).fill(""),
                outputs: new Array(outputAmount).fill(""),
                hasCanvas: true,
                category: categories[random2]
            });
        }
    }
}