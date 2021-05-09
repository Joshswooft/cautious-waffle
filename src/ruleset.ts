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

    AddConflict(a: NodeType, b: NodeType) {
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
        console.log('graph: ', this.graph);
        const nodes = this.graph.getNodes();
        const nodesWithConflicts = nodes.filter(n => n.conflicts?.length > 0);
        
        /**
         * we check that the nodes with conflicts can't reach each other in the graph
         * i.e. if A is "selected" aka in the graph and has a conflict with B
         * then A -> * -> B should not exist.
         * 
         */
    
        // const allConflicts = nodesWithConflicts.flatMap(n => n.conflicts);
    
        const coherent = nodesWithConflicts.every(node => {
            const sub = this.graph.getSubGraphStartingFrom(node.name);
    
            if (sub.isAcyclic()) {
                return node.conflicts.every(c => {
                    const res = !sub.canReachFrom(node.name, c);
                    return res;
                })
            }
    
            return true;
        })
        console.log('coherent: ', coherent);
        return coherent;
    }
}