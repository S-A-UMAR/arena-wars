-- Auto-create profile when user signs up
-- This trigger runs with security definer privileges to bypass RLS

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    display_name,
    avatar_url,
    discord_id,
    discord_username
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data ->> 'username',
      LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data ->> 'full_name', SPLIT_PART(NEW.email, '@', 1)), ' ', '_')) || '_' || SUBSTRING(NEW.id::text FROM 1 FOR 8)
    ),
    COALESCE(
      NEW.raw_user_meta_data ->> 'display_name',
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data ->> 'avatar_url',
    NEW.raw_user_meta_data ->> 'provider_id',
    NEW.raw_user_meta_data ->> 'custom_claims' ->> 'global_name'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- UPDATE TIMESTAMPS TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply to tables with updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_guilds_updated_at ON public.guilds;
CREATE TRIGGER update_guilds_updated_at
  BEFORE UPDATE ON public.guilds
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_tournaments_updated_at ON public.tournaments;
CREATE TRIGGER update_tournaments_updated_at
  BEFORE UPDATE ON public.tournaments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_scrims_updated_at ON public.scrims;
CREATE TRIGGER update_scrims_updated_at
  BEFORE UPDATE ON public.scrims
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_brackets_updated_at ON public.tournament_brackets;
CREATE TRIGGER update_brackets_updated_at
  BEFORE UPDATE ON public.tournament_brackets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_matches_updated_at ON public.matches;
CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_chat_messages_updated_at ON public.chat_messages;
CREATE TRIGGER update_chat_messages_updated_at
  BEFORE UPDATE ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- GUILD MEMBER COUNT TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION public.update_guild_member_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.guilds
    SET total_members = total_members + 1
    WHERE id = NEW.guild_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.guilds
    SET total_members = total_members - 1
    WHERE id = OLD.guild_id;
    RETURN OLD;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS update_guild_members_count ON public.guild_members;
CREATE TRIGGER update_guild_members_count
  AFTER INSERT OR DELETE ON public.guild_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_guild_member_count();

-- =============================================
-- TOURNAMENT TEAM COUNT TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION public.update_tournament_team_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tournaments
    SET current_teams = current_teams + 1
    WHERE id = NEW.tournament_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tournaments
    SET current_teams = current_teams - 1
    WHERE id = OLD.tournament_id;
    RETURN OLD;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS update_tournament_teams_count ON public.tournament_registrations;
CREATE TRIGGER update_tournament_teams_count
  AFTER INSERT OR DELETE ON public.tournament_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tournament_team_count();

-- =============================================
-- PLAYER STATS UPDATE TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION public.update_player_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  winning_team_id UUID;
BEGIN
  -- Get the winning team
  SELECT winner_registration_id INTO winning_team_id
  FROM public.matches
  WHERE id = NEW.match_id;
  
  -- Update player profile stats
  UPDATE public.profiles
  SET 
    total_matches = total_matches + 1,
    total_wins = total_wins + CASE WHEN NEW.registration_id = winning_team_id THEN 1 ELSE 0 END,
    total_losses = total_losses + CASE WHEN NEW.registration_id != winning_team_id AND winning_team_id IS NOT NULL THEN 1 ELSE 0 END,
    total_mvps = total_mvps + CASE WHEN NEW.is_mvp THEN 1 ELSE 0 END,
    win_rate = CASE 
      WHEN (total_matches + 1) > 0 
      THEN ROUND(((total_wins + CASE WHEN NEW.registration_id = winning_team_id THEN 1 ELSE 0 END)::DECIMAL / (total_matches + 1)) * 100, 2)
      ELSE 0 
    END
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_player_match_stats ON public.match_player_stats;
CREATE TRIGGER update_player_match_stats
  AFTER INSERT ON public.match_player_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_player_stats();
