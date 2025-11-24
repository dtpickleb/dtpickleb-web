import { z } from "zod";

export interface EventType {
  event_type_id: number;
  sport_id: number;
  label: string;
  bracket_type: string;
  gender_scope: string;
  min_players_team: number;
  max_players_team: number;
  default_event_fee_cents: number;
}

export interface TournamentBracket {
  tournament_bracket_id: number;
  tournament_id: number;
  label: string;
  event_type_id: number;
  match_system: string;
  de_variant: string | null;
  rr_playoff: string | null;
  scoring_json: {
    win_by: number;
    best_of: number;
    game_to: number;
  };
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
  created_at: string;
  updated_at: string;
  event_type: EventType;
}

export const RegistrationSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string(),
  gender: z.string(),
  dateOfBirth: z.string(),
  tournamentBracketIds: z.array(z.object({
    bracketId: z.number().int().positive(),
  })).min(1, "Pick at least one bracket"),
});

export type RegistrationForm = z.infer<typeof RegistrationSchema>;

export interface PlayerProfile {
  personId: number;
  memberId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  userId: string | null;
  isProfileCompleted: boolean;
  createdAt: string;
}

export const ProfileUpdateSchema = z.object({
  firstName: z.string().min(2, "First name is required (min 2 characters)"),
  lastName: z.string().min(2, "Last name is required (min 2 characters)"),
  phone: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  dateOfBirth: z.union([z.string(), z.date()]).optional(),
});

export type ProfileUpdateForm = z.infer<typeof ProfileUpdateSchema>;
