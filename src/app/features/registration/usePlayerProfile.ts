import { useAppSelector } from "@/store/hooks";
import type { PlayerProfile } from "./types";

export interface UsePlayerProfileReturn {
  profile: PlayerProfile | null;
  loading: boolean;
  error: string | null;
  isProfileCompleted: boolean;
}

/**
 * Hook to access player profile from Redux store
 * Usage: const { profile, loading, error, isProfileCompleted } = usePlayerProfile();
 */
export function usePlayerProfile(): UsePlayerProfileReturn {
  const { profile, loading, error } = useAppSelector(
    (state) => state.playerProfile
  );

  return {
    profile,
    loading,
    error,
    isProfileCompleted: profile?.isProfileCompleted ?? false,
  };
}
