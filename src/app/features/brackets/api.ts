import { apiClient } from "@/lib/api-client";
import type { BracketConfig, BracketDetail, BracketLite, TeamSeed, Match } from "./types";
import { mockBracketDetail, mockBracketList } from "./mock";

export async function listBrackets(tournamentId: number): Promise<BracketLite[]> {
  try {
    const response = await apiClient.get(`/tournament/${tournamentId}/brackets`);
    return response.data;
  } catch (error: any) {
    console.error(error);
    return mockBracketList();
  }
}

export async function getBracket(tournamentId: number, bracketId: number): Promise<BracketDetail> {
  try {
    const response = await apiClient.get(`/tournament/${tournamentId}/brackets/${bracketId}`);
    return response.data;
  } catch (error: any) {
    console.error(error);
    return mockBracketDetail(bracketId);
  }
}

export async function createBracket(
  tournamentId: number,
  payload: { name: string; config: BracketConfig }
): Promise<{ id: number; name: string; config: BracketConfig }> {
  try {
    const response = await apiClient.post(`/tournament/${tournamentId}/brackets`, payload);
    return response.data;
  } catch (error) {
    console.error(error);
    return { id: Math.floor(Math.random() * 90000) + 10000, ...payload };
  }
}

export async function saveSeeds(tournamentId: number, bracketId: number, seeds: TeamSeed[]) {
  try {
    const response = await apiClient.post(`/tournament/${tournamentId}/brackets/${bracketId}/seeds`, { seeds });
    return response.data;
  } catch (error: any) {
    console.error(error);
    return { ok: true };
  }
}

export async function generateSchedule(
  tournamentId: number,
  bracketId: number
): Promise<{ matches: Match[] }> {
  try {
    const response = await apiClient.post(`/tournament/${tournamentId}/brackets/${bracketId}/generate`, {});
    return response.data;
  } catch (error: any) {
    console.error(error);
    return { matches: mockBracketDetail(bracketId).schedule };
  }
}

// Scheduling API functions
export interface ScheduleResponse {
  matches_created: number;
  match_ids: number[];
}

export interface RRGroupSuggestion {
  teamCount: number;
  minTeamsPerGroup: number;
  minGroups: number;
  maxGroups: number;
}

export interface RRGroup {
  rr_group_id: number;
  name: string;
  ordinal: number;
  capacity: number;
  teams: {
    tournament_team_id: number;
    name: string;
    seed: number;
  }[];
}

export async function createBracketSchedule(bracketId: number): Promise<ScheduleResponse> {
  const response = await apiClient.post(`/scheduling/brackets/${bracketId}`);
  return response.data.data;
}

export async function getBracketSchedule(bracketId: number) {
  const response = await apiClient.get(`/scheduling/brackets/${bracketId}`);
  return response.data.data;
}

export async function getRRGroupSuggestion(bracketId: number): Promise<RRGroupSuggestion> {
  const response = await apiClient.get(`/scheduling/brackets/${bracketId}/rr-groups/suggestion`);
  return response.data.data;
}

export async function createRRGroups(bracketId: number, groupCount: number): Promise<RRGroup[]> {
  const response = await apiClient.post(`/scheduling/brackets/${bracketId}/rr-groups?n=${groupCount}`);
  return response.data.data;
}

export async function getRRGroups(bracketId: number): Promise<RRGroup[]> {
  const response = await apiClient.get(`/scheduling/brackets/${bracketId}/rr-groups`);
  return response.data.data;
}

// Get bracket details from tournament-bracket controller
export async function getTournamentBracketDetails(bracketId: number) {
  const response = await apiClient.get(`/tournament-brackets/${bracketId}`);
  return response.data.data;
}
