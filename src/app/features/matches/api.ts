import { apiClient } from "@/lib/api-client";
import type { MyMatchResponse } from "./types";

export async function fetchMyMatches(): Promise<MyMatchResponse[]> {
  const response = await apiClient.get("/matches/my");

  // Handle different response formats
  if (response.data?.data) {
    return Array.isArray(response.data.data) ? response.data.data : [];
  }

  return Array.isArray(response.data) ? response.data : [];
}
