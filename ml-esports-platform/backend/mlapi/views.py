from django.contrib.auth.models import User
from django.db.models import Q, Count
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .models import (
    UserProfile, Guild, GuildMember, Scrim, Tournament, TournamentTeam, 
    Match, LeaderboardEntry, ChatMessage, Notification, MatchDraft, 
    PlayerStats, Dispute, RecruitmentPost, NewsPost, GuildApplication, 
    GuildPost, DirectMessage, Friendship
)
from .serializers import (
    UserSerializer, UserProfileSerializer, RegisterSerializer, 
    GuildSerializer, GuildMemberSerializer, ScrimSerializer, 
    TournamentSerializer, TournamentTeamSerializer, MatchSerializer, 
    LeaderboardEntrySerializer, ChatMessageSerializer, NotificationSerializer, 
    MatchDraftSerializer, PlayerStatsSerializer, DisputeSerializer, 
    RecruitmentPostSerializer, NewsPostSerializer, GuildApplicationSerializer, 
    GuildPostSerializer, DirectMessageSerializer, FriendshipSerializer
)
import json
from urllib import request as urlrequest

class RegisterView(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    def create(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    def list(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return Response(UserProfileSerializer(profile).data)
    def update(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GuildViewSet(viewsets.ModelViewSet):
    queryset = Guild.objects.all().order_by('-rank','-created_at')
    serializer_class = GuildSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    def perform_create(self, serializer):
        guild = serializer.save(owner=self.request.user)
        GuildMember.objects.create(guild=guild, user=self.request.user, role='Leader')

    @action(detail=True, methods=['post'])
    def apply(self, request, pk=None):
        guild = self.get_object()
        message = request.data.get('message', '')
        app, created = GuildApplication.objects.get_or_create(guild=guild, user=request.user, status='pending')
        if created:
            app.message = message
            app.save()
        return Response(GuildApplicationSerializer(app).data)

    @action(detail=True, methods=['post'])
    def kick_member(self, request, pk=None):
        guild = self.get_object()
        if guild.owner != request.user:
            return Response({'error': 'Forbidden'}, status=403)
        user_id = request.data.get('user_id')
        GuildMember.objects.filter(guild=guild, user_id=user_id).delete()
        return Response({'status': 'kicked'})

    @action(detail=True, methods=['post'])
    def add_post(self, request, pk=None):
        guild = self.get_object()
        if not GuildMember.objects.filter(guild=guild, user=request.user).exists():
            return Response({'error': 'Not a member'}, status=403)
        content = request.data.get('content')
        post = GuildPost.objects.create(guild=guild, author=request.user, content=content)
        return Response(GuildPostSerializer(post).data)

    @action(detail=True, methods=['get'])
    def social_wall(self, request, pk=None):
        guild = self.get_object()
        posts = guild.posts.all().order_by('-created_at')
        return Response(GuildPostSerializer(posts, many=True).data)

    def award_xp(self, guild, amount):
        guild.xp += amount
        if guild.xp >= guild.level * 1000:
            guild.level += 1
            guild.xp = 0
        guild.save()

class GuildMemberViewSet(viewsets.ModelViewSet):
    queryset = GuildMember.objects.all()
    serializer_class = GuildMemberSerializer
    permission_classes = [permissions.IsAuthenticated]
    @action(detail=False, methods=['post'])
    def join(self, request):
        guild_id = request.data.get('guild')
        guild = Guild.objects.get(id=guild_id)
        gm, _ = GuildMember.objects.get_or_create(guild=guild, user=request.user)
        return Response(GuildMemberSerializer(gm).data)
    @action(detail=False, methods=['post'])
    def leave(self, request):
        guild_id = request.data.get('guild')
        GuildMember.objects.filter(guild_id=guild_id, user=request.user).delete()
        return Response({'status':'left'})

import firebase_admin
import json
import os
from firebase_admin import auth as firebase_auth, credentials
from rest_framework_simplejwt.tokens import RefreshToken

# Initialize Firebase Admin
try:
    service_account_info = os.environ.get('FIREBASE_SERVICE_ACCOUNT_JSON')
    if service_account_info:
        cred = credentials.Certificate(json.loads(service_account_info))
        firebase_admin.initialize_app(cred)
    else:
        firebase_admin.initialize_app()
except (ValueError, json.JSONDecodeError):
    pass 

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'Token required'}, status=400)
            
        try:
            # Verify the ID token sent from the client
            decoded_token = firebase_auth.verify_id_token(token)
            uid = decoded_token['uid']
            email = decoded_token.get('email')
            name = decoded_token.get('name', '')
            
            if not email:
                return Response({'error': 'Email not provided by Google'}, status=400)
                
            # Get or create user
            user, created = User.objects.get_or_create(email=email, defaults={
                'username': email.split('@')[0] + '_' + uid[:4],
                'first_name': name
            })
            
            # Ensure profile exists
            UserProfile.objects.get_or_create(user=user)
            
            # Generate JWT
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data,
                'created': created
            })
            
        except Exception as e:
            return Response({'error': str(e)}, status=400)

class ScrimViewSet(viewsets.ModelViewSet):
    queryset = Scrim.objects.all().order_by('-date')
    serializer_class = ScrimSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    def perform_create(self, serializer):
        scrim = serializer.save()
        owners = []
        if scrim.guild_a.discord_webhook_url:
            owners.append(scrim.guild_a.discord_webhook_url)
        if scrim.guild_b.discord_webhook_url:
            owners.append(scrim.guild_b.discord_webhook_url)
        for hook in owners:
            try:
                payload = {'content': f'Scrim requested: {scrim.guild_a.name} vs {scrim.guild_b.name} on {scrim.date.isoformat()}'}
                data = json.dumps(payload).encode('utf-8')
                req = urlrequest.Request(hook, data=data, headers={'Content-Type': 'application/json'})
                urlrequest.urlopen(req, timeout=5)
            except Exception:
                pass

class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all().order_by('-created_at')
    serializer_class = TournamentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    @action(detail=True, methods=['post'])
    def register_guild(self, request, pk=None):
        tournament = self.get_object()
        guild_id = request.data.get('guild')
        guild = Guild.objects.get(id=guild_id)
        
        # Security: Only guild leader can register
        if guild.owner != request.user:
            return Response({'error': 'Only the Guild Leader can register for tournaments.'}, status=403)
        
        # Check Slots
        if tournament.teams.count() >= tournament.max_slots:
            return Response({'error': 'This tournament is full.'}, status=400)
            
        entry, created = TournamentTeam.objects.get_or_create(tournament=tournament, guild=guild)
        return Response(TournamentTeamSerializer(entry).data)
    @action(detail=True, methods=['post'])
    def generate_bracket(self, request, pk=None):
        tournament = self.get_object()
        teams = list(tournament.teams.all().order_by('seed','id'))
        pairs = []
        for i in range(0, len(teams), 2):
            if i+1 < len(teams):
                pairs.append((teams[i].guild, teams[i+1].guild))
        created = []
        for a,b in pairs:
            m = Match.objects.create(
                tournament=tournament,
                guild_a=a,
                guild_b=b,
                match_date=tournament.start_date,
                round=1,
                bracket='W' if tournament.type=='double' else ''
            )
            created.append(m)
        return Response({'matches': MatchSerializer(created, many=True).data})

class TournamentTeamViewSet(viewsets.ModelViewSet):
    queryset = TournamentTeam.objects.all()
    serializer_class = TournamentTeamSerializer
    permission_classes = [permissions.IsAuthenticated]

class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all().order_by('-match_date')
    serializer_class = MatchSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    @action(detail=True, methods=['post'])
    def check_in(self, request, pk=None):
        match = self.get_object()
        guild_id = request.data.get('guild_id')
        if not guild_id:
            return Response({'error': 'guild_id required'}, status=400)
        
        # Verify user belongs to the guild and is leader/officer
        if not GuildMember.objects.filter(guild_id=guild_id, user=request.user, role__in=['Leader', 'Officer']).exists():
            return Response({'error': 'Unauthorized'}, status=403)

        if int(guild_id) == match.guild_a_id:
            match.guild_a_checked_in = True
        elif int(guild_id) == match.guild_b_id:
            match.guild_b_checked_in = True
        else:
            return Response({'error': 'Guild not in this match'}, status=400)
        
        match.save()
        return Response(MatchSerializer(match).data)

    @action(detail=True, methods=['post'])
    def update_room(self, request, pk=None):
        match = self.get_object()
        if match.tournament.owner != request.user:
            return Response({'error': 'Only tournament owner can update room info'}, status=403)
        
        match.room_id = request.data.get('room_id', match.room_id)
        match.room_password = request.data.get('room_password', match.room_password)
        match.save()
        return Response(MatchSerializer(match).data)

    @action(detail=True, methods=['post'])
    def submit_result(self, request, pk=None):
        match = self.get_object()
        guild_id = request.data.get('guild_id')
        if not GuildMember.objects.filter(guild_id=guild_id, user=request.user, role__in=['Leader', 'Officer']).exists():
            return Response({'error': 'Unauthorized'}, status=403)
        
        match.result_image = request.FILES.get('result_image')
        match.status = 'Completed'
        match.save()
        return Response(MatchSerializer(match).data)

    @action(detail=True, methods=['post'])
    def record_result(self, request, pk=None):
        match = self.get_object()
        score_a = int(request.data.get('score_a', match.score_a))
        score_b = int(request.data.get('score_b', match.score_b))
        match.score_a = score_a
        match.score_b = score_b
        match.winner = match.guild_a if score_a > score_b else (match.guild_b if score_b > score_a else None)
        match.save()
        return Response(MatchSerializer(match).data)
    @action(detail=True, methods=['post'])
    def upload_replay(self, request, pk=None):
        match = self.get_object()
        f = request.FILES.get('replay_file')
        if f:
            match.replay_file = f
            match.save()
        return Response(MatchSerializer(match).data)
    @action(detail=False, methods=['get'])
    def by_tournament(self, request):
        tid = request.query_params.get('tournament')
        qs = self.queryset.filter(tournament_id=tid).order_by('round','match_date')
        return Response(MatchSerializer(qs, many=True).data)

class LeaderboardEntryViewSet(viewsets.ModelViewSet):
    queryset = LeaderboardEntry.objects.all().order_by('-score','-wins')
    serializer_class = LeaderboardEntrySerializer
    permission_classes = [permissions.AllowAny]

class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all().order_by('-created_at')
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    def list(self, request):
        scrim_id = request.query_params.get('scrim')
        qs = ChatMessage.objects.filter(scrim_id=scrim_id).order_by('created_at')
        return Response(ChatMessageSerializer(qs, many=True).data)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def search(request):
    q = request.query_params.get('q','').strip()
    users = User.objects.filter(Q(username__icontains=q))[:10]
    guilds = Guild.objects.filter(Q(name__icontains=q))[:10]
    tournaments = Tournament.objects.filter(Q(name__icontains=q))[:10]
    return Response({
        'players': [UserSerializer(u).data for u in users],
        'guilds': [GuildSerializer(g).data for g in guilds],
        'tournaments': [TournamentSerializer(t).data for t in tournaments],
    })
class MatchDraftViewSet(viewsets.ModelViewSet):
    queryset = MatchDraft.objects.all()
    serializer_class = MatchDraftSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class PlayerStatsViewSet(viewsets.ModelViewSet):
    queryset = PlayerStats.objects.all()
    serializer_class = PlayerStatsSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    @action(detail=False, methods=['get'])
    def by_match(self, request):
        match_id = request.query_params.get('match')
        qs = self.queryset.filter(match_id=match_id)
        return Response(PlayerStatsSerializer(qs, many=True).data)

class DisputeViewSet(viewsets.ModelViewSet):
    queryset = Dispute.objects.all()
    serializer_class = DisputeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        if not request.user.is_staff:
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        dispute = self.get_object()
        dispute.status = 'resolved'
        dispute.save()
        return Response(DisputeSerializer(dispute).data)

class RecruitmentPostViewSet(viewsets.ModelViewSet):
    queryset = RecruitmentPost.objects.all().order_by('-created_at')
    serializer_class = RecruitmentPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class NewsPostViewSet(viewsets.ModelViewSet):
    queryset = NewsPost.objects.all().order_by('-created_at')
    serializer_class = NewsPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class GuildApplicationViewSet(viewsets.ModelViewSet):
    queryset = GuildApplication.objects.all()
    serializer_class = GuildApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def respond(self, request, pk=None):
        app = self.get_object()
        if app.guild.owner != request.user:
            return Response({'error': 'Forbidden'}, status=403)
        status = request.data.get('status')
        if status == 'accepted':
            GuildMember.objects.get_or_create(guild=app.guild, user=app.user, role='Recruit')
        app.status = status
        app.save()
        return Response(GuildApplicationSerializer(app).data)

class DirectMessageViewSet(viewsets.ModelViewSet):
    queryset = DirectMessage.objects.all()
    serializer_class = DirectMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DirectMessage.objects.filter(Q(sender=self.request.user) | Q(receiver=self.request.user)).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

class FriendshipViewSet(viewsets.ModelViewSet):
    queryset = Friendship.objects.all()
    serializer_class = FriendshipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Friendship.objects.filter(Q(user_a=self.request.user) | Q(user_b=self.request.user))

    def perform_create(self, serializer):
        serializer.save(user_a=self.request.user)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health_check(request):
    try:
        from django.db import connection
        connection.ensure_connection()
        return Response({'status': 'healthy', 'database': 'connected'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'status': 'unhealthy', 'error': str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
