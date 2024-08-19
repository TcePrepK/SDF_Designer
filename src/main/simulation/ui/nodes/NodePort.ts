import {NodeConnection} from "../connections/NodeConnection";
import {NodeData} from "./NodeCreator";

export enum PortType {
    INPUT,
    OUTPUT
}

export class NodePort<T = PortType> {
    public readonly parent: NodeData;
    public readonly body: HTMLDivElement;
    public readonly port: HTMLDivElement;

    public readonly name: string;
    public readonly type: T;

    public network: NodeConnection | undefined;

    public constructor(parent: NodeData, body: HTMLDivElement, port: HTMLDivElement, name: string, type: T) {
        this.parent = parent;
        this.body = body;
        this.port = port;

        this.name = name;
        this.type = type;
    }

    public getNextNode(): [NodeData, NodePort<PortType.INPUT>] | [] {
        if (!this.network) return [];
        return this.network.getNext();
    }

    public getPreviousNode(): [NodeData, NodePort<PortType.OUTPUT>] | [] {
        if (!this.network) return [];
        return this.network?.getPrevious();
    }
}