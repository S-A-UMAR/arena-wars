-- Seed achievements for the platform

INSERT INTO public.achievements (name, description, icon, category, requirement_type, requirement_value, points, is_secret)
VALUES
  -- Tournament Achievements
  ('First Blood', 'Win your first tournament match', 'trophy', 'tournament', 'tournament_wins', 1, 10, false),
  ('Tournament Victor', 'Win your first tournament', 'crown', 'tournament', 'tournaments_won', 1, 50, false),
  ('Champion', 'Win 5 tournaments', 'medal', 'tournament', 'tournaments_won', 5, 100, false),
  ('Legend', 'Win 25 tournaments', 'star', 'tournament', 'tournaments_won', 25, 500, false),
  ('Grand Master', 'Win 100 tournaments', 'gem', 'tournament', 'tournaments_won', 100, 1000, true),
  
  -- Match Achievements
  ('Warrior', 'Play 10 matches', 'sword', 'match', 'total_matches', 10, 10, false),
  ('Veteran', 'Play 100 matches', 'shield', 'match', 'total_matches', 100, 50, false),
  ('Battle Hardened', 'Play 500 matches', 'axe', 'match', 'total_matches', 500, 100, false),
  ('Living Legend', 'Play 1000 matches', 'fire', 'match', 'total_matches', 1000, 250, false),
  ('MVP Machine', 'Get MVP 10 times', 'star', 'match', 'total_mvps', 10, 25, false),
  ('MVP Legend', 'Get MVP 100 times', 'sparkles', 'match', 'total_mvps', 100, 150, false),
  ('Unbeatable', 'Maintain 70%+ win rate over 50 matches', 'flame', 'match', 'win_rate_70', 50, 200, false),
  
  -- Guild Achievements
  ('Team Player', 'Join a guild', 'users', 'guild', 'guild_join', 1, 10, false),
  ('Guild Founder', 'Create a guild', 'flag', 'guild', 'guild_create', 1, 25, false),
  ('Guild Champion', 'Win a tournament with your guild', 'trophy', 'guild', 'guild_tournament_win', 1, 75, false),
  ('Dynasty', 'Win 10 tournaments with your guild', 'castle', 'guild', 'guild_tournament_win', 10, 300, true),
  
  -- Social Achievements
  ('Friendly', 'Add 5 friends', 'heart', 'social', 'friends_count', 5, 10, false),
  ('Popular', 'Add 25 friends', 'star', 'social', 'friends_count', 25, 25, false),
  ('Influencer', 'Add 100 friends', 'megaphone', 'social', 'friends_count', 100, 100, true),
  ('Scrim Master', 'Complete 50 scrims', 'swords', 'social', 'scrims_completed', 50, 75, false),
  
  -- Milestone Achievements
  ('Rising Star', 'Reach 1200 ELO', 'trending-up', 'milestone', 'elo_rating', 1200, 25, false),
  ('Elite', 'Reach 1500 ELO', 'zap', 'milestone', 'elo_rating', 1500, 75, false),
  ('Master', 'Reach 1800 ELO', 'crown', 'milestone', 'elo_rating', 1800, 150, false),
  ('Grandmaster', 'Reach 2000 ELO', 'diamond', 'milestone', 'elo_rating', 2000, 300, false),
  ('Mythic', 'Reach 2500 ELO', 'flame', 'milestone', 'elo_rating', 2500, 500, true),
  ('Money Maker', 'Earn $100 in prize money', 'dollar-sign', 'milestone', 'total_earnings', 100, 50, false),
  ('High Roller', 'Earn $1000 in prize money', 'banknote', 'milestone', 'total_earnings', 1000, 200, false),
  ('Big Money', 'Earn $10000 in prize money', 'gem', 'milestone', 'total_earnings', 10000, 500, true)
ON CONFLICT (name) DO NOTHING;
