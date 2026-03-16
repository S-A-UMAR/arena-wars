export interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  mlbb_id: string | null;
  mlbb_server: string | null;
  mlbb_rank: string;
  main_role: string;
  favorite_heroes: string[];
  total_earnings: number;
  tournaments_won: number;
  tournaments_played: number;
  matches_won: number;
  matches_played: number;
  discord_id: string | null;
  discord_username: string | null;
  is_verified: boolean;
  is_looking_for_team: boolean;
  created_at: string;
  updated_at: string;
}

export interface Guild {
  id: string;
  name: string;
  tag: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  owner_id: string | null;
  max_members: number;
  is_recruiting: boolean;
  total_earnings: number;
  tournaments_won: number;
  tournaments_played: number;
  matches_won: number;
  matches_played: number;
  discord_server_id: string | null;
  discord_invite_url: string | null;
  created_at: string;
  updated_at: string;
  member_count?: number;
  owner?: Profile;
  members?: GuildMember[];
}

export interface GuildMember {
  id: string;
  guild_id: string;
  user_id: string;
  role: "owner" | "co-leader" | "elder" | "member";
  joined_at: string;
  profile?: Profile;
}

export interface Tournament {
  id: string;
  name: string;
  description: string | null;
  banner_url: string | null;
  game: string;
  format: "5v5" | "1v1" | "3v3";
  bracket_type: "single_elimination" | "double_elimination" | "round_robin" | "swiss";
  max_teams: number;
  min_team_size: number;
  max_team_size: number;
  entry_fee: number;
  prize_pool: number;
  prize_distribution: {
    "1st": number;
    "2nd": number;
    "3rd": number;
  };
  rules: string | null;
  status: "draft" | "registration" | "ongoing" | "completed" | "cancelled";
  organizer_id: string | null;
  registration_start: string | null;
  registration_end: string | null;
  start_date: string | null;
  end_date: string | null;
  discord_channel_id: string | null;
  stream_url: string | null;
  created_at: string;
  updated_at: string;
  organizer?: Profile;
  registrations?: TournamentRegistration[];
  registered_teams?: number;
}

export interface TournamentRegistration {
  id: string;
  tournament_id: string;
  guild_id: string;
  team_name: string;
  captain_id: string | null;
  roster: {
    user_id: string;
    role: string;
    display_name: string;
  }[];
  status: "pending" | "confirmed" | "checked_in" | "eliminated" | "winner";
  seed: number | null;
  payment_status: "unpaid" | "paid" | "refunded";
  stripe_payment_id: string | null;
  registered_at: string;
  guild?: Guild;
  captain?: Profile;
}

export interface Match {
  id: string;
  tournament_id: string;
  round: number;
  match_number: number;
  team1_id: string | null;
  team2_id: string | null;
  team1_score: number;
  team2_score: number;
  winner_id: string | null;
  status: "pending" | "live" | "completed" | "cancelled";
  best_of: number;
  scheduled_at: string | null;
  started_at: string | null;
  ended_at: string | null;
  stream_url: string | null;
  vod_url: string | null;
  created_at: string;
  team1?: TournamentRegistration;
  team2?: TournamentRegistration;
  winner?: TournamentRegistration;
  tournament?: Tournament;
}

export interface Scrim {
  id: string;
  host_guild_id: string;
  opponent_guild_id: string | null;
  title: string;
  description: string | null;
  format: string;
  best_of: number;
  min_rank: string | null;
  status: "open" | "matched" | "ongoing" | "completed" | "cancelled";
  scheduled_at: string | null;
  discord_room_url: string | null;
  created_at: string;
  host_guild?: Guild;
  opponent_guild?: Guild;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string | null;
  tournament_id: string | null;
  type: "entry_fee" | "prize" | "refund" | "withdrawal";
  amount: number;
  status: "pending" | "completed" | "failed" | "refunded";
  stripe_payment_intent_id: string | null;
  stripe_transfer_id: string | null;
  description: string | null;
  created_at: string;
  tournament?: Tournament;
}
