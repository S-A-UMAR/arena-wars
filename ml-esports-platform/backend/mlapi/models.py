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
    win_rate = models.FloatField(default=0.0)
    guild = models.ForeignKey('Guild', on_delete=models.SET_NULL, null=True, blank=True, related_name='members_profiles')
    join_date = models.DateTimeField(auto_now_add=True)

class Guild(models.Model):
    name = models.CharField(max_length=128, unique=True)
    logo = models.ImageField(upload_to='guilds/', blank=True, null=True)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_guilds')
    rank = models.IntegerField(default=0)
    discord_webhook_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class GuildMember(models.Model):
    guild = models.ForeignKey(Guild, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='guild_memberships')
    role = models.CharField(max_length=32, default='member')
    joined_at = models.DateTimeField(auto_now_add=True)

class Scrim(models.Model):
    guild_a = models.ForeignKey(Guild, on_delete=models.CASCADE, related_name='scrims_as_a')
    guild_b = models.ForeignKey(Guild, on_delete=models.CASCADE, related_name='scrims_as_b')
    date = models.DateTimeField()
    match_format = models.CharField(max_length=8, choices=[('BO1','BO1'),('BO3','BO3'),('BO5','BO5')])
    status = models.CharField(max_length=16, choices=[('pending','pending'),('accepted','accepted'),('completed','completed')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

class Tournament(models.Model):
    name = models.CharField(max_length=128)
    type = models.CharField(max_length=16, choices=[('single','single'),('double','double')])
    start_date = models.DateTimeField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tournaments')
    champion = models.ForeignKey(Guild, on_delete=models.SET_NULL, null=True, blank=True, related_name='won_tournaments')
    stream_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class TournamentTeam(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='teams')
    guild = models.ForeignKey(Guild, on_delete=models.CASCADE, related_name='tournament_entries')
    seed = models.IntegerField(default=0)

class Match(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.SET_NULL, null=True, blank=True, related_name='matches')
    guild_a = models.ForeignKey(Guild, on_delete=models.CASCADE, related_name='matches_as_a')
    guild_b = models.ForeignKey(Guild, on_delete=models.CASCADE, related_name='matches_as_b')
    score_a = models.IntegerField(default=0)
    score_b = models.IntegerField(default=0)
    winner = models.ForeignKey(Guild, on_delete=models.SET_NULL, null=True, blank=True, related_name='won_matches')
    match_date = models.DateTimeField()
    round = models.IntegerField(default=1)
    bracket = models.CharField(max_length=1, choices=[('W','W'),('L','L')], blank=True)
    replay_file = models.FileField(upload_to='replays/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

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

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=32)
    content = models.CharField(max_length=256)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
