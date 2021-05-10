import { NodeType, Package } from './package';
export class RuleSet {
    graph: Package;

    constructor() {
        this.graph = new Package();
    }

    AddDep(a: NodeType, b: NodeType) {
        this.graph.upsert(a);
        this.graph.upsert(b);
        this.graph.addEdge(a.name, b.name);
    }

    // if a is selected then b is not selected also if b is selected then a is not selected
    AddConflict(a: NodeType, b: NodeType) {
        if (a.selected) {
            b.selected = false;
        }
        if (b.selected) {
            a.selected = false;
        }
        this.graph.upsert(a);
        this.graph.upsert(b);
    }

    /**
     * 
        coherent - no option can depend, directly or indirectly, on another package and also be mutually exclusive with it.
        mutually exclusive - implementing one will automatically rule out the other
     * @returns whether the graph is coherent
     */
    IsCoherent(): boolean {
        const nodes = this.graph.getNodes();
        const nodesWithConflicts = nodes.filter(n => n.conflicts?.length > 0);
        
        const allConflicts = nodesWithConflicts.flatMap(n => n.conflicts);
        let coherent = true;

        if (allConflicts.length > 0) {

            for (let i = 0; i < nodes.length; i++) {
                // see if we can construct a path from the current node to ALL the conflicts
                const node = nodes[i];
                const sub = this.graph.getSubGraphStartingFrom(node.name);
    
                if (sub.isAcyclic()) {
                    const res = allConflicts.every(c => (sub.canReachFrom(node.name, c) || node.name === c))
                    if (res === true) {
                        coherent = false;
                        break;
                    }
                }
    
            }
        }
        return coherent;
    }
}