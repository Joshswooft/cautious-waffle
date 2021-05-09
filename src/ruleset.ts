import { DirectedAcyclicGraph, DirectedGraph } from 'typescript-graph'

// Create the graph
type NodeType = { name: string, conflicts?: Array<string> }

export function makeRelationshipSet(acyclic?: boolean): DirectedAcyclicGraph<NodeType> | DirectedGraph<NodeType> {
    if (acyclic) {
        return new DirectedAcyclicGraph<NodeType>((n: NodeType) => n.name)
    }
    return new DirectedGraph<NodeType>((n: NodeType) => n.name)
}

export function getTopologicallySortedSet(graph: DirectedAcyclicGraph<NodeType>): any[] {
    // Get the nodes in topologically sorted order
    return graph.topologicallySortedNodes() // returns roughly [{ name: 'node1' }, { name: 'node3' }, { name: 'node5' }, { name: 'node2' }, { name: 'node4' }]
}

// checks that the graph is coherent
// coherent - no option can depend, directly or indirectly, on another package and also be mutually exclusive with it.
// mutually exclusive - implementing one will automatically rule out the other
export function checkRelationships(graph: DirectedAcyclicGraph<NodeType> | DirectedGraph<NodeType>): boolean {
    const nodes = graph.getNodes();
    const nodesWithConflicts = nodes.filter(n => n.conflicts?.length > 0);
    
    /**
     * we check that the nodes with conflicts can't reach each other in the graph
     * i.e. if A is "selected" aka in the graph and has a conflict with B
     * then A -> * -> B should not exist.
     * 
     */

    // const allConflicts = nodesWithConflicts.flatMap(n => n.conflicts);

    const coherent = nodesWithConflicts.every(node => {
        const sub = graph.getSubGraphStartingFrom(node.name);

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
