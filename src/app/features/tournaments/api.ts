import { apiClient, handleApiError } from "@/lib/api-client";
import type {
  Country,
  Facility,
  Tournament,
  Sports,
  TournamentLite,
  TournamentBracket,
  CreateTournamentPayload,
} from "./types";

// shared types for paged responses
export type PagedMeta = {
  totalItems?: number;
  itemCount?: number;
  itemsPerPage?: number;
  totalPages?: number;
  currentPage?: number;
};

export type PagedResponse<T> = {
  items: T[];
  meta: PagedMeta;
};

// safe JSON fetcher using axios
async function fetchJSON<T>(url: string): Promise<T> {
  try {
    const response = await apiClient.get<T>(url);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

type PageParams = {
  page?: number;
  limit?: number;
  q?: string;
  filterBy?: string;
  filterOp?: "eq" | "contains" | "startsWith" | "endsWith";
  filterValue?: string | number | boolean;
};

function toQuery(params: PageParams) {
  const qs = new URLSearchParams();
  if (params.page != null) qs.set("page", String(params.page));
  if (params.limit != null) qs.set("limit", String(params.limit));
  if (params.q) qs.set("q", params.q);
  if (params.filterBy && params.filterValue !== undefined) {
    qs.set("filterBy", params.filterBy);
    if (params.filterOp) qs.set("filterOp", params.filterOp);
    qs.set("filterValue", String(params.filterValue));
  }
  return qs.toString();
}

function normalizePaged<T>(raw: unknown): PagedResponse<T> {
  if (raw && typeof raw === "object" && "items" in raw && "meta" in raw) {
    return raw as PagedResponse<T>;
  }
  if (raw && typeof raw === "object" && "data" in raw && "meta" in raw) {
    const typedRaw = raw as { data: T[]; meta: PagedMeta };
    return { items: typedRaw.data, meta: typedRaw.meta };
  }
  // Handle case where API returns { data: T[] } without meta (non-paginated response)
  if (raw && typeof raw === "object" && "data" in raw) {
    const typedRaw = raw as { data: T[] };
    if (Array.isArray(typedRaw.data)) {
      return { items: typedRaw.data, meta: {} };
    }
  }

  if (Array.isArray(raw)) return { items: raw as T[], meta: {} };
  throw new Error("Unexpected paged response shape");
}

export async function listSportsPaged(
  params: PageParams
): Promise<PagedResponse<Sports>> {
  const query = toQuery({
    limit: 20,
    page: 1,
    ...params,
  });
  const raw = await fetchJSON<unknown>(`/master/sports/paged?${query}`);
  return normalizePaged<Sports>(raw);
}

export async function listCountriesPaged(
  params: PageParams
): Promise<PagedResponse<Country>> {
  // const query = toQuery({
  //   limit: 20,
  //   page: 1,
  //   ...params,
  // });
  // const raw = await fetchJSON<unknown>(`/master/countries/paged?${query}`);

  // API no longer supports pagination - returns all countries
  const raw = await fetchJSON<unknown>(`/master/countries`);
  const normalized = normalizePaged<Country>(raw);

  // Client-side filtering if search query is provided
  if (params.q) {
    const query = params.q.toLowerCase();
    normalized.items = normalized.items.filter(
      (country) =>
        country.name?.toLowerCase().includes(query) ||
        country.code?.toLowerCase().includes(query)
    );
  }

  return normalized;
}

export async function listFacilitiesPaged(
  params: PageParams
): Promise<PagedResponse<Facility>> {
  // const query = toQuery({
  //   limit: 20,
  //   page: 1,
  //   ...params,
  // });
  // const raw = await fetchJSON<unknown>(`/master/facilities/paged?${query}`);

  // API no longer supports pagination - returns all facilities
  const raw = await fetchJSON<unknown>(`/master/facilities`);
  const normalized = normalizePaged<Facility>(raw);

  // Client-side filtering if search query is provided
  if (params.q) {
    const query = params.q.toLowerCase();
    normalized.items = normalized.items.filter((facility) =>
      facility.venuePark?.toLowerCase().includes(query)
    );
  }

  return normalized;
}

export async function createTournament(
  payload: CreateTournamentPayload
): Promise<Tournament> {
  try {
    const response = await apiClient.post<Tournament>("/tournaments", payload);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function updateTournament(
  id: number | string,
  payload: Partial<CreateTournamentPayload>
): Promise<Tournament> {
  try {
    const response = await apiClient.put<Tournament>(
      `/tournaments/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

function qs(params: Record<string, unknown> = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) =>
    v == null || v === "" ? null : q.set(k, String(v))
  );
  const s = q.toString();
  return s ? `?${s}` : "";
}

export async function listTournaments(
  params: {
    page?: number;
    limit?: number;
    q?: string;
    sportId?: number;
    countryId?: number;
    facilityId?: number;
    status?: "upcoming" | "in_progress" | "completed";
  } = {}
): Promise<{
  data: TournamentLite[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}> {
  const response = await apiClient.get(`/tournaments${qs(params)}`);
  return response.data;
}

export async function getTournament(
  id: number | string
): Promise<{ data: TournamentLite }> {
  const response = await apiClient.get(`/tournaments/${id}`);
  return response.data;
}

export async function listMyOrganized(
  params: { page?: number; limit?: number } = {}
): Promise<{
  data: TournamentLite[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}> {
  const response = await apiClient.get(
    `/tournaments/my-organized/paged${qs(params)}`
  );
  return response.data;
}

// Types for bracket format responses
export type BracketFormat = {
  bracket_format_id: number;
  label: string;
  description: string;
  match_system: string;
  de_variant: string | null;
};

export type RRPlayoffFormat = {
  rr_playoff_format_id: number;
  label: string;
  description: string;
  rr_playoff_type: string;
};

export type SportSkill = {
  id: number;
  skillLabel: string;
  rank: number;
};

export type EventType = {
  event_type_id: number;
  sport_id: number;
  label: string;
  bracket_type: string;
  gender_scope: string;
  min_players_team: number;
  max_players_team: number;
  default_event_fee_cents: number;
};

export type MatchType = {
  id: number;
  bracket_format_id: number;
  label: string;
  description: string;
};

// Bracket form API functions
export async function listEventTypes(): Promise<EventType[]> {
  try {
    const response = await apiClient.get<{ data: EventType[] }>("/event-types");

    return response.data.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function listBracketFormats(): Promise<BracketFormat[]> {
  try {
    const response = await apiClient.get<{ data: BracketFormat[] }>(
      "/master/bracket-formats"
    );
    return response.data.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function listRRPlayoffFormats(): Promise<RRPlayoffFormat[]> {
  try {
    const response = await apiClient.get<{ data: RRPlayoffFormat[] }>(
      "/master/rr-playoff-formats"
    );
    return response.data.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function listSportSkills(
  sportId: number = 1
): Promise<SportSkill[]> {
  try {
    const response = await apiClient.get<{ data: SportSkill[] }>(
      `/master/sport-skills/by-sport/${sportId}`
    );
    return response.data.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function listMatchTypes(
  bracketFormatId?: string
): Promise<MatchType[]> {
  if (!bracketFormatId) {
    return [];
  }

  try {
    // First get the bracket format to find its match_system
    const formatsResponse = await apiClient.get<{ data: BracketFormat[] }>(
      "/master/bracket-formats"
    );
    const selectedFormat = formatsResponse.data.data.find(
      (format) => String(format.bracket_format_id) === bracketFormatId
    );

    if (!selectedFormat) {
      return [];
    }

    // Fetch match types based on the match_system
    const matchTypesResponse = await apiClient.get<{ data: MatchType[] }>(
      `/master/bracket-formats?matchSystem=${selectedFormat.match_system}`
    );

    return matchTypesResponse.data.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export type ScoringPreset = {
  id: number;
  name: string;
  bestOf: number;
  gameTo: number;
  winBy: number;
  isActive: boolean;
};

export async function listEliminationMatchTypes(): Promise<ScoringPreset[]> {
  try {
    const response = await apiClient.get<{ data: ScoringPreset[] }>(
      "/master/presets"
    );
    return response.data.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function listScoringPresets(): Promise<ScoringPreset[]> {
  try {
    const response = await apiClient.get<{ data: ScoringPreset[] }>(
      "/master/presets"
    );
    return response.data.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

// Types for bracket creation
export type CreateBracketPayload = {
  tournamentId: number;
  label: string;
  eventTypeId: number;
  bracketFormatId: number;
  rrPlayoffTypeId?: number | null;
  eliminationScoringPresetId?: number | null;
  medalScoringPresetId?: number | null;
  bracketFees?: number;
  bracketScheduleDateTime?: string;
  minSkillLevelId?: number | null;
  maxSkillLevelId?: number | null;
  minAge?: number | null;
  maxAge?: number | null;
  pools?: number | null;
  alternateDescription?: string | null;
  comments?: string | null;
  enableRegistration?: boolean;
  defaultScoringPresetId?: number;
};

export type Bracket = {
  id: number;
  tournamentId: number;
  label: string;
  eventTypeId: number;
  bracketFormatId: number;
  // Add other fields as needed
};

export async function createBracket(
  payload: CreateBracketPayload
): Promise<Bracket> {
  try {
    const response = await apiClient.post<Bracket>(
      "/tournament-brackets",
      payload
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function getTournamentBracket(
  bracketId: number | string
): Promise<{ data: TournamentBracket }> {
  const response = await apiClient.get(`/tournament-brackets/${bracketId}`);

  return response.data;
}

export async function getBracketMatches(
  bracketId: number | string
): Promise<any[]> {
  try {
    const response = await apiClient.get(
      `/tournament-brackets/${bracketId}/matches`
    );
    return response.data.data || response.data || [];
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

export async function saveMatchScore(
  matchId: number | string,
  scores: Record<string, number>
): Promise<any> {
  try {
    const response = await apiClient.post(`/matches/${matchId}/score`, {
      scores,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}
