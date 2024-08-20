import {NodePort, PortType} from "../nodes/NodePort";
import {NodeData} from "../nodes/NodeCreator";
import {VisualConnection} from "./VisualConnection";

export class NodeConnection {
    private readonly fromNode: NodeData;
    private readonly toNode: NodeData;

    private readonly fromPort: NodePort<PortType.OUTPUT>;
    private readonly toPort: NodePort<PortType.INPUT>;

    constructor(fromNode: NodeData, toNode: NodeData, fromPort: NodePort<PortType.OUTPUT>, toPort: NodePort<PortType.INPUT>) {
        this.fromNode = fromNode;
        this.toNode = toNode;
        this.fromPort = fromPort;
        this.toPort = toPort;

        this.fromPort.network = this;
        this.toPort.network = this;
    }

    /**
     * Basically removes the connection from both nodes
     */
    public cutConnection(): void {
        this.fromPort.network = undefined;
        this.toPort.network = undefined;
    }

    /**
     * Renders the connection from A to B
     * @param ctx
     */
    public render(ctx: CanvasRenderingContext2D): void {
        VisualConnection.drawAtoB(ctx, VisualConnection.positionFromPort(this.fromPort), VisualConnection.positionFromPort(this.toPort));
    }

    /**
     * Returns the next node and port
     */
    public getNext(): [NodeData, NodePort<PortType.INPUT>] {
        return [this.toNode, this.toPort];
    }

    /**
     * Returns the previous node and port
     */
    public getPrevious(): [NodeData, NodePort<PortType.OUTPUT>] {
        return [this.fromNode, this.fromPort];
    }
}