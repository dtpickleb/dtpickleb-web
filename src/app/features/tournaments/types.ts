import {
  BallColor,
  Currency,
  NetType,
  SurfaceType,
  VenueType,
} from "./constants";

export type Sports = {
  id: number;
  name: string; // "Pickleball"
  isActive: boolean; // true
};

export type Country = {
  id: number;
  code: string; // "US"
  name: string; // "United States"
};

export type Facility = {
  id: number;
  venuePark: string; // "Central Park Courts"
  cityId: number;
};

export type CreateTournamentPayload = {
  name: string;
  countryId: number;
  facilityId: number;
  sportsId: number; // 1(Pickleball) for now

  feeCurrency?: Currency;
  tournamentFee?: number;
  prizeCurrency?: Currency;
  prizeMoney?: number;

  eventStartDate?: string; // ISO string for backend
  eventEndDate?: string;
  registrationOpens?: string;
  registrationCloses?: string;
  cancellationDate?: string;

  website?: string;

  ballColor?: BallColor;
  surfaceType?: SurfaceType;
  netType?: NetType;
  venueType?: VenueType;

  restTimeMinutes?: number;
  maxPlayers?: number;

  duprClubId?: string;

  requireDuprId?: boolean;
  hideBracketStartTimes?: boolean;
  isPrivateEvent?: boolean;
  playersEnterScores?: boolean;
  randomizeFirstChoice?: boolean;
  textingEnabled?: boolean;

  coverImageUrl?: string;
  flyerPdfUrl?: string;

  comments?: string;
  eventDayInstructions?: string;
  hotelInformation?: string;
  foodInformation?: string;

  cancellationRefundPolicy?: string;
  waiverLiabilityPolicy?: string;
  covid19Policy?: string;
};

export type Tournament = CreateTournamentPayload & {
  id: number;
  createdAt: string;
  updatedAt: string;
};

export type TournamentLite = {
  id: number;
  name: string;
  countryId: number;
  facilityId: number;
  sportsId: number;
  feeCurrency?: string | null;
  tournamentFee?: string | null;
  prizeCurrency?: string | null;
  prizeMoney?: string | null;
  eventStartDate?: string | null;
  eventEndDate?: string | null;
  registrationOpens?: string | null;
  registrationCloses?: string | null;
  cancellationDate?: string | null;
  website?: string | null;
  ballColor?: string | null;
  surfaceType?: string | null;
  netType?: string | null;
  venueType?: string | null;
  restTimeMinutes?: number | null;
  maxPlayers?: number | null;
  duprClubId?: string | null;
  requireDuprId?: boolean;
  hideBracketStartTimes?: boolean;
  isPrivateEvent?: boolean;
  playersEnterScores?: boolean;
  randomizeFirstChoice?: boolean;
  textingEnabled?: boolean;
  coverImageUrl?: string | null;
  flyerPdfUrl?: string | null;
  comments?: string | null;
  eventDayInstructions?: string | null;
  hotelInformation?: string | null;
  foodInformation?: string | null;
  cancellationRefundPolicy?: string | null;
  waiverLiabilityPolicy?: string | null;
  covid19Policy?: string | null;
  createdById?: string;
  createdAt?: string;
  updatedAt?: string;
  facility?: {
    id: number;
    venuePark: string;
    cityId: number;
  };
  country?: {
    id: number;
    code: string;
    name: string;
  };
  sport?: {
    id: number;
    name: string;
    isActive: boolean;
  };
  participants?: any[];
  brackets?: any[];
  teams?: any[];
  isRegistrationStarted?: boolean;
  isRegistrationClosed?: boolean;
  isTournamentEnded?: boolean;
  isCancellationEnded?: boolean;
  isRegisteredByPlayer?: boolean;

  // Legacy fields for backward compatibility
  city?: string | null;
  countryName?: string | null;
  sportName?: string | null;
  isRegistrationOpen?: boolean;
  isCompleted?: boolean;
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

export type TournamentBracket = {
  tournament_bracket_id: number;
  tournament_id: number;
  label: string;
  event_type_id: number;
  match_system: string;
  de_variant: string | null;
  rr_playoff: string | null;
  scoring_json: Record<string, any>;
  event_fee_override_cents: number | null;
  bracket_start_date_time: string | null;
  min_skill_level_id: number | null;
  max_skill_level_id: number | null;
  min_age: number | null;
  max_age: number | null;
  pools: number | null;
  alternate_description: string | null;
  comments: string | null;
  enable_registration: boolean;
  is_active: boolean;
  is_schedule_created?: boolean;
  is_rr_groups_created?: boolean;
  created_at: string;
  updated_at: string;
  event_type?: EventType;
  participants?: any[];
  matches?: any[];
  entries?: any[];
};
export type CreateBracketPayload = {
  tournamentId: number;
  label: string;
  eventTypeId: number;
  bracketFormatId: 1 | 2 | 3 | 4 | 5 | 6;
  rrPlayoffTypeId?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;
  defaultScoringPresetId: number;
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
};
