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
     * @returns a list of selected packages along with its dependencies
     */
    StringSlice(): string[] {
        const selectedPackages = this.getNodes().filter((n, i) => n.selected === true && (this.indegreeOfNode(n.name) > 0 || i == 0)).flatMap(n => this.getSubGraphStartingFrom(n.name).getNodes().map( no => no.name))
        return [... new Set(selectedPackages)];
    }

    /**
     * 
     * @param p package
     * 
     * Adds/removes the package from the graph depending on its selected status and the conflicts of the graph
     * 
     */
    Toggle(p: NodeType) {
        /*
         TODO: if the package is being selected then see if that will cause the graph to be incoherent
         then remove the dependencies which are causing the conflicts
         */
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