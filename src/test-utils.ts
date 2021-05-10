import { NodeType } from "./package";

export function arraysEqual(a: string[], b: string[]): boolean {
  var ka = a.sort();
  var kb = b.sort();
  if (ka.length != kb.length) {
    console.log('A does not have the same length as B', {
      A_Length: a.length,
      B_Length: b.length,
      a: ka,
      b: kb,
    });
    return false;
  }

  if (ka.every((l, index) => l === kb[index])) {
    return true;
  }
  console.log('A != B', {
    a: ka,
    b: kb,
  });
  return false;
}

// case insensitive sort on name field
function compareNodeType(a: NodeType, b: NodeType) {
  const upperA = a.name.toUpperCase();
  const upperB = b.name.toUpperCase();

  return (upperA < upperB) ? -1 : (upperA > upperB) ? 1 : 0;
}

// TODO: replace this with a more future proof approach
function compareNode(a: NodeType, b: NodeType) {
  return a.name.toUpperCase() === b.name.toUpperCase() && a.conflicts === b.conflicts && a.selected === b.selected
}

export function setsEqual(a: NodeType[], b: NodeType[]) {
  var ka = a.sort(compareNodeType);
  var kb = b.sort(compareNodeType);
  if (ka.length != kb.length) {
    return false;
  }
  return ka.every((n, i) => compareNode(n, kb[i]))
}