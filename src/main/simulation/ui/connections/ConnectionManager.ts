import {NodeData} from "../nodes/NodeCreator";
import {Root} from "../../root";
import {NodeConnection} from "./NodeConnection";
import {NodePort, PortType} from "../nodes/NodePort";
import {VisualConnection} from "./VisualConnection";
import {Vector2D} from "../../../core/vector2D";
import {ButtonType} from "../../../core/mouse";

export class ConnectionManager {
    private root!: Root;

    private readonly allConnections: Array<NodeConnection> = [];

    private currentlyConnecting = false;
    private port: NodePort | null = null;

    public initialize(root: Root): void {
        this.root = root;

        const mouse = this.root.windowMouse;
        mouse.onDown = button => {
            if (button !== ButtonType.LEFT) return;
            this.currentlyConnecting = false;
            this.port = null;
        };
    }

    /**
     * Either starts a connection or connects the currently selected port to the given port
     * @param port
     * @return Whether the connection should be stopped
     */
    public toggleConnection(port: NodePort): boolean {
        if (this.currentlyConnecting && this.port) {
            if (this.port.type === port.type) return false;

            const connection = port.network;
            if (connection) this.cutConnection(connection);
            if (this.findTheNodeInNetwork(this.port.parent, port.parent)) return false;

            if (port.type === PortType.OUTPUT) {
                const from = port as NodePort<PortType.OUTPUT>;
                const to = this.port as NodePort<PortType.INPUT>;
                this.allConnections.push(new NodeConnection(port.parent, this.port.parent, from, to));
            } else {
                const from = this.port as NodePort<PortType.OUTPUT>;
                const to = port as NodePort<PortType.INPUT>;
                this.allConnections.push(new NodeConnection(this.port.parent, port.parent, from, to));
            }

            return true;
        }

        // If we are not connecting, then we are just starting a connection
        const connection = port.network;
        if (connection) this.cutConnection(connection);

        this.currentlyConnecting = true;
        this.port = port;

        return false;
    }

    /**
     * Cuts the connection and removes from the list
     * @param connection
     * @private
     */
    private cutConnection(connection: NodeConnection): void {
        this.allConnections.splice(this.allConnections.indexOf(connection), 1);
        connection.cutConnection();
    }

    /**
     * Checks the network to see if from exists in it or not!
     * @param from
     * @param to
     * @private
     */
    private findTheNodeInNetwork(from: NodeData, to: NodeData): boolean {
        return false;
    }

    /**
     * Renders all connections and the current connection
     * @param ctx
     */
    public render(ctx: CanvasRenderingContext2D): void {
        this.allConnections.forEach(connection => connection.render(ctx));
        if (!this.currentlyConnecting) return;

        const position = VisualConnection.positionFromPort(this.port!);
        const mouse = this.root.windowMouse;
        VisualConnection.drawAtoB(ctx, position, new Vector2D(mouse.x, mouse.y));
    }
}