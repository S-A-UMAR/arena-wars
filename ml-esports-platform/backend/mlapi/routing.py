from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/draft/(?P<room_name>\w+)/$', consumers.DraftConsumer.as_asgi()),
    re_path(r'ws/warroom/(?P<room_name>\w+)/$', consumers.WarRoomConsumer.as_asgi()),
]
