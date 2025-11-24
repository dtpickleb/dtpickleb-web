export type DoubleElimVariant = "LB_CAN_WIN" | "LB_BRONZE_ONLY";

export type SingleElimConfig = {
  type: "SINGLE_ELIM";
  seeds: number;
  thirdPlacePlayoff?: boolean;
};

export type DoubleElimConfig = {
  type: "DOUBLE_ELIM";
  seeds: number;
  variant: DoubleElimVariant;         // UI-facing
  grandFinalReset?: boolean;
};

export type RoundRobinConfig = {
  type: "ROUND_ROBIN";
  seeds: number;
  groups?: number;
  teamsPerGroup?: number;
  matchesPerPair?: number;            // used in BracketEditor
};

export type BracketConfig = SingleElimConfig | DoubleElimConfig | RoundRobinConfig;

export type TeamSeed = {
  seed: number;
  teamId: number;
  teamName: string;
};

export type Match = {
  id: string;
  label: string;
  dependsOn?: string[];
  round?: string;
  group?: string;
  home?: string;
  away?: string;
};

export interface BracketLite {
  id: number;
  name: string;
  type: BracketConfig["type"];
  teams: number; // used by BracketList
}

export interface BracketDetail {
  id: number;
  name: string;
  config: BracketConfig;
  seeds: TeamSeed[];
  schedule: Match[]; // referenced by BracketEditor
}
