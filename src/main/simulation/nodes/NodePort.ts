import {NodeConnection} from "../connections/NodeConnection";
import {BaseNode} from "./BaseNode";
import {TemplateNode} from "./TemplateNode";

export enum PortType {
    INPUT = "input",
    OUTPUT = "output"
}

export class NodePort<T = PortType> {
    public readonly parent: TemplateNode;
    public readonly body: HTMLDivElement;
    public readonly port: HTMLDivElement;
    public readonly manualVal: HTMLInputElement | null;

    public readonly name: string;
    public readonly type: T;

    public network: NodeConnection | undefined;

    public constructor(parent: BaseNode, body: HTMLDivElement, port: HTMLDivElement, manualVal: HTMLInputElement | null, name: string, type: T) {
        this.parent = parent as TemplateNode;
        this.body = body;
        this.port = port;
        this.manualVal = manualVal;

        this.name = name;
        this.type = type;
    }

    /**
     * Connects the port to a network
     * @param network
     */
    public connectNetwork(network: NodeConnection): void {
        this.network = network;
        this.port.classList.add("connected");
    }

    /**
     * Disconnects the port from a network
     */
    public disconnectNetwork(): void {
        this.network = undefined;
        this.port.classList.remove("connected");
    }

    /**
     * Gets the next node within the network (going 1 step forward)
     */
    public getNextNode(): [TemplateNode, NodePort<PortType.INPUT>] | [] {
        if (!this.network) return [];
        return this.network.getNext();
    }

    /**
     * Gets the previous node within the network (going 1 step backward)
     */
    public getPreviousNode(): [TemplateNode, NodePort<PortType.OUTPUT>] | [] {
        if (!this.network) return [];
        return this.network.getPrevious();
    }

    /**
     * If it has a manual input, returns the value of it
     */
    public getManualValue(): number | null {
        if (!this.manualVal) return null;
        if (this.manualVal.value === "") return null;
        return Number(this.manualVal.value);
    }

    /**
     * Sets the input value of the manual input
     * If lefts empty (or ""), it will be set to empty
     * @param value
     */
    public setManualValue(value: number | string = ""): void {
        if (!this.manualVal) return;
        this.manualVal.value = value.toString();
    }
}