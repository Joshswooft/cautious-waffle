import { DirectedGraph } from "typescript-graph";

export type NodeType = { name: string, conflicts?: Array<string>, selected?: boolean }

export class Package extends DirectedGraph<NodeType> {

    constructor(nodeIdentity?) {
        if (!nodeIdentity) {
            super((n: NodeType) => n.name)
        }
        else {
            super(nodeIdentity);
        }
    }

    /**
     * 
     * @returns a list of selected packages
     */
    StringSlice(): string[] {
        return this.getNodes().filter(n => n.selected === true).map(n => n.name)
    }

    /**
     * 
     * @param p package
     * 
     * Adds/removes the package from the graph depending on its selected status
     * 
     */
    Toggle(p: NodeType) {
        const matched = this.getNodes().find(n => n.name === p.name);
        if (matched) {
            matched.selected = !matched.selected;
            this.upsert(matched);
        }
        else {
            p.selected = true;
            this.insert(p);
        }
    }

}