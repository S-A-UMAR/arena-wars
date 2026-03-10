from django.contrib.auth.models import User
from django.db.models import Q, Count
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .models import UserProfile, Guild, GuildMember, Scrim, Tournament, TournamentTeam, Match, LeaderboardEntry, ChatMessage, Notification
from .serializers import (
    UserSerializer,
    UserProfileSerializer,
    RegisterSerializer,
    GuildSerializer,
    GuildMemberSerializer,
    ScrimSerializer,
    TournamentSerializer,
    TournamentTeamSerializer,
    MatchSerializer,
    LeaderboardEntrySerializer,
    ChatMessageSerializer,
    NotificationSerializer,
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
        serializer.save(owner=self.request.user)

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
        entry, _ = TournamentTeam.objects.get_or_create(tournament=tournament, guild=guild)
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
