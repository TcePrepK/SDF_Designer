import {VisualConnection} from "./VisualConnection";
import {NodePort} from "../nodes/NodeCreator";
import {Vector2D} from "../../../core/vector2D";
import {Root} from "../../root";

export class ConnectionManager {
    private root!: Root;

    private readonly allConnections: Array<VisualConnection> = [];

    private currentlyConnecting = false;
    private port: NodePort | null = null;

    public initialize(root: Root): void {
        this.root = root;
    }

    /**
     * Either starts a connection or connects the currently selected port to the given port
     * @param port
     */
    public toggleConnection(port: NodePort): void {
        this.currentlyConnecting ? this.connect(port) : this.start(port);
    }

    /**
     * Starts the connection process
     * @param port
     * @private
     */
    private start(port: NodePort): void {
        this.currentlyConnecting = true;
        this.port = port;
    }

    /**
     * Connects the currently selected port to the given port
     * @param port
     * @private
     */
    private connect(port: NodePort): void {
        this.allConnections.push(new VisualConnection(this.port!, port));
        this.currentlyConnecting = false;
        this.port = null;
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