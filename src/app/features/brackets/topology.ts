export type Edge = { from: string; to: string };

// ---- Single Elimination ----
export function buildSETopology(seeds: number, withBronze: boolean) {
  const p2 = 1 << Math.ceil(Math.log2(Math.max(1, seeds)));
  const rMax = Math.log2(p2);

  const rounds: string[][] = [];
  const edges: Edge[] = [];

  // Round 1 ids
  rounds[0] = Array.from({ length: p2 / 2 }, (_, i) => `W1-${i}`);

  // Later winners rounds
  for (let r = 2; r <= rMax; r++) {
    const prev = rounds[r - 2];
    const cur = Array.from({ length: prev.length / 2 }, (_, i) => `W${r}-${i}`);
    prev.forEach((mId, idx) => edges.push({ from: mId, to: cur[Math.floor(idx / 2)] }));
    rounds[r - 1] = cur;
  }

  // Bronze (third-place playoff) = losers of both semifinals (if variant wants it)
  // (server will decide losers; we only draw the node + incoming connectors from the semis)
  const extras: string[] = [];
  if (withBronze && rMax >= 2) {
    const semis = rounds[rMax - 2] ?? [];
    const bronzeId = "BRONZE-1";
    extras.push(bronzeId);
    if (semis[0]) edges.push({ from: semis[0], to: bronzeId });
    if (semis[1]) edges.push({ from: semis[1], to: bronzeId });
  }

  return { matches: [...rounds.flat(), ...extras], rounds, edges, rMax };
}

// ---- Double Elimination ----
export function buildDETopology(
  seeds: number,
  { losersCanWinGold, grandFinalReset }: { losersCanWinGold: boolean; grandFinalReset?: boolean }
) {
  const WB = buildSETopology(seeds, false);            // winners = SE
  const p2 = 1 << Math.ceil(Math.log2(Math.max(1, seeds)));
  const wbRounds = WB.rMax;

  // Losers bracket stages (minor/major): counts p2/4, p2/4, p2/8, p2/8, ..., 1,1
  const LB: string[][] = [];
  const Ledges: Edge[] = [];
  let count = p2 / 4, stage = 1;
  while (count >= 1) {
    // minor stage s (odd)
    LB[stage - 1] = Array.from({ length: count }, (_, i) => `L${stage}-${i}`);
    // major stage s+1 (even)
    LB[stage] = Array.from({ length: count }, (_, i) => `L${stage + 1}-${i}`);

    // From Winners round r losers -> L_s (minor), where r = (s+1)/2
    const r = (stage + 1) / 2;
    const wr = WB.rounds[r - 1] ?? [];
    wr.forEach((mId, idx) => {
      const target = LB[stage - 1][Math.floor(idx / 2)];
      if (target) Ledges.push({ from: mId, to: target });
    });

    // Minor winners -> Major
    LB[stage - 1].forEach((m, i) => Ledges.push({ from: m, to: LB[stage][i] }));
    // Also losers from Winners round r+1 -> Major
    const wrNext = WB.rounds[r] ?? [];
    wrNext.forEach((mId, i) => LB[stage][i] && Ledges.push({ from: mId, to: LB[stage][i] }));

    stage += 2;
    count = Math.max(1, count / 2);
  }

  // Grand Final(s)
  const GF: string[] = [];
  const GFedges: Edge[] = [];
  if (losersCanWinGold) {
    const gf1 = "GF-1"; GF.push(gf1);
    GFedges.push({ from: WB.rounds[wbRounds - 1][0], to: gf1 }); // WB final -> GF
    const lastL = (LB[LB.length - 1] ?? [])[0];
    if (lastL) GFedges.push({ from: lastL, to: gf1 });           // LB winner -> GF
    if (grandFinalReset) {                                       // optional reset
      const gf2 = "GF-2"; GF.push(gf2); GFedges.push({ from: gf1, to: gf2 });
    }
  }
  // Bronze notes:
  // - losersCanWinGold (standard DE): bronze is typically the LOSER of the LB final (the match feeding GF). We render a small badge on that card.
  // - bronze-only variant (no crossover): the LB final WINNER is bronze (no GF edges).

  return {
    matches: [...WB.matches, ...LB.flat(), ...GF],
    wbRounds: WB.rounds,
    lbStages: LB,
    gf: GF,
    edges: [...WB.edges, ...Ledges, ...GFedges],
  };
}
