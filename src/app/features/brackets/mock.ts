import type { BracketLite, BracketDetail, BracketConfig, TeamSeed, Match } from "./types";

export function mockBracketList(): BracketLite[] {
  return [
    { id: 1, name: "Singles", type: "SINGLE_ELIM", teams: 8 },
    { id: 2, name: "Doubles", type: "DOUBLE_ELIM", teams: 8 },
    { id: 3, name: "Round Robin", type: "ROUND_ROBIN", teams: 6 },
  ];
}

export function mockBracketDetail(bracketId: number): BracketDetail {
  const baseSeeds: TeamSeed[] = Array.from({ length: 8 }, (_, i) => ({
    seed: i + 1,
    teamId: i + 101,
    teamName: `Team ${i + 1}`,
  }));

  const baseSchedule: Match[] = [
    { id: "W1-0", label: "R1 M1" },
    { id: "W1-1", label: "R1 M2" },
  ];

  const configById: Record<number, BracketConfig> = {
    1: { type: "SINGLE_ELIM", seeds: 8, thirdPlacePlayoff: true },
    2: { type: "DOUBLE_ELIM", seeds: 8, variant: "LB_CAN_WIN", grandFinalReset: true },
    3: { type: "ROUND_ROBIN", seeds: 6, matchesPerPair: 1 },
  };

  return {
    id: bracketId,
    name: `Bracket #${bracketId}`,
    config: configById[bracketId] ?? { type: "SINGLE_ELIM", seeds: 8 },
    seeds: baseSeeds,
    schedule: baseSchedule,
  };
}
