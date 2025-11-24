export type Court = { id: string; name: string };
export type Slot = { start: Date; end: Date; courtId: string };

export type SchedMatch = {
  id: string;
  teams: [string, string];
  round: number;
  bracket: "W" | "L" | "GF";
  deps?: string[];  // ids that must be completed first
};

export function buildSlots(
  courts: Court[], start: Date,
  matchMinutes: number, bufferMinutes: number, slotsPerCourt: number
): Slot[] {
  const out: Slot[] = [];
  courts.forEach(c => {
    let t = new Date(start);
    for (let i=0;i<slotsPerCourt;i++) {
      const s = new Date(t), e = new Date(t);
      e.setMinutes(e.getMinutes()+matchMinutes);
      out.push({ start:s, end:e, courtId:c.id });
      t = new Date(e); t.setMinutes(t.getMinutes()+bufferMinutes);
    }
  });
  return out;
}

// Greedy SWR: round order → first feasible slot that respects per-team rest
export function schedule(matches: SchedMatch[], slots: Slot[], minRestMinutes = 20) {
  const placed: Record<string, Slot> = {};
  const teamReady = new Map<string, Date>();

  const nextFree = (team: string) => teamReady.get(team) ?? new Date(0);
  const setReady = (team: string, when: Date) => teamReady.set(team, when);

  for (const m of matches.slice().sort((a,b)=> a.round - b.round)) {
    const depsDone = new Date(Math.max(...(m.deps ?? []).map(d => placed[d]?.end?.getTime() ?? 0)));
    const teamEarliest = new Date(Math.max(nextFree(m.teams[0]).getTime(), nextFree(m.teams[1]).getTime()));
    const earliest = new Date(Math.max(depsDone.getTime(), teamEarliest.getTime()));

    const slot = slots.find(s => s.start >= earliest && !Object.values(placed).some(p => p === s));
    if (!slot) continue;

    placed[m.id] = slot;
    const readyAt = new Date(slot.end.getTime() + minRestMinutes*60*1000);
    setReady(m.teams[0], readyAt); setReady(m.teams[1], readyAt);
  }
  return placed; // matchId -> slot
}
