import {AttachedMouse, ButtonType} from "../../core/AttachedMouse";
import {Root} from "../Root";
import {getElementById} from "../../core/utils";
import {BaseNode} from "./BaseNode";
import {OperationFunction} from "./NodeInterface";

export type PortValue = number | Float32Array | null;

export class TemplateNode extends BaseNode {
    private root!: Root;

    private relativeX = 0;
    private relativeY = 0;
    private centerX: number;
    private centerY: number;

    private dragging = false;
    private dragX = 0;
    private dragY = 0;

    private opp!: OperationFunction | undefined;
    currentValue: PortValue = null;

    private grabBlock = false;

    public constructor(data: BaseNode, x: number, y: number) {
        super(data.name, data.color);
        this.params = data.params;

        this.centerX = x;
        this.centerY = y;
    }

    public initialize(root: Root): TemplateNode {
        this.root = root;
        this.initializeElements();

        this.opp = this.params.opp;

        this.body.classList.add("template");

        this.updateTransform();

        const windowMouse = root.windowMouse;
        { // Dragging
            const attach = AttachedMouse.getAttachment(this.body);
            attach.onUp = button => {
                if (button !== ButtonType.LEFT) return;
                this.stopDragging();
            };

            attach.onDownRaw = event => {
                if (event.button !== ButtonType.LEFT || this.grabBlock) return;

                this.root.nodeInterface.toggleSelection(true);
                this.startDragging(event);
            };

            windowMouse.onMoveRaw = event => {
                if (!this.dragging) return;
                this.updatePosition(event.clientX + this.dragX, event.clientY + this.dragY);
            };
        }

        { // Ports
            const allPorts = [...this.inputs, ...this.outputs];
            allPorts.forEach(port => {
                AttachedMouse.getAttachment(port.port).onDownRaw = event => {
                    if (event.button !== ButtonType.LEFT) return;
                    this.grabBlock = true;

                    const template = this.root.activeTemplate;
                    const connectionManager = template.getConnectionManager();
                    const stopConnection = connectionManager.toggleConnection(port);
                    if (!stopConnection) event.stopPropagation();
                };

                if (!port.manualVal) return;
                port.manualVal.disabled = false;

                AttachedMouse.getAttachment(port.manualVal).onDown = button => {
                    if (button !== ButtonType.LEFT) return;
                    this.grabBlock = true;
                };

                AttachedMouse.getAttachment(port.manualVal).onUp = button => {
                    if (button !== ButtonType.LEFT) return;
                    this.stopDragging();
                };
            });

            windowMouse.onUp = button => {
                if (button !== ButtonType.LEFT) return;
                this.grabBlock = false;
            };
        }

        { // Resize
            windowMouse.onResize = () => {
                this.updateTransform();
            };
        }

        { // Canvas
            AttachedMouse.getAttachment(this.footer).onDownRaw =
                AttachedMouse.getAttachment(this.canvasWrapper).onDownRaw =
                    e => {
                        this.canvasWrapper.classList.toggle("enabled");
                        e.stopPropagation();
                    };

            this.resetTheOutputs();
        }

        return this;
    }

    /**
     * Updates the node canvas according to inputs
     * @param previousUpdated
     * @returns Whether the update was valid or not
     */
    public updateValues(previousUpdated: boolean): boolean {
        if (!previousUpdated) return false;

        const allInputs = this.getAllInputValues();
        if (Object.values(allInputs).includes(null)) {
            // We need to set the canvas back to non-visible state.
            this.resetTheOutputs();

            return false;
        } else {
            // Get the input values and update the canvas accordingly.
            // If there is a problem with it, return false!

            const consistsCanvas = Object.values(allInputs).find(value => value instanceof Float32Array);
            if (!consistsCanvas) {
                this.currentValue = this.opp!(allInputs as Record<string, number>);
            } else {
                const result = new Float32Array(256 * 256 * 3);
                const newCanvas = new ImageData(256, 256);
                for (let i = 0; i < 256; i++) {
                    for (let j = 0; j < 256; j++) {
                        const idx = i + j * 256;

                        for (let c = 0; c < 3; c++) {
                            const subValues: Record<string, number> = {};
                            for (const name in allInputs) {
                                const val = allInputs[name];
                                if (val instanceof Float32Array) subValues[name] = val[idx * 3 + c];
                                else subValues[name] = val as number;
                            }

                            const oppResult = this.opp!(subValues);
                            result[idx * 3 + c] = oppResult;
                            newCanvas.data[idx * 4 + c] = oppResult * 256;
                        }
                        newCanvas.data[idx * 4 + 3] = 255;
                    }
                }

                this.canvas.getContext("2d")!.putImageData(newCanvas, 0, 0);
                this.currentValue = result;
            }
            // for (const output of this.outputs) {
            //     if (!output.opp) continue;
            //     const result = output.opp(allInputs);
            //     console.log(result);
            // }
            // const outputs = this.outputs;
        }

        return true;
    }

    /**
     * Resets the values and resets the canvas
     * Basically draws the tv static, nothing fancy
     * @private
     */
    private resetTheOutputs(): void {
        this.currentValue = null;

        // Reset the canvas
        const size = 256;
        const ctx = this.canvas.getContext("2d")!;
        ctx.clearRect(0, 0, size, size);

        const top = ["#cccccc", "#ffff01", "#01ffff", "#01ff01", "#ff3ffc", "#fd241f", "#0000fe"];
        const mid = ["#0000fe", "#000000", "#ff3ffc", "#000000", "#01ffff", "#000000", "#cccccc"];
        const bot = ["#ababab", "#757575", "#686868", "#474747", "#252525", "#787878", "#8a8a8a", "#000000"];

        const topPx = 200;
        const midPx = 20;
        const botPx = 256 - midPx - topPx;

        // Draw the top
        const segSize = 256 / 7;
        for (let i = 0; i < 7; i++) {
            const x = i * segSize;

            ctx.fillStyle = top[i];
            ctx.fillRect(x, 0, segSize, topPx);

            ctx.fillStyle = mid[i];
            ctx.fillRect(x, topPx, segSize, midPx);
        }

        const botSeg = 200 / 4;
        for (let i = 0; i < 4; i++) {
            const x = i * botSeg;

            ctx.fillStyle = bot[i];
            ctx.fillRect(x, topPx + midPx, botSeg, botPx);
        }

        const botSeg2 = 30 / 3;
        for (let i = 0; i < 3; i++) {
            const x = 200 + i * botSeg2;

            ctx.fillStyle = bot[i + 4];
            ctx.fillRect(x, topPx + midPx, botSeg2, botPx);
        }

        ctx.fillStyle = "#000000";
        ctx.fillRect(230, topPx + midPx, 56 - 30, botPx);
    }

    /**
     * Setups the needed variables for the pixel node.
     * Draws the first "pixel" canvas. Each pixel represents (x, y) position.
     */
    public setupPixelNode(): void {
        const size = 256;
        const ctx = this.canvas.getContext("2d")!;

        this.currentValue = new Float32Array(size * size * 3);
        const canvasData: ImageData = new ImageData(size, size);
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                const i = x + y * size;
                canvasData.data[i * 4] = x;
                canvasData.data[i * 4 + 1] = y;
                canvasData.data[i * 4 + 2] = 0;
                canvasData.data[i * 4 + 3] = 255;

                this.currentValue[i * 3] = x / 256;
                this.currentValue[i * 3 + 1] = y / 256;
                this.currentValue[i * 3 + 2] = 0;
            }
        }

        ctx.putImageData(canvasData, 0, 0);
    }

    /**
     * Checks every input to see if the current update will be valid or not
     * @private
     */
    private getAllInputValues(): Record<string, PortValue> {
        const values: Record<string, PortValue> = {};

        const inputs = this.inputs;
        for (const input of inputs) {
            // First check if the input is connected to a network or not.
            // If it is connected, then get the value from the network.
            const network = input.network;
            if (network) {
                values[input.name] = network.getValue();
                continue;
            }

            // Otherwise we are checking the manual input of the input.
            values[input.name] = input.getManualValue();
        }

        return values;
    }

    public startDragging(event: MouseEvent): void {
        if (this.dragging) return;

        this.root.templateInterface.removeTemplateNode(this);
        getElementById("node-drag").appendChild(this.body);

        this.body.classList.add("dragging");
        this.dragging = true;

        this.dragX = this.centerX - event.clientX;
        this.dragY = this.centerY - event.clientY;
    }

    public stopDragging(): void {
        if (!this.dragging) return;

        getElementById("node-drag").removeChild(this.body);
        this.root.templateInterface.addTemplateNode(this);

        this.body.classList.remove("dragging");
        this.dragging = false;
    }

    public updatePosition(dx: number, dy: number): void {
        this.centerX = dx;
        this.centerY = dy;
        this.updateTransform();
    }

    public updateRelative(relativeX: number, relativeY: number): void {
        this.relativeX += relativeX;
        this.relativeY += relativeY;
        this.updateTransform();
    }

    private updateTransform(): void {
        const centerX = this.centerX + this.relativeX + this.root.windowWidth / 2;
        const centerY = this.centerY + this.relativeY + this.root.windowHeight / 2;
        this.body.style.left = `${centerX}px`;
        this.body.style.top = `${centerY}px`;
    }

    public activate(): void {
        this.body.style.display = "flex";
    }

    public deactivate(): void {
        this.body.style.display = "none";
    }
}