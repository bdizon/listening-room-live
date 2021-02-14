from django.db import models
from api.models import Room

# Create your models here.
class SpotifyToken(models.Model):
    user = models.CharField(max_length=50, unique=True)     # host info
    create_at = models.DateField(auto_now_add=True)
    refresh_token = models.CharField(max_length=150)
    access_token = models.CharField(max_length=150)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)

# keep track of votes
class Vote(models.Model):
    user = models.CharField(max_length=50, unique=True)     # host info
    create_at = models.DateField(auto_now_add=True)
    song_id = models.CharField(max_length=50)   # need to keep track of song needed for voting 
    room = models.ForeignKey(Room, on_delete=models.CASCADE)   # pass instance of Room object, store reference to Room when voting; cascade down and delete any vote with room