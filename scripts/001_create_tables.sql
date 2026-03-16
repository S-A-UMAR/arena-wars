-- Arena Wars Esports Platform Database Schema
-- Mobile Legends: Bang Bang Tournament Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE (extends auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  
  -- MLBB Specific Fields
  mlbb_id TEXT,
  mlbb_server TEXT,
  mlbb_rank TEXT DEFAULT 'Warrior',
  main_role TEXT DEFAULT 'All Rounder',
  main_heroes TEXT[] DEFAULT '{}',
  
  -- Stats
  total_matches INTEGER DEFAULT 0,
  total_wins INTEGER DEFAULT 0,
  total_losses INTEGER DEFAULT 0,
  win_rate DECIMAL(5,2) DEFAULT 0,
  total_mvps INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  elo_rating INTEGER DEFAULT 1000,
  
  -- Social
  discord_id TEXT,
  discord_username TEXT,
  
  -- Status
  is_verified BOOLEAN DEFAULT FALSE,
  is_looking_for_team BOOLEAN DEFAULT FALSE,
  is_online BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- GUILDS TABLE (Teams/Clans)
-- =============================================
CREATE TABLE IF NOT EXISTS public.guilds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  tag TEXT UNIQUE NOT NULL CHECK (char_length(tag) <= 5),
  logo_url TEXT,
  banner_url TEXT,
  description TEXT,
  
  -- Leadership
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Stats
  total_members INTEGER DEFAULT 1,
  max_members INTEGER DEFAULT 50,
  total_wins INTEGER DEFAULT 0,
  total_losses INTEGER DEFAULT 0,
  total_tournaments_won INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  elo_rating INTEGER DEFAULT 1000,
  
  -- Settings
  is_recruiting BOOLEAN DEFAULT TRUE,
  min_rank_required TEXT DEFAULT 'Warrior',
  is_verified BOOLEAN DEFAULT FALSE,
  discord_invite TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- GUILD MEMBERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.guild_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guild_id UUID NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'co-leader', 'elder', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(guild_id, user_id)
);

-- =============================================
-- GUILD INVITES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.guild_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guild_id UUID NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
  inviter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invitee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  
  UNIQUE(guild_id, invitee_id, status)
);

-- =============================================
-- TOURNAMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  rules TEXT,
  banner_url TEXT,
  
  -- Organizer
  organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Format
  format TEXT DEFAULT '5v5' CHECK (format IN ('5v5', '3v3', '1v1')),
  tournament_type TEXT DEFAULT 'single_elimination' CHECK (tournament_type IN ('single_elimination', 'double_elimination', 'round_robin', 'swiss')),
  team_size INTEGER DEFAULT 5,
  max_teams INTEGER DEFAULT 16,
  min_teams INTEGER DEFAULT 4,
  current_teams INTEGER DEFAULT 0,
  
  -- Requirements
  min_rank TEXT DEFAULT 'Warrior',
  max_rank TEXT,
  
  -- Prize Pool
  prize_pool DECIMAL(10,2) DEFAULT 0,
  entry_fee DECIMAL(10,2) DEFAULT 0,
  prize_distribution JSONB DEFAULT '{"1st": 60, "2nd": 30, "3rd": 10}',
  
  -- Stripe
  stripe_product_id TEXT,
  
  -- Schedule
  registration_start TIMESTAMPTZ,
  registration_end TIMESTAMPTZ,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'registration', 'ongoing', 'completed', 'cancelled')),
  is_featured BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TOURNAMENT REGISTRATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.tournament_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  guild_id UUID REFERENCES public.guilds(id) ON DELETE CASCADE,
  captain_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  
  -- Roster (array of user IDs)
  roster UUID[] NOT NULL,
  substitute_roster UUID[] DEFAULT '{}',
  
  -- Payment
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  stripe_payment_id TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'checked_in', 'disqualified', 'eliminated', 'winner')),
  seed INTEGER,
  checked_in_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tournament_id, guild_id),
  UNIQUE(tournament_id, team_name)
);

-- =============================================
-- TOURNAMENT BRACKETS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.tournament_brackets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  round INTEGER NOT NULL,
  match_number INTEGER NOT NULL,
  
  -- Teams
  team1_registration_id UUID REFERENCES public.tournament_registrations(id) ON DELETE SET NULL,
  team2_registration_id UUID REFERENCES public.tournament_registrations(id) ON DELETE SET NULL,
  winner_registration_id UUID REFERENCES public.tournament_registrations(id) ON DELETE SET NULL,
  
  -- Scores
  team1_score INTEGER DEFAULT 0,
  team2_score INTEGER DEFAULT 0,
  best_of INTEGER DEFAULT 1,
  
  -- Schedule
  scheduled_time TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'live', 'completed', 'cancelled')),
  stream_url TEXT,
  
  -- For double elimination
  bracket_type TEXT DEFAULT 'winners' CHECK (bracket_type IN ('winners', 'losers', 'grand_finals')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tournament_id, round, match_number, bracket_type)
);

-- =============================================
-- MATCHES TABLE (Individual Games)
-- =============================================
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bracket_id UUID REFERENCES public.tournament_brackets(id) ON DELETE CASCADE,
  game_number INTEGER DEFAULT 1,
  
  -- Teams
  team1_registration_id UUID REFERENCES public.tournament_registrations(id) ON DELETE SET NULL,
  team2_registration_id UUID REFERENCES public.tournament_registrations(id) ON DELETE SET NULL,
  winner_registration_id UUID REFERENCES public.tournament_registrations(id) ON DELETE SET NULL,
  
  -- MLBB Specific
  match_id TEXT, -- In-game match ID
  duration_seconds INTEGER,
  map TEXT DEFAULT 'Classic',
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'draft_phase', 'live', 'completed', 'disputed')),
  
  -- Screenshots/Proof
  result_screenshot_url TEXT,
  reported_by UUID REFERENCES public.profiles(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- MATCH PLAYER STATS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.match_player_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  registration_id UUID REFERENCES public.tournament_registrations(id) ON DELETE SET NULL,
  
  -- Performance
  hero TEXT,
  role TEXT,
  kills INTEGER DEFAULT 0,
  deaths INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  kda DECIMAL(5,2) DEFAULT 0,
  
  -- Detailed Stats
  damage_dealt INTEGER DEFAULT 0,
  damage_taken INTEGER DEFAULT 0,
  turrets_destroyed INTEGER DEFAULT 0,
  gold_earned INTEGER DEFAULT 0,
  
  -- Awards
  is_mvp BOOLEAN DEFAULT FALSE,
  is_gold_medal BOOLEAN DEFAULT FALSE,
  is_silver_medal BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(match_id, user_id)
);

-- =============================================
-- SCRIMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.scrims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Host Team
  host_guild_id UUID NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
  host_captain_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Opponent (if accepted)
  opponent_guild_id UUID REFERENCES public.guilds(id) ON DELETE SET NULL,
  opponent_captain_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Details
  title TEXT NOT NULL,
  description TEXT,
  format TEXT DEFAULT '5v5' CHECK (format IN ('5v5', '3v3', '1v1')),
  best_of INTEGER DEFAULT 1,
  
  -- Requirements
  min_rank TEXT DEFAULT 'Warrior',
  max_rank TEXT,
  min_guild_elo INTEGER,
  
  -- Schedule
  scheduled_time TIMESTAMPTZ NOT NULL,
  
  -- Voice Chat
  voice_platform TEXT CHECK (voice_platform IN ('discord', 'in_app', 'other')),
  voice_link TEXT,
  
  -- Status
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'accepted', 'ongoing', 'completed', 'cancelled')),
  
  -- Results
  host_score INTEGER DEFAULT 0,
  opponent_score INTEGER DEFAULT 0,
  winner_guild_id UUID REFERENCES public.guilds(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SCRIM REQUESTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.scrim_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scrim_id UUID NOT NULL REFERENCES public.scrims(id) ON DELETE CASCADE,
  guild_id UUID NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
  captain_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(scrim_id, guild_id)
);

-- =============================================
-- CHAT ROOMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  type TEXT NOT NULL CHECK (type IN ('guild', 'scrim', 'tournament', 'match', 'direct')),
  
  -- References (one will be filled based on type)
  guild_id UUID REFERENCES public.guilds(id) ON DELETE CASCADE,
  scrim_id UUID REFERENCES public.scrims(id) ON DELETE CASCADE,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  
  -- For direct messages
  participant_ids UUID[] DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CHAT MESSAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'system', 'announcement')),
  
  -- For replies
  reply_to_id UUID REFERENCES public.chat_messages(id) ON DELETE SET NULL,
  
  is_edited BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL CHECK (type IN (
    'guild_invite', 'guild_join', 'guild_leave', 'guild_kick',
    'tournament_registration', 'tournament_start', 'tournament_match', 'tournament_result',
    'scrim_request', 'scrim_accepted', 'scrim_reminder',
    'match_start', 'match_result',
    'payment_success', 'payment_failed', 'prize_received',
    'system', 'achievement'
  )),
  
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Reference data
  reference_type TEXT,
  reference_id UUID,
  metadata JSONB DEFAULT '{}',
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TRANSACTIONS TABLE (Prize Pool & Payments)
-- =============================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL CHECK (type IN ('entry_fee', 'prize_payout', 'refund', 'withdrawal')),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  -- Stripe
  stripe_payment_intent_id TEXT,
  stripe_transfer_id TEXT,
  
  -- Reference
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE SET NULL,
  registration_id UUID REFERENCES public.tournament_registrations(id) ON DELETE SET NULL,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  
  description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- =============================================
-- ACHIEVEMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  category TEXT CHECK (category IN ('tournament', 'match', 'guild', 'social', 'milestone')),
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  points INTEGER DEFAULT 10,
  is_secret BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- USER ACHIEVEMENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, achievement_id)
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_elo_rating ON public.profiles(elo_rating DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_is_looking_for_team ON public.profiles(is_looking_for_team) WHERE is_looking_for_team = TRUE;

-- Guilds
CREATE INDEX IF NOT EXISTS idx_guilds_elo_rating ON public.guilds(elo_rating DESC);
CREATE INDEX IF NOT EXISTS idx_guilds_is_recruiting ON public.guilds(is_recruiting) WHERE is_recruiting = TRUE;

-- Guild Members
CREATE INDEX IF NOT EXISTS idx_guild_members_user ON public.guild_members(user_id);
CREATE INDEX IF NOT EXISTS idx_guild_members_guild ON public.guild_members(guild_id);

-- Tournaments
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON public.tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_start_date ON public.tournaments(start_date);
CREATE INDEX IF NOT EXISTS idx_tournaments_slug ON public.tournaments(slug);

-- Tournament Registrations
CREATE INDEX IF NOT EXISTS idx_registrations_tournament ON public.tournament_registrations(tournament_id);
CREATE INDEX IF NOT EXISTS idx_registrations_guild ON public.tournament_registrations(guild_id);

-- Brackets
CREATE INDEX IF NOT EXISTS idx_brackets_tournament ON public.tournament_brackets(tournament_id);
CREATE INDEX IF NOT EXISTS idx_brackets_status ON public.tournament_brackets(status);

-- Matches
CREATE INDEX IF NOT EXISTS idx_matches_bracket ON public.matches(bracket_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);

-- Scrims
CREATE INDEX IF NOT EXISTS idx_scrims_status ON public.scrims(status);
CREATE INDEX IF NOT EXISTS idx_scrims_scheduled_time ON public.scrims(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_scrims_host_guild ON public.scrims(host_guild_id);

-- Chat Messages
CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON public.chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON public.chat_messages(created_at DESC);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;

-- Transactions
CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_tournament ON public.transactions(tournament_id);
