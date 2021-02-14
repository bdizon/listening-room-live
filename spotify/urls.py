from django.urls import path
from .views import *

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),  # render index template whenever there is a blank path, "homepage"
    path('redirect', spotify_callback), # hit function, redirect to diff view (original app webpage)
    path('is-authenticated', IsAuthenticated.as_view()), # endpoint to IsAuthenticated
    path('current-song', CurrentSong.as_view()),    # endpoint to CurrentSong APIView, returns json of spotify info
    path('pause', PauseSong.as_view()),
    path('play', PlaySong.as_view()),
    path('skip', SkipSong.as_view()),

]