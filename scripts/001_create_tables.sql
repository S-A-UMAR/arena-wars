-- Arena Wars Esports Platform Database Schema
-- Core Tables

-- PROFILES TABLE (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  mlbb_id TEXT,
  mlbb_server TEXT,
  mlbb_rank TEXT DEFAULT 'Warrior',
  main_role TEXT DEFAULT 'All Rounder',
  main_heroes TEXT[] DEFAULT '{}',
  total_matches INTEGER DEFAULT 0,
  total_wins INTEGER DEFAULT 0,
  total_losses INTEGER DEFAULT 0,
  win_rate DECIMAL(5,2) DEFAULT 0,
  total_mvps INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  elo_rating INTEGER DEFAULT 1000,
  discord_id TEXT,
  discord_username TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_looking_for_team BOOLEAN DEFAULT FALSE,
  is_online BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GUILDS TABLE (Teams/Clans)
CREATE TABLE IF NOT EXISTS public.guilds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  tag TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  banner_url TEXT,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_members INTEGER DEFAULT 1,
  max_members INTEGER DEFAULT 50,
  total_wins INTEGER DEFAULT 0,
  total_losses INTEGER DEFAULT 0,
  total_tournaments_won INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  elo_rating INTEGER DEFAULT 1000,
  is_recruiting BOOLEAN DEFAULT TRUE,
  min_rank_required TEXT DEFAULT 'Warrior',
  is_verified BOOLEAN DEFAULT FALSE,
  discord_invite TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GUILD MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.guild_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id UUID NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(guild_id, user_id)
);

-- GUILD INVITES TABLE
CREATE TABLE IF NOT EXISTS public.guild_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id UUID NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
  inviter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invitee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
);

-- TOURNAMENTS TABLE
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  rules TEXT,
  banner_url TEXT,
  organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  format TEXT DEFAULT '5v5',
  tournament_type TEXT DEFAULT 'single_elimination',
  team_size INTEGER DEFAULT 5,
  max_teams INTEGER DEFAULT 16,
  min_teams INTEGER DEFAULT 4,
  current_teams INTEGER DEFAULT 0,
  min_rank TEXT DEFAULT 'Warrior',
  max_rank TEXT,
  prize_pool DECIMAL(10,2) DEFAULT 0,
  entry_fee DECIMAL(10,2) DEFAULT 0,
  prize_distribution JSONB DEFAULT '{"1st": 60, "2nd": 30, "3rd": 10}',
  stripe_product_id TEXT,
  registration_start TIMESTAMPTZ,
  registration_end TIMESTAMPTZ,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TOURNAMENT REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.tournament_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  guild_id UUID REFERENCES public.guilds(id) ON DELETE CASCADE,
  captain_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  roster UUID[] NOT NULL,
  substitute_roster UUID[] DEFAULT '{}',
  payment_status TEXT DEFAULT 'pending',
  stripe_payment_id TEXT,
  status TEXT DEFAULT 'pending',
  seed INTEGER,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TOURNAMENT BRACKETS TABLE
CREATE TABLE IF NOT EXISTS public.tournament_brackets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  round INTEGER NOT NULL,
  match_number INTEGER NOT NULL,
  team1_registration_id UUID REFERENCES public.tournament_registrations(id) ON DELETE SET NULL,
  team2_registration_id UUID REFERENCES public.tournament_registrations(id) ON DELETE SET NULL,
  winner_registration_id UUID REFERENCES public.tournament_registrations(id) ON DELETE SET NULL,
  team1_score INTEGER DEFAULT 0,
  team2_score INTEGER DEFAULT 0,
  best_of INTEGER DEFAULT 1,
  scheduled_time TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  stream_url TEXT,
  bracket_type TEXT DEFAULT 'winners',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MATCHES TABLE (Individual Games)
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bracket_id UUID REFERENCES public.tournament_brackets(id) ON DELETE CASCADE,
  game_number INTEGER DEFAULT 1,
  team1_registration_id UUID REFERENCES public.tournament_registrations(id) ON DELETE SET NULL,
  team2_registration_id UUID REFERENCES public.tournament_registrations(id) ON DELETE SET NULL,
  winner_registration_id UUID REFERENCES public.tournament_registrations(id) ON DELETE SET NULL,
  match_id TEXT,
  duration_seconds INTEGER,
  map TEXT DEFAULT 'Classic',
  status TEXT DEFAULT 'pending',
  result_screenshot_url TEXT,
  reported_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MATCH PLAYER STATS TABLE
CREATE TABLE IF NOT EXISTS public.match_player_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  registration_id UUID REFERENCES public.tournament_registrations(id) ON DELETE SET NULL,
  hero TEXT,
  role TEXT,
  kills INTEGER DEFAULT 0,
  deaths INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  kda DECIMAL(5,2) DEFAULT 0,
  damage_dealt INTEGER DEFAULT 0,
  damage_taken INTEGER DEFAULT 0,
  turrets_destroyed INTEGER DEFAULT 0,
  gold_earned INTEGER DEFAULT 0,
  is_mvp BOOLEAN DEFAULT FALSE,
  is_gold_medal BOOLEAN DEFAULT FALSE,
  is_silver_medal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id, user_id)
);

-- SCRIMS TABLE
CREATE TABLE IF NOT EXISTS public.scrims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_guild_id UUID NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
  host_captain_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  opponent_guild_id UUID REFERENCES public.guilds(id) ON DELETE SET NULL,
  opponent_captain_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  format TEXT DEFAULT '5v5',
  best_of INTEGER DEFAULT 1,
  min_rank TEXT DEFAULT 'Warrior',
  max_rank TEXT,
  min_guild_elo INTEGER,
  scheduled_time TIMESTAMPTZ NOT NULL,
  voice_platform TEXT,
  voice_link TEXT,
  status TEXT DEFAULT 'open',
  host_score INTEGER DEFAULT 0,
  opponent_score INTEGER DEFAULT 0,
  winner_guild_id UUID REFERENCES public.guilds(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SCRIM REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.scrim_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scrim_id UUID NOT NULL REFERENCES public.scrims(id) ON DELETE CASCADE,
  guild_id UUID NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
  captain_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(scrim_id, guild_id)
);

-- CHAT ROOMS TABLE
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  type TEXT NOT NULL,
  guild_id UUID REFERENCES public.guilds(id) ON DELETE CASCADE,
  scrim_id UUID REFERENCES public.scrims(id) ON DELETE CASCADE,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  participant_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  reply_to_id UUID REFERENCES public.chat_messages(id) ON DELETE SET NULL,
  is_edited BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  reference_type TEXT,
  reference_id UUID,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  stripe_payment_intent_id TEXT,
  stripe_transfer_id TEXT,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE SET NULL,
  registration_id UUID REFERENCES public.tournament_registrations(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  category TEXT,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  points INTEGER DEFAULT 10,
  is_secret BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- USER ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);
