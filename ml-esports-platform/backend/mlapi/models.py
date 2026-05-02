from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    ml_player_id = models.CharField(max_length=64, blank=True)
    rank = models.CharField(max_length=64, blank=True)
    main_role = models.CharField(max_length=64, blank=True)
    country = models.CharField(max_length=64, blank=True)
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    main_heroes = models.JSONField(default=list, blank=True)
    preferred_lane = models.CharField(max_length=32, choices=[('Jungle','Jungle'),('Mid','Mid'),('Gold','Gold'),('EXP','EXP'),('Roam','Roam')], blank=True)
    win_rate = models.FloatField(default=0.0)
    online_status = models.CharField(max_length=32, choices=[('Online','Online'),('In-Match','In-Match'),('Away','Away'),('Offline','Offline')], default='Offline')
    guild = models.ForeignKey('Guild', on_delete=models.SET_NULL, null=True, blank=True, related_name='members_profiles')
    mythic_points = models.IntegerField(default=0)
    credit_score = models.IntegerField(default=100)
    preferred_roles = models.JSONField(default=list, blank=True)
    is_free_agent = models.BooleanField(default=False)
    join_date = models.DateTimeField(auto_now_add=True)

class Guild(models.Model):
    name = models.CharField(max_length=128, unique=True)
    tag = models.CharField(max_length=8, unique=True, blank=True, null=True)
    logo = models.ImageField(upload_to='guilds/', blank=True, null=True)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_guilds')
    country = models.CharField(max_length=64, blank=True)
    join_policy = models.CharField(max_length=32, choices=[('Open','Open'),('Request','Request Only'),('Password','Password Protected')], default='Open')
    rank = models.IntegerField(default=0)
    xp = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    is_private = models.BooleanField(default=False)
    max_slots = models.IntegerField(default=10)
    discord_webhook_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class GuildMember(models.Model):
    guild = models.ForeignKey(Guild, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='guild_memberships')
    role = models.CharField(max_length=32, choices=[('Leader','Leader'),('Officer','Officer'),('Veteran','Veteran'),('Member','Member'),('Recruit','Recruit')], default='Member')
    joined_at = models.DateTimeField(auto_now_add=True)

class GuildApplication(models.Model):
    guild = models.ForeignKey(Guild, on_delete=models.CASCADE, related_name='applications')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField(blank=True)
    status = models.CharField(max_length=32, choices=[('pending','pending'),('accepted','accepted'),('rejected','rejected')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

class GuildPost(models.Model):
    guild = models.ForeignKey(Guild, on_delete=models.CASCADE, related_name='posts')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class DirectMessage(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Friendship(models.Model):
    user_a = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friends_a')
    user_b = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friends_b')
    status = models.CharField(max_length=32, choices=[('pending','pending'),('accepted','accepted')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

class Scrim(models.Model):
    guild_a = models.ForeignKey(Guild, on_delete=models.CASCADE, related_name='scrims_as_a')
    guild_b = models.ForeignKey(Guild, on_delete=models.CASCADE, related_name='scrims_as_b')
    date = models.DateTimeField()
    match_format = models.CharField(max_length=8, choices=[('BO1','BO1'),('BO3','BO3'),('BO5','BO5')])
    status = models.CharField(max_length=16, choices=[('pending','pending'),('accepted','accepted'),('completed','completed')], default='pending')
    bounty = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class Tournament(models.Model):
    name = models.CharField(max_length=128)
    description = models.TextField(blank=True, null=True)
    rules = models.TextField(blank=True)
    type = models.CharField(max_length=16, choices=[('single','single'),('double','double')])
    start_date = models.DateTimeField()
    prize_pool = models.CharField(max_length=128, blank=True, null=True)
    prize_pool_distribution = models.JSONField(default=dict, blank=True)
    check_in_window = models.IntegerField(default=30)
    max_slots = models.IntegerField(default=16, choices=[(8, 8), (16, 16), (32, 32), (64, 64)])
    is_free_to_join = models.BooleanField(default=True)
    guild_only = models.BooleanField(default=True)
    status = models.CharField(max_length=16, choices=[('draft','Draft'),('coming_soon','Coming Soon'),('open','Open'),('live','Live'),('completed','Completed')], default='open')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tournaments')
    champion = models.ForeignKey(Guild, on_delete=models.SET_NULL, null=True, blank=True, related_name='won_tournaments')
    stream_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class TournamentTeam(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='teams')
    guild = models.ForeignKey(Guild, on_delete=models.CASCADE, related_name='tournament_entries')
    seed = models.IntegerField(default=0)
    main_players = models.ManyToManyField(User, related_name='tournament_main_roles', blank=True)
    sub_players = models.ManyToManyField(User, related_name='tournament_sub_roles', blank=True)

class HeroBan(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='hero_bans')
    hero_name = models.CharField(max_length=64)
    ban_count = models.IntegerField(default=1)
    
class Match(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.SET_NULL, null=True, blank=True, related_name='matches')
    guild_a = models.ForeignKey(Guild, on_delete=models.CASCADE, related_name='matches_as_a')
    guild_b = models.ForeignKey(Guild, on_delete=models.CASCADE, related_name='matches_as_b')
    score_a = models.IntegerField(default=0)
    score_b = models.IntegerField(default=0)
    
    # Live Stats
    team_a_kills = models.IntegerField(default=0)
    team_b_kills = models.IntegerField(default=0)
    team_a_gold = models.IntegerField(default=0)
    team_b_gold = models.IntegerField(default=0)
    bans_a = models.JSONField(default=list, blank=True)
    bans_b = models.JSONField(default=list, blank=True)
    picks_a = models.JSONField(default=list, blank=True)
    picks_b = models.JSONField(default=list, blank=True)
    hype_score = models.IntegerField(default=0) # Total hype/cheers
    
    room_id = models.CharField(max_length=64, blank=True)
    room_password = models.CharField(max_length=64, blank=True)
    result_image = models.ImageField(upload_to='results/', blank=True, null=True)
    guild_a_checked_in = models.BooleanField(default=False)
    guild_b_checked_in = models.BooleanField(default=False)
    winner = models.ForeignKey(Guild, on_delete=models.SET_NULL, null=True, blank=True, related_name='won_matches')
    match_date = models.DateTimeField()
    round = models.IntegerField(default=1)
    status = models.CharField(max_length=20, default='scheduled') # scheduled, live, completed, disputed
    bracket = models.CharField(max_length=1, choices=[('W','W'),('L','L')], blank=True)
    replay_file = models.FileField(upload_to='replays/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=128, default='')
    message = models.TextField(default='')
    type = models.CharField(max_length=32, default='info')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class PrizeRecord(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='prize_history')
    guild = models.ForeignKey(Guild, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    rank = models.IntegerField()
    distributed_at = models.DateTimeField(auto_now_add=True)

class LeaderboardEntry(models.Model):
    entity_type = models.CharField(max_length=16, choices=[('player','player'),('guild','guild'),('tournament','tournament')])
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    guild = models.ForeignKey(Guild, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=128)
    wins = models.IntegerField(default=0)
    score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class ChatMessage(models.Model):
    scrim = models.ForeignKey(Scrim, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class MatchDraft(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='drafts')
    team_a_bans = models.JSONField(default=list, blank=True)
    team_b_bans = models.JSONField(default=list, blank=True)
    team_a_picks = models.JSONField(default=list, blank=True)
    team_b_picks = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class PlayerStats(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='player_stats')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    kills = models.IntegerField(default=0)
    deaths = models.IntegerField(default=0)
    assists = models.IntegerField(default=0)
    gold = models.IntegerField(default=0)
    hero_played = models.CharField(max_length=64, blank=True)
    is_mvp = models.BooleanField(default=False)

class Dispute(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='disputes')
    submitted_by = models.ForeignKey(User, on_delete=models.CASCADE)
    reason = models.TextField()
    screenshot = models.ImageField(upload_to='disputes/', blank=True, null=True)
    status = models.CharField(max_length=32, choices=[('pending','pending'),('resolved','resolved')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

class RecruitmentPost(models.Model):
    guild = models.ForeignKey(Guild, on_delete=models.CASCADE, related_name='recruitment_posts')
    role_needed = models.CharField(max_length=64)
    min_rank = models.CharField(max_length=64)
    description = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class NewsPost(models.Model):
    title = models.CharField(max_length=128)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    image = models.ImageField(upload_to='news/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class VerificationCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='verification_codes')
    code = models.CharField(max_length=6)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
