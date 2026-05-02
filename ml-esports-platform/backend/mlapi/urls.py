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
    MatchDraftViewSet,
    PlayerStatsViewSet,
    DisputeViewSet,
    RecruitmentPostViewSet,
    NewsPostViewSet,
    GuildApplicationViewSet,
    DirectMessageViewSet,
    FriendshipViewSet,
    HeroBanViewSet,
    PrizeRecordViewSet,
    AnalyticsViewSet,
    search,
    health_check,
    GoogleLoginView,
    VerifyRegistrationView,
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
router.register('match-drafts', MatchDraftViewSet)
router.register('player-stats', PlayerStatsViewSet)
router.register('disputes', DisputeViewSet)
router.register('recruitment-posts', RecruitmentPostViewSet)
router.register('news-posts', NewsPostViewSet)
router.register('guild-applications', GuildApplicationViewSet)
router.register('direct-messages', DirectMessageViewSet)
router.register('friendships', FriendshipViewSet)
router.register('hero-bans', HeroBanViewSet)
router.register('prize-records', PrizeRecordViewSet)
router.register('analytics', AnalyticsViewSet, basename='analytics')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify-registration/', VerifyRegistrationView.as_view(), name='verify_registration'),
    path('auth/google/', GoogleLoginView.as_view()),
    path('search/', search, name='search'),
    path('health/', health_check, name='health_check'),
]
