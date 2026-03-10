from django.contrib import admin
from .models import UserProfile, Guild, GuildMember, Scrim, Tournament, TournamentTeam, Match, LeaderboardEntry, ChatMessage, Notification

admin.site.register(UserProfile)
admin.site.register(Guild)
admin.site.register(GuildMember)
admin.site.register(Scrim)
admin.site.register(Tournament)
admin.site.register(TournamentTeam)
admin.site.register(Match)
admin.site.register(LeaderboardEntry)
admin.site.register(ChatMessage)
admin.site.register(Notification)
