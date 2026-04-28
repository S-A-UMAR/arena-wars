from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView,
    ProfileView,
    GuildViewSet,
    GuildMemberViewSet,
    ScrimViewSet,
    TournamentViewSet,
    TournamentTeamViewSet,
    MatchViewSet,
    LeaderboardEntryViewSet,
    ChatMessageViewSet,
    NotificationViewSet,
    search,
    health_check,
)

router = DefaultRouter()
router.register('register', RegisterView, basename='register')
router.register('profile', ProfileView, basename='profile')
router.register('guilds', GuildViewSet)
router.register('guild-members', GuildMemberViewSet)
router.register('scrims', ScrimViewSet)
router.register('tournaments', TournamentViewSet)
router.register('tournament-teams', TournamentTeamViewSet)
router.register('matches', MatchViewSet)
router.register('leaderboard', LeaderboardEntryViewSet)
router.register('chat-messages', ChatMessageViewSet)
router.register('notifications', NotificationViewSet, basename='notifications')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('search/', search, name='search'),
    path('health/', health_check, name='health_check'),
]
