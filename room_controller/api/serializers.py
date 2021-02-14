from rest_framework import serializers
from .models import Room

# take a room object and serialize to return as a response
class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'code', 'host', 'guest_can_pause', 'votes_to_skip', 'created_at')

# send post request to the endpoint
# post request to create something new
class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta: # make sure payload is valid
       model = Room
       fields = ('guest_can_pause', 'votes_to_skip') 

# update room serializer
class UpdateRoomSerializer(serializers.ModelSerializer):
    code = serializers.CharField(validators=[])   # redefine codefield in serializer istead of from models
    class Meta: # make sure payload is valid
       model = Room
       fields = ('guest_can_pause', 'votes_to_skip', 'code') # dont need to pass unique code bc code is just for checking