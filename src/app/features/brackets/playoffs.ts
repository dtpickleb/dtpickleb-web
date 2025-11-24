export type GroupStanding = { group: string; rows: Array<{ teamId:number; teamName:string; rank:number }> };

export function seedFromRR(
  groups: GroupStanding[],
  mode: { kind: "TOP"; take: 1|2|3|4 } | { kind: "SEEDED_ALL" }
) {
  if (mode.kind === "SEEDED_ALL") {
    return groups.flatMap(g => g.rows).sort((a,b)=>a.rank-b.rank)
      .map((r, i) => ({ seed: i+1, teamId: r.teamId, teamName: r.teamName }));
  }
  // Top-N from each pool (server should already break ties via H2H/PD, etc.)
  const picks = groups.flatMap(g => g.rows.filter(r => r.rank <= mode.take));
  return picks.sort((a,b)=> a.rank - b.rank).map((r, i) => ({ seed: i+1, teamId: r.teamId, teamName: r.teamName }));
}
