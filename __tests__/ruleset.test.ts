import { NodeType } from "../src/package";
import { RuleSet } from "../src/ruleset";
import { arraysEqual, setsEqual } from "../src/test-utils";

describe('Ruleset', () => {
  test('it should make an empty rule set', () => {
    const rs = new RuleSet();
    expect(rs.graph.getNodes().length).toBe(0);
  });

  // ??
  test('a package cant depend on itself', () => {

  });

  // "A depends on B", or "for A to be selected, B needs to be selected"
  test('should create a dependency between A and B', () => {
    const rs = new RuleSet();
    const A: NodeType = {name: 'A'}
    const B: NodeType = { name: 'B' }

    rs.AddDep(A, B);

    expect(rs.IsCoherent()).toBe(true);
  });

  // "for A to be selected, B needs to be unselected; and for B to be selected, A needs to be unselected"
  test('should create a new conflict between A and B, and un-select the conflicting package', () => {
    const rs = new RuleSet();
    const A: NodeType = {name: 'A', conflicts: ['B'], selected: true};
    const B: NodeType = {name: 'B', conflicts: ['A'], selected: true };

    rs.AddDep(A, B)
    rs.AddConflict(A, B)
    
    const nodes = rs.graph.getNodes();

    nodes.map(n => {
      expect(n.conflicts?.length).toBe(1);
    })

    expect(nodes.find(n => n.name === 'A').selected).toBe(true);
    expect(nodes.find(n => n.name === 'B').selected).toBe(false);

    expect(rs.IsCoherent()).toBe(false);

  });

  test('rs.AddConflict(A, B) is the same as rs.AddConflict(B, A)', () => {
    const rs = new RuleSet();
    const A: NodeType = {name: 'A', conflicts: ['B'], selected: true};
    const B: NodeType = {name: 'B', conflicts: ['A'], selected: true };
    
    rs.AddConflict(A, B);

    const s = new RuleSet();
    s.AddConflict(B, A);

    const rsNodes = rs.graph.getNodes();

    const sNodes = s.graph.getNodes();

    expect(setsEqual(rsNodes, sNodes)).toBe(true);

    
  })

  // coherent - no option can depend, directly or indirectly, on another package and also be mutually exclusive with it.
  // mutually exclusive - implementing one will automatically rule out the other
  // I.e. if the above laws hold then the graph is coherent
  test('the data structure should be coherent: ABC (conflicts: CD)', () => {
    const rs = new RuleSet();
    const A: NodeType = {name: 'A'};
    const B: NodeType = {name: 'B'};
    // A depends on B
    rs.AddDep(A, B);

    // B depends on C
    const C: NodeType = { name: 'C', conflicts: ['D']};
    
    rs.AddDep(B, C);

    const D: NodeType = {name: 'D', conflicts: ['C'] };

    rs.graph.insert(D);

    expect(rs.IsCoherent()).toBe(true);

  });

  test('should be coherent: ABCA DE (conflicts: CE)', () => {
    const rs = new RuleSet();
    const A: NodeType = {name: 'A'};
    const B: NodeType = {name: 'B'};
    const C: NodeType = {name: 'C', conflicts: ['E']};
    const D: NodeType = {name: 'D'};
    const E: NodeType = {name: 'E', conflicts: ['C']};

    rs.AddDep(A, B);
    rs.AddDep(B, C);
    rs.AddDep(C, A);
    rs.AddDep(D, E);

    expect(rs.IsCoherent()).toBe(true);

  });

  test('should be incoherent: ABC (conflicts: CA)', () => {
    const rs = new RuleSet();
    const A: NodeType = {name: 'A', conflicts: ['C']};
    const B: NodeType = {name: 'B'};
    const C: NodeType = {name: 'C', conflicts: ['A']};
    // A depends on B
    rs.AddDep(A, B);
    rs.AddDep(B, C);

    expect(rs.IsCoherent()).toBe(false);
  });

  test('deep relationships - should be incoherent for ABCDE AF (conflicts: FE)', () => {

    const rs = new RuleSet();
    const A: NodeType = {name: 'A'};
    const B: NodeType = {name: 'B'};
    const C: NodeType = {name: 'C'};
    const D: NodeType = {name: 'D'};
    const E: NodeType = {name: 'E', conflicts: ['F']};
    const F: NodeType = {name: 'F', conflicts: ['E']};

    rs.AddDep(A, B);
    rs.AddDep(B, C);
    rs.AddDep(C, D);
    rs.AddDep(D, E);
    rs.AddDep(A, F);

    // this should be false because A -> F and A -> E is required but F-E is not allowed
    expect(rs.IsCoherent()).toBe(false);

  });

  describe('given the rules between packages, a package, and a collection of selected packages coherent with the rules', () => {

    // because A is selected we have to include all its dependencies
    test('should return a list of current selected packages along with its dependencies', () => {
      const rs = new RuleSet();
      const A: NodeType = {name: 'A', selected: true};
      const B: NodeType = {name: 'B'};
      const C: NodeType = {name: 'C'};
      const D: NodeType = {name: 'D'};

      rs.AddDep(A, B);
      rs.AddDep(A, C);
      rs.AddDep(A, C);
      rs.AddDep(A, D);

      expect(rs.graph.StringSlice()).toMatchObject(['A', 'B', 'C', 'D']);
    });

    test('should return selected package', () => {
      const rs = new RuleSet();
      const A: NodeType = {name: 'A'};
      const B: NodeType = {name: 'B'};
      const C: NodeType = {name: 'C'};

      rs.AddDep(A, B);
      rs.AddDep(B, C);

      rs.graph.Toggle(C);

      expect(rs.graph.StringSlice()).toMatchObject(['C']);
    });

    test('should select the correct packages from multiple dependencies and exclusions', () => {
      const rs = new RuleSet();
      const A: NodeType = {name: 'A'};
      const B: NodeType = {name: 'B', conflicts: ['D', 'E']};
      const C: NodeType = {name: 'C'};
      const D: NodeType = {name: 'D', conflicts: ['B']};
      const E: NodeType = {name: 'E', conflicts: ['B']};


      rs.AddDep(A, B);
      rs.AddDep(A, C);

      rs.graph.insert(D);
      rs.graph.insert(E);

      expect(rs.IsCoherent()).toBe(true);

      // we activate D and E
      rs.graph.Toggle(D);
      rs.graph.Toggle(E);

      /**
       * Activating A causes D and E to become inactive 
       * because B and D conflict along with B and E
       * and A requires B and C
       */
      rs.graph.Toggle(A);
      
      expect(arraysEqual(rs.graph.StringSlice(), ['A', 'C', 'B'])).toBe(true);

    });

  });

})
