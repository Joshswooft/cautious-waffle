import { DirectedGraph } from "typescript-graph";
import * as hash from 'object-hash';
export type NodeType = { name: string, conflicts?: Array<string>, selected?: boolean }

export class Package extends DirectedGraph<NodeType> {

    constructor(nodeIdentity: (node: NodeType) => string = (node) => hash(node)) {
        super(nodeIdentity);
    }

    StringSlice(): string[] {
        return this.getNodes().filter(n => n.selected === true).map(n => n.name)
    }

    Toggle(p: NodeType) {
        this.upsert(p);
    }

}