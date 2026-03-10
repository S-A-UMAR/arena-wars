from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile, Guild, GuildMember, Scrim, Tournament, TournamentTeam, Match, LeaderboardEntry, ChatMessage, Notification

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = UserProfile
        fields = ['user','ml_player_id','rank','main_role','country','bio','profile_image','main_heroes','win_rate','guild','join_date']

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
        fields = ['id','name','logo','description','owner','rank','discord_webhook_url','created_at']

class GuildMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = GuildMember
        fields = ['id','guild','user','role','joined_at']

class ScrimSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scrim
        fields = ['id','guild_a','guild_b','date','match_format','status','created_at']

class TournamentSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    champion = GuildSerializer(read_only=True)
    class Meta:
        model = Tournament
        fields = ['id','name','type','start_date','owner','champion','stream_url','is_active','created_at']

class TournamentTeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentTeam
        fields = ['id','tournament','guild','seed']

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['id','tournament','guild_a','guild_b','score_a','score_b','winner','match_date','round','bracket','replay_file','created_at']

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id','scrim','user','text','created_at']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id','type','content','is_read','created_at']

class LeaderboardEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaderboardEntry
        fields = ['id','entity_type','user','guild','name','wins','score','created_at']
