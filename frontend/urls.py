from django.urls import path
from .views import index

app_name = 'frontend' #django needs to know url.py file belongs to frontend app

urlpatterns = [
    path('', index, name=''),  # render index template whenever there is a blank path, "homepage"
    path('join', index),
    path('info', index),
    path('create', index),
    path('room/<str:roomCode>', index)  # dynamic url, accept any string
]