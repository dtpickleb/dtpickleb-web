// apps/web/src/app/features/brackets/rr.ts
// Circle method: fix one position, rotate the rest each round.
// If odd number of teams, add "BYE" which yields a skip for that team.
export function rrPairs(entries: string[]): [string,string][] {
  const arr = [...entries];
  if (arr.length % 2 === 1) arr.push("BYE");
  const n = arr.length;
  const rounds = n - 1;
  const result: [string,string][]= [];

  let left = arr.slice(0, n/2);
  let right = arr.slice(n/2).reverse();

  for (let r = 0; r < rounds; r++) {
    for (let i = 0; i < left.length; i++) {
      const a = left[i], b = right[i];
      if (a !== "BYE" && b !== "BYE") result.push([a,b]);
      // BYE = no match
    }
    // rotate
    const fixed = left[0];
    const movedFromLeft = left.pop()!;
    const movedFromRight = right.shift()!;
    left = [fixed, movedFromRight, ...left.slice(1)];
    right = [...right, movedFromLeft];
  }
  return result;
}
