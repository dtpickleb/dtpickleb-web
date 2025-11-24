export interface MatchGame {
  match_game_id: number;
  match_id: number;
  game_index: number;
  side1_points: number;
  side2_points: number;
}

export interface MatchResult {
  match_id: number;
  winner_side: 1 | 2;
  side1_points: number;
  side2_points: number;
  completed_at: string;
}

export interface Person {
  person_id: number;
  member_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  gender: string | null;
  date_of_birth: string | null;
  skill_id: number | null;
}

export interface TeamMember {
  tournament_team_id: number;
  person_id: number;
  role: string;
  status: "accepted" | "pending";
  person: Person;
}

export interface TournamentTeam {
  tournament_team_id: number;
  tournament_id: number;
  event_type_id: number;
  name: string;
  members: TeamMember[];
}

export interface BracketEntry {
  bracket_entry_id: number;
  tournament_bracket_id: number;
  tournament_team_id: number;
  seed: number | null;
  team: TournamentTeam;
}

export interface MatchSide {
  match_id: number;
  side: 1 | 2;
  bracket_entry_id: number | null;
  entry: BracketEntry | null;
}

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

export interface Tournament {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  location: string | null;
  description: string | null;
  registrationOpens: string | null;
  registrationCloses: string | null;
  createdById: string;
  created_at: string;
  updated_at: string;
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
  tournament: Tournament;
  event_type: EventType;
}

export interface Match {
  match_id: number;
  tournament_bracket_id: number;
  rr_group_id: number | null;
  round_number: number | null;
  stage: string;
  status: "pending" | "scheduled" | "completed";
  meta_json: any;
  bracket: TournamentBracket;
  sides: MatchSide[];
  result: MatchResult | null;
  games: MatchGame[];
}

export interface MyMatchSide {
  side: number;
  teamName: string;
}

export interface MyMatchResult {
  isWin: boolean;
  winnerSide: number;
  completedAt: string | null;
}

export interface MyMatchResponse {
  matchId: number;
  tournamentName: string;
  bracketName: string;
  rrGroupName: string | null;
  stage: string | null;
  status: "scheduled" | "completed" | "bye";
  mySide: MyMatchSide | null;
  opponentSide: MyMatchSide | null;
  result: MyMatchResult | null;
}
