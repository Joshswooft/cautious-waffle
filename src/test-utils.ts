export function setsEqual(a: string[], b: string[]): boolean {
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
