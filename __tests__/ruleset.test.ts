import { NodeType } from "../src/package";
import { RuleSet } from "../src/ruleset";

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
  test('should create a new conflict between A and B', () => {
    const rs = new RuleSet();
    const A: NodeType = {name: 'A', conflicts: ['B']};
    const B: NodeType = {name: 'B', conflicts: ['A'] };

    rs.AddDep(A, B)
    
    const nodes = rs.graph.getNodes();

    nodes.map(n => {
      expect(n.conflicts?.length).toBe(1);
    })

    expect(rs.IsCoherent()).toBe(false);

  });

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

  // // Deep dependencies
// s = makeRelationshipSet();
// s = dependsOn('a', 'b', s);
// s = dependsOn('b', 'c', s);
// s = dependsOn('c', 'd', s);
// s = dependsOn('d', 'e', s);
// s = dependsOn('a', 'f', s);
// s = areExclusive('e', 'f', s);
// console.assert(!checkRelationships(s));
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

    expect(rs.IsCoherent()).toBe(false);

  });

  describe('given the rules between packages, a package, and a collection of selected packages coherent with the rules', () => {

    test('when toggled ON it should SET a package p for a collection of selected packages', () => {});

    test('when toggled OFF it should UNSET a package p for a collection of selected packages', () => {});

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

  });

})

// s = makeRelationshipSet();
// s = dependsOn('a', 'a', s);
// console.assert(checkRelationships(s));

// s = makeRelationshipSet();
// s = dependsOn('a', 'b', s);
// s = dependsOn('b', 'a', s);
// console.assert(checkRelationships(s));

// s = makeRelationshipSet();
// s = dependsOn('a', 'b', s);
// s = areExclusive('a', 'b', s);
// console.assert(!checkRelationships(s));

// s = makeRelationshipSet();
// s = dependsOn('a', 'b', s);
// s = dependsOn('b', 'c', s);
// s = areExclusive('a', 'c', s);
// console.assert(!checkRelationships(s));

// s = makeRelationshipSet();
// s = dependsOn('a', 'b', s);
// s = dependsOn('b', 'c', s);
// s = dependsOn('c', 'a', s);
// s = dependsOn('d', 'e', s);
// s = areExclusive('c', 'e', s);
// console.assert(checkRelationships(s));

// // This function takes some arguments and returns a set of selected options.
// // If needed, you should replace it with your own data structure.
// function set() {
//   var l = {};
//   for (var i in arguments) {
//     l[arguments[i]] = true;
//   }
//   return l;
// }

// // This function returns whether two sets of selected options have the same options selected.
// // If needed, you should reimplement it for your own data structure.
// function setsEqual(a, b) {
//   var ka = Object.keys(a).sort();
//   var kb = Object.keys(b).sort();
//   if (ka.length != kb.length) {
//     return false;
//   }
//   for (var i in ka) {
//     if (kb[i] != ka[i]) {
//       return false;
//     }
//   }
//   return true;
// }

// selected = set();  // Or list, array, etc.

// selected = toggle(selected, 'a', s);
// console.assert(setsEqual(selected, set('a', 'c', 'b')));

// s = dependsOn('f', 'f', s);
// selected = toggle(selected, 'f', s);
// console.assert(setsEqual(selected, set('a', 'c', 'b', 'f')));

// selected = toggle(selected, 'e', s);
// console.assert(setsEqual(selected, set('e', 'f')));

// selected = toggle(selected, 'b', s);
// console.assert(setsEqual(selected, set('a', 'c', 'b', 'f')));

// s = dependsOn('b', 'g', s);
// selected = toggle(selected, 'g', s);
// selected = toggle(selected, 'b', s);
// console.assert(setsEqual(selected, set('g', 'f')));

// s = makeRelationshipSet();
// s = dependsOn('a', 'b', s);
// s = dependsOn('b', 'c', s);
// selected = set();
// selected = toggle(selected, 'c', s);
// console.assert(setsEqual(selected, set('c')));

// // Deep dependencies
// s = makeRelationshipSet();
// s = dependsOn('a', 'b', s);
// s = dependsOn('b', 'c', s);
// s = dependsOn('c', 'd', s);
// s = dependsOn('d', 'e', s);
// s = dependsOn('a', 'f', s);
// s = areExclusive('e', 'f', s);
// console.assert(!checkRelationships(s));

// // Multiple dependencies and exclusions.

// s = makeRelationshipSet();
// s = dependsOn('a', 'b', s);
// s = dependsOn('a', 'c', s);
// s = areExclusive('b', 'd', s);
// s = areExclusive('b', 'e', s);
// console.assert(checkRelationships(s));
// selected = set();
// selected = toggle(selected, 'd', s);
// selected = toggle(selected, 'e', s);
// selected = toggle(selected, 'a', s);
// console.assert(setsEqual(selected, set('a', 'c', 'b')));