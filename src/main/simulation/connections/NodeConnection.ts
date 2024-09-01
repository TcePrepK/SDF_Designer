import {NodePort, PortType} from "../nodes/NodePort";
import {VisualConnection} from "./VisualConnection";
import {Root} from "../Root";
import {PortValue, TemplateNode} from "../nodes/TemplateNode";

export class NodeConnection {
    private root!: Root;

    private readonly fromNode: TemplateNode;
    private readonly toNode: TemplateNode;

    private readonly fromPort: NodePort<PortType.OUTPUT>;
    private readonly toPort: NodePort<PortType.INPUT>;

    public overrideColor: string | null = "#999";

    constructor(root: Root, fromNode: TemplateNode, toNode: TemplateNode, fromPort: NodePort<PortType.OUTPUT>, toPort: NodePort<PortType.INPUT>) {
        this.root = root;

        this.fromNode = fromNode;
        this.toNode = toNode;
        this.fromPort = fromPort;
        this.toPort = toPort;

        this.connect();
    }

    /**
     * Connects this connection to both node ports
     */
    public connect(): void {
        this.fromPort.connectNetwork(this);
        this.toPort.connectNetwork(this);

        this.root.templateInterface.addNodeUpdate(this.toNode);
    }

    /**
     * Basically removes the connection from both nodes
     */
    public cutConnection(): void {
        this.fromPort.disconnectNetwork();
        this.toPort.disconnectNetwork();

        this.root.templateInterface.addNodeUpdate(this.toNode);
    }

    /**
     * Renders the connection from A to B
     * @param ctx
     */
    public render(ctx: CanvasRenderingContext2D): void {
        VisualConnection.drawAtoB(ctx, VisualConnection.positionFromPort(this.fromPort), VisualConnection.positionFromPort(this.toPort), this.overrideColor);
    }

    /**
     * Returns the value this network/connection carries
     */
    public getValue(): PortValue {
        return this.fromPort.parent.currentValue;
    }

    /**
     * Returns the next node and port
     */
    public getNext(): [TemplateNode, NodePort<PortType.INPUT>] {
        return [this.toNode, this.toPort];
    }

    /**
     * Returns the previous node and port
     */
    public getPrevious(): [TemplateNode, NodePort<PortType.OUTPUT>] {
        return [this.fromNode, this.fromPort];
    }
}