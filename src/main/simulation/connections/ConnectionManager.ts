import {NodeData} from "../nodes/NodeCreator";
import {Root} from "../root";
import {NodeConnection} from "./NodeConnection";
import {NodePort, PortType} from "../nodes/NodePort";
import {VisualConnection} from "./VisualConnection";
import {Vector2D} from "../../core/vector2D";

export class ConnectionManager {
    private root!: Root;

    private readonly allConnections: Array<NodeConnection> = [];

    private currentlyConnecting = false;
    private port: NodePort | null = null;

    public initialize(root: Root): void {
        this.root = root;

        const mouse = this.root.windowMouse;
        mouse.onDown = () => {
            if (!this.currentlyConnecting || !this.port) return;

            const network = this.port.network;
            if (network) network.overrideColor = null;

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

            let from = this.port;
            let to = port;
            if (to.type === PortType.OUTPUT) {
                // from = port as NodePort<PortType.OUTPUT>;
                // to = this.port as NodePort<PortType.INPUT>;
                [from, to] = [to, from];
            }

            if (this.findTheNodeInNetwork(from.parent, to.parent)) return false;

            const fromNetwork = from.network;
            const toNetwork = to.network;
            if (fromNetwork && toNetwork) {
                this.cutConnection(fromNetwork);
                return true;
            } else if (fromNetwork) this.cutConnection(fromNetwork);
            else if (toNetwork) this.cutConnection(toNetwork);

            this.allConnections.push(new NodeConnection(this.port.parent, port.parent, from as NodePort<PortType.OUTPUT>, to as NodePort<PortType.INPUT>));

            return true;
        }

        this.currentlyConnecting = true;
        this.port = port;

        const network = this.port.network;
        if (network) network.overrideColor = "#f23";

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
        if (to === from) return true;
        for (const output of to.outputs) {
            const [node] = output.getNextNode();
            if (!node) continue;
            if (this.findTheNodeInNetwork(from, node)) return true;
        }

        return false;
    }

    /**
     * Renders all connections and the current connection
     * @param ctx
     */
    public render(ctx: CanvasRenderingContext2D): void {
        this.allConnections.forEach(connection => connection.render(ctx));
        if (!this.currentlyConnecting || !this.port) return;

        const position = VisualConnection.positionFromPort(this.port);
        const mouse = this.root.windowMouse;
        VisualConnection.drawAtoB(ctx, position, new Vector2D(mouse.x, mouse.y));
    }
}