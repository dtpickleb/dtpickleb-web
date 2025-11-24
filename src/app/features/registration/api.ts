import { apiClient } from "@/lib/api-client";
import type {
  RegistrationForm,
  TournamentBracket,
  PlayerProfile,
  ProfileUpdateForm,
} from "./types";

export async function registerPlayer(form: RegistrationForm) {
  const response = await apiClient.post("/player-registration", form);
  return response.data;
}

export async function fetchTournamentBrackets(
  tournamentId: number
): Promise<TournamentBracket[]> {
  const response = await apiClient.get(
    `/tournament-brackets/relevant?tournamentId=${tournamentId}`
  );
  return response.data;
}

export async function fetchPlayerProfile(): Promise<PlayerProfile | null> {
  try {
    const response = await apiClient.get("/player-registration/profile");
    return response.data?.data || null;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function updatePlayerProfile(
  form: ProfileUpdateForm
): Promise<PlayerProfile> {
  const response = await apiClient.put("/player-registration/profile", form);
  return response.data?.data || response.data;
}

export async function verifyMemberById(memberId: string) {
  try {
    const response = await apiClient.get(
      `/player-registration/verify-member/${memberId}`
    );
    return response.data?.data || null;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function invitePlayerToBracket(data: {
  bracketId: number;
  memberId?: string;
  email?: string;
}) {
  const response = await apiClient.post(
    "/player-registration/invite-to-bracket",
    data
  );
  return response.data?.data || response.data;
}
