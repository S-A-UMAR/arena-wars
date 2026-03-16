-- Arena Wars Row Level Security Policies
-- Ensures data access is properly restricted

-- =============================================
-- PROFILES RLS
-- =============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view profiles
CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT USING (true);

-- Users can only insert their own profile
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- =============================================
-- GUILDS RLS
-- =============================================
ALTER TABLE public.guilds ENABLE ROW LEVEL SECURITY;

-- Anyone can view guilds
CREATE POLICY "guilds_select_all" ON public.guilds
  FOR SELECT USING (true);

-- Any authenticated user can create a guild
CREATE POLICY "guilds_insert_auth" ON public.guilds
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Only owner can update guild
CREATE POLICY "guilds_update_owner" ON public.guilds
  FOR UPDATE USING (auth.uid() = owner_id);

-- Only owner can delete guild
CREATE POLICY "guilds_delete_owner" ON public.guilds
  FOR DELETE USING (auth.uid() = owner_id);

-- =============================================
-- GUILD MEMBERS RLS
-- =============================================
ALTER TABLE public.guild_members ENABLE ROW LEVEL SECURITY;

-- Anyone can view guild members
CREATE POLICY "guild_members_select_all" ON public.guild_members
  FOR SELECT USING (true);

-- Guild owner/co-leaders can add members
CREATE POLICY "guild_members_insert" ON public.guild_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.guild_members gm
      WHERE gm.guild_id = guild_id
        AND gm.user_id = auth.uid()
        AND gm.role IN ('owner', 'co-leader')
    ) OR auth.uid() = user_id
  );

-- Guild owner can update member roles
CREATE POLICY "guild_members_update" ON public.guild_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.guilds g
      WHERE g.id = guild_id AND g.owner_id = auth.uid()
    )
  );

-- Members can leave, owners can remove
CREATE POLICY "guild_members_delete" ON public.guild_members
  FOR DELETE USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.guilds g
      WHERE g.id = guild_id AND g.owner_id = auth.uid()
    )
  );

-- =============================================
-- GUILD INVITES RLS
-- =============================================
ALTER TABLE public.guild_invites ENABLE ROW LEVEL SECURITY;

-- Users can see invites they sent or received
CREATE POLICY "guild_invites_select" ON public.guild_invites
  FOR SELECT USING (
    auth.uid() = inviter_id OR auth.uid() = invitee_id
  );

-- Guild leaders can send invites
CREATE POLICY "guild_invites_insert" ON public.guild_invites
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.guild_members gm
      WHERE gm.guild_id = guild_id
        AND gm.user_id = auth.uid()
        AND gm.role IN ('owner', 'co-leader', 'elder')
    )
  );

-- Invitees can update their invite (accept/decline)
CREATE POLICY "guild_invites_update" ON public.guild_invites
  FOR UPDATE USING (auth.uid() = invitee_id);

-- =============================================
-- TOURNAMENTS RLS
-- =============================================
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;

-- Anyone can view non-draft tournaments
CREATE POLICY "tournaments_select_public" ON public.tournaments
  FOR SELECT USING (status != 'draft' OR auth.uid() = organizer_id);

-- Authenticated users can create tournaments
CREATE POLICY "tournaments_insert_auth" ON public.tournaments
  FOR INSERT WITH CHECK (auth.uid() = organizer_id);

-- Organizers can update their tournaments
CREATE POLICY "tournaments_update_owner" ON public.tournaments
  FOR UPDATE USING (auth.uid() = organizer_id);

-- Organizers can delete draft tournaments
CREATE POLICY "tournaments_delete_owner" ON public.tournaments
  FOR DELETE USING (auth.uid() = organizer_id AND status = 'draft');

-- =============================================
-- TOURNAMENT REGISTRATIONS RLS
-- =============================================
ALTER TABLE public.tournament_registrations ENABLE ROW LEVEL SECURITY;

-- Anyone can view registrations
CREATE POLICY "registrations_select_all" ON public.tournament_registrations
  FOR SELECT USING (true);

-- Team captains can register
CREATE POLICY "registrations_insert" ON public.tournament_registrations
  FOR INSERT WITH CHECK (auth.uid() = captain_id);

-- Captains can update their registration
CREATE POLICY "registrations_update" ON public.tournament_registrations
  FOR UPDATE USING (
    auth.uid() = captain_id OR
    EXISTS (
      SELECT 1 FROM public.tournaments t
      WHERE t.id = tournament_id AND t.organizer_id = auth.uid()
    )
  );

-- =============================================
-- TOURNAMENT BRACKETS RLS
-- =============================================
ALTER TABLE public.tournament_brackets ENABLE ROW LEVEL SECURITY;

-- Anyone can view brackets
CREATE POLICY "brackets_select_all" ON public.tournament_brackets
  FOR SELECT USING (true);

-- Only tournament organizers can manage brackets
CREATE POLICY "brackets_insert_organizer" ON public.tournament_brackets
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tournaments t
      WHERE t.id = tournament_id AND t.organizer_id = auth.uid()
    )
  );

CREATE POLICY "brackets_update_organizer" ON public.tournament_brackets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.tournaments t
      WHERE t.id = tournament_id AND t.organizer_id = auth.uid()
    )
  );

-- =============================================
-- MATCHES RLS
-- =============================================
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Anyone can view matches
CREATE POLICY "matches_select_all" ON public.matches
  FOR SELECT USING (true);

-- Tournament organizers and team captains can manage matches
CREATE POLICY "matches_insert" ON public.matches
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tournament_brackets tb
      JOIN public.tournaments t ON t.id = tb.tournament_id
      WHERE tb.id = bracket_id AND t.organizer_id = auth.uid()
    )
  );

CREATE POLICY "matches_update" ON public.matches
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.tournament_brackets tb
      JOIN public.tournaments t ON t.id = tb.tournament_id
      WHERE tb.id = bracket_id AND (
        t.organizer_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.tournament_registrations tr
          WHERE (tr.id = tb.team1_registration_id OR tr.id = tb.team2_registration_id)
            AND tr.captain_id = auth.uid()
        )
      )
    )
  );

-- =============================================
-- MATCH PLAYER STATS RLS
-- =============================================
ALTER TABLE public.match_player_stats ENABLE ROW LEVEL SECURITY;

-- Anyone can view stats
CREATE POLICY "match_stats_select_all" ON public.match_player_stats
  FOR SELECT USING (true);

-- Stats are inserted by system/organizers
CREATE POLICY "match_stats_insert" ON public.match_player_stats
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.tournament_brackets tb ON tb.id = m.bracket_id
      JOIN public.tournaments t ON t.id = tb.tournament_id
      WHERE m.id = match_id AND t.organizer_id = auth.uid()
    )
  );

-- =============================================
-- SCRIMS RLS
-- =============================================
ALTER TABLE public.scrims ENABLE ROW LEVEL SECURITY;

-- Anyone can view open scrims
CREATE POLICY "scrims_select_all" ON public.scrims
  FOR SELECT USING (true);

-- Guild captains can create scrims
CREATE POLICY "scrims_insert" ON public.scrims
  FOR INSERT WITH CHECK (
    auth.uid() = host_captain_id AND
    EXISTS (
      SELECT 1 FROM public.guild_members gm
      WHERE gm.guild_id = host_guild_id
        AND gm.user_id = auth.uid()
        AND gm.role IN ('owner', 'co-leader')
    )
  );

-- Host captain can update scrim
CREATE POLICY "scrims_update" ON public.scrims
  FOR UPDATE USING (auth.uid() = host_captain_id);

-- Host captain can delete open scrims
CREATE POLICY "scrims_delete" ON public.scrims
  FOR DELETE USING (auth.uid() = host_captain_id AND status = 'open');

-- =============================================
-- SCRIM REQUESTS RLS
-- =============================================
ALTER TABLE public.scrim_requests ENABLE ROW LEVEL SECURITY;

-- Involved parties can view requests
CREATE POLICY "scrim_requests_select" ON public.scrim_requests
  FOR SELECT USING (
    auth.uid() = captain_id OR
    EXISTS (
      SELECT 1 FROM public.scrims s
      WHERE s.id = scrim_id AND s.host_captain_id = auth.uid()
    )
  );

-- Guild captains can send requests
CREATE POLICY "scrim_requests_insert" ON public.scrim_requests
  FOR INSERT WITH CHECK (auth.uid() = captain_id);

-- Host captain can update request status
CREATE POLICY "scrim_requests_update" ON public.scrim_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.scrims s
      WHERE s.id = scrim_id AND s.host_captain_id = auth.uid()
    )
  );

-- =============================================
-- CHAT ROOMS RLS
-- =============================================
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;

-- Users can see rooms they're part of
CREATE POLICY "chat_rooms_select" ON public.chat_rooms
  FOR SELECT USING (
    -- Guild chat: must be guild member
    (type = 'guild' AND EXISTS (
      SELECT 1 FROM public.guild_members gm
      WHERE gm.guild_id = guild_id AND gm.user_id = auth.uid()
    )) OR
    -- Direct messages: must be participant
    (type = 'direct' AND auth.uid() = ANY(participant_ids)) OR
    -- Tournament/match chat: any authenticated user
    (type IN ('tournament', 'match') AND auth.uid() IS NOT NULL) OR
    -- Scrim chat: involved guilds
    (type = 'scrim' AND EXISTS (
      SELECT 1 FROM public.scrims s
      WHERE s.id = scrim_id AND (
        s.host_captain_id = auth.uid() OR s.opponent_captain_id = auth.uid()
      )
    ))
  );

-- =============================================
-- CHAT MESSAGES RLS
-- =============================================
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can see messages in rooms they have access to
CREATE POLICY "chat_messages_select" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_rooms cr
      WHERE cr.id = room_id
    )
  );

-- Users can send messages
CREATE POLICY "chat_messages_insert" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Users can edit their own messages
CREATE POLICY "chat_messages_update" ON public.chat_messages
  FOR UPDATE USING (auth.uid() = sender_id);

-- =============================================
-- NOTIFICATIONS RLS
-- =============================================
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- System can insert notifications (service role)
CREATE POLICY "notifications_insert" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Users can update (mark as read) their notifications
CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their notifications
CREATE POLICY "notifications_delete_own" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- TRANSACTIONS RLS
-- =============================================
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Users can see their own transactions
CREATE POLICY "transactions_select_own" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Tournament organizers can see tournament transactions
CREATE POLICY "transactions_select_organizer" ON public.transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tournaments t
      WHERE t.id = tournament_id AND t.organizer_id = auth.uid()
    )
  );

-- =============================================
-- ACHIEVEMENTS RLS
-- =============================================
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Anyone can view achievements
CREATE POLICY "achievements_select_all" ON public.achievements
  FOR SELECT USING (true);

-- =============================================
-- USER ACHIEVEMENTS RLS
-- =============================================
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Anyone can view user achievements
CREATE POLICY "user_achievements_select_all" ON public.user_achievements
  FOR SELECT USING (true);

-- System inserts achievements
CREATE POLICY "user_achievements_insert" ON public.user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);
