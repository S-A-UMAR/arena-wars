from django.contrib.auth.models import User
from rest_framework import serializers
from .models import (
    UserProfile, Guild, GuildMember, Scrim, Tournament, TournamentTeam, 
    Match, LeaderboardEntry, ChatMessage, Notification, PrizeRecord, MatchDraft, 
    PlayerStats, Dispute, RecruitmentPost, NewsPost, GuildApplication, 
    GuildPost, DirectMessage, Friendship, HeroBan
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email','is_staff','is_superuser']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = UserProfile
        fields = ['user','ml_player_id','rank','main_role','preferred_lane','country','bio','profile_image','main_heroes','win_rate','guild','mythic_points','credit_score','preferred_roles','is_free_agent','join_date']

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    ml_player_id = serializers.CharField(required=False, allow_blank=True)
    rank = serializers.CharField(required=False, allow_blank=True)
    main_role = serializers.CharField(required=False, allow_blank=True)
    country = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        username = validated_data['username']
        email = validated_data['email']
        password = validated_data['password']
        user = User.objects.create_user(username=username, email=email, password=password)
        UserProfile.objects.create(
            user=user,
            ml_player_id=validated_data.get('ml_player_id',''),
            rank=validated_data.get('rank',''),
            main_role=validated_data.get('main_role',''),
            country=validated_data.get('country','')
        )
        return user

class GuildSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    class Meta:
        model = Guild
        fields = ['id','name','tag','logo','description','owner','country','join_policy','rank','xp','level','is_private','max_slots','discord_webhook_url','created_at']

class GuildApplicationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = GuildApplication
        fields = '__all__'

class GuildPostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    class Meta:
        model = GuildPost
        fields = '__all__'

class DirectMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DirectMessage
        fields = '__all__'

class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = '__all__'

class GuildMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = GuildMember
        fields = ['id','guild','user','role','joined_at']

class ScrimSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scrim
        fields = ['id','guild_a','guild_b','date','match_format','status','bounty','created_at']

class TournamentSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    teams_count = serializers.IntegerField(source='teams.count', read_only=True)
    class Meta:
        model = Tournament
        fields = ['id','name','description','rules','type','start_date','prize_pool','prize_pool_distribution','check_in_window','max_slots','is_free_to_join','guild_only','status','owner','champion','stream_url','teams_count','created_at']

class MatchSerializer(serializers.ModelSerializer):
    guild_a_name = serializers.CharField(source='guild_a.name', read_only=True)
    guild_b_name = serializers.CharField(source='guild_b.name', read_only=True)
    guild_a_logo = serializers.ImageField(source='guild_a.logo', read_only=True)
    guild_b_logo = serializers.ImageField(source='guild_b.logo', read_only=True)
    class Meta:
        model = Match
        fields = ['id','tournament','guild_a','guild_b','guild_a_name','guild_b_name','guild_a_logo','guild_b_logo','score_a','score_b','room_id','room_password','result_image','guild_a_checked_in','guild_b_checked_in','winner','match_date','round','bracket','replay_file','created_at']

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id','scrim','user','text','created_at']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id','title','message','type','is_read','created_at']

class LeaderboardEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaderboardEntry
        fields = ['id','entity_type','user','guild','name','wins','score','created_at']

class MatchDraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchDraft
        fields = '__all__'

class PlayerStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerStats
        fields = '__all__'

class DisputeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dispute
        fields = '__all__'

class TournamentTeamSerializer(serializers.ModelSerializer):
    guild_name = serializers.CharField(source='guild.name', read_only=True)
    guild_logo = serializers.ImageField(source='guild.logo', read_only=True)
    class Meta:
        model = TournamentTeam
        fields = ['id','tournament','guild','guild_name','guild_logo','seed','main_players','sub_players']


class HeroBanSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroBan
        fields = '__all__'

class PrizeRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrizeRecord
        fields = '__all__'

class RecruitmentPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruitmentPost
        fields = '__all__'

class NewsPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsPost
        fields = '__all__'
