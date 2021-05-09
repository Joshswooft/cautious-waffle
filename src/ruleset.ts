import { DirectedAcyclicGraph } from 'typescript-graph'

// Create the graph
type NodeType = { name: string, conflicts?: Array<string> }

export function makeRelationshipSet(): DirectedAcyclicGraph<NodeType> {
    return new DirectedAcyclicGraph<NodeType>((n: NodeType) => n.name)
}


export function getTopologicallySortedSet(graph: DirectedAcyclicGraph<NodeType>): any[] {
    // Get the nodes in topologically sorted order
    return graph.topologicallySortedNodes() // returns roughly [{ name: 'node1' }, { name: 'node3' }, { name: 'node5' }, { name: 'node2' }, { name: 'node4' }]
}

// checks that the graph is coherent
// coherent - no option can depend, directly or indirectly, on another package and also be mutually exclusive with it.
// mutually exclusive - implementing one will automatically rule out the other
export function checkRelationships(graph: DirectedAcyclicGraph<NodeType>): boolean {
    const nodes = graph.getNodes();
    const nodesWithConflicts = nodes.filter(n => n.conflicts?.length > 0);
    
    /**
     * we check that the nodes with conflicts can't reach each other in the graph
     * i.e. if A is "selected" aka in the graph and has a conflict with B
     * then A -> * -> B should not exist.
     */
    const res = nodesWithConflicts.every(n => 
        n.conflicts.every(c => !graph.canReachFrom(n.name, c))
    )
    console.log('res: ', res);
    return res;
}
