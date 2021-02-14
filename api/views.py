from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
# Create your views here.
# endpoints

# api view 
# view all rooms and create rooms
class RoomView(generics.ListAPIView): # sets up view
    queryset = Room.objects.all()   # what to return
    serializer_class = RoomSerializer   # convert to some format to return

# gets room and its details
class GetRoom(APIView): # inherit from APIView
    serializer_class = RoomSerializer   # define class
    lookup_url_kwarg = 'code'   # pass url with code we need

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)   # get what the code is from the url, get info about the url, find parameter in url that matches 'code'
        if code != None: 
            room = Room.objects.filter(code=code) # code is unique so it will always give us one value
            if len(room) > 0:
                data = RoomSerializer(room[0]).data   # serialize the one room and taking the data (python dict)
                data['is_host'] = self.request.session.session_key == room[0].host  # create new is_host a new key in the data, host is the session key of whoevers is the host of the session
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)

# send room code to join a room
# check for validity and then redirect
class JoinRoom(APIView):
    lookup_url_kwarg = 'code'   # pass url with code we need
    
    def post(self, request, format=None):  # post, not get, bc we want post that room was joined
        if not self.request.session.exists(self.request.session.session_key): # checking if current user does not have session
            self.request.session.create()   # then create a session

        code = request.data.get(self.lookup_url_kwarg)  # get what the code is from the url, get info about the url, find parameter in url that matches 'code'
        if code != None:
            room_result = Room.objects.filter(code=code)   # find room object we are looking for
            if len(room_result) > 0:
                room = room_result[0]
                self.request.session['room_code'] = code    # new key, tell us user current session is in room so they dont have to type code again
                return Response({"message": "Room Joined!"}, status=status.HTTP_200_OK)
            return Response({"Bad Request": "Invalid room code"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"Bad Request": "Invalid post data, did not find a code key"}, status=status.HTTP_400_BAD_REQUEST)

# automatically dispatch to correct method
# shows the creat-room page where the rooms can be created and changed
class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key): # checking if current user does not have session
            self.request.session.create()   # then create a session
        
        serializer = self.serializer_class(data=request.data) # take data and serialize it
        if serializer.is_valid():   # get valid data using valid serializer
            guest_can_pause = serializer.data.get('guest_can_pause') # method with field we want
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            # make sure the current session has the settings for the guest_can_pause and votes_to_skip
            queryset = Room.objects.filter(host=host) # check if any of the rooms have the same host
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip']) # updating and not creating new and saving, need update fields
                self.request.session['room_code'] = room.code    # new key, tell us user current session is in room so they dont have to type code again
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK) #json formatted data with status code
            else: # creating a new room
                room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                room.save()
                self.request.session['room_code'] = room.code    # new key, tell us user current session is in room so they dont have to type code again
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED) #json formatted data with status code

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

# get request to endpoint to check if current user session is in room
class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key): # checking if current user does not have session
            self.request.session.create()   # then create a session
        data = {
            'code': self.request.session.get('room_code')

        }
        # handle user not in room in frontend
        return JsonResponse(data, status=status.HTTP_200_OK) # take python dictionary and serialize using a json serializer sends it to the request

# leave room
class LeaveRoom(APIView):
    # post request bc changing info on api server
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')   # deletes room code fro user session
            host_id = self.request.session.session_key  # gets host_id for current user session
            room_results = Room.objects.filter(host=host_id)     # gets Room object that has host=host_id
            if len(room_results) > 0:   #   if Room object exists then delete
                room = room_results[0]
                room.delete()   # delete room

        return Response({"Message": "Success"}, status=status.HTTP_200_OK)

# update a room's setting
class UpdateRoom(APIView):
    # need info to be passed so we need a serializer class
    serializer_class = UpdateRoomSerializer
    # use patch for updating
    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key): # checking if current user does not have session
            self.request.session.create()   # then create a session

        serializer = self.serializer_class(data=request.data)   # pass data to serializer to check if data is valid
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            code = serializer.data.get('code')
            
            # find room
            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response({"msg" : "Room not found."}, status=status.HTTP_404_NOT_FOUND)
            
            room = queryset[0]
            user_id = self.request.session.session_key
            if room.host != user_id:
                return Response({"msg" : "You are not the host of this room."}, status=status.HTTP_403_FORBIDDEN)

            room.guest_can_pause = guest_can_pause
            room.votes_to_skip = votes_to_skip
            room.save(update_fields=['guest_can_pause', 'votes_to_skip'])     
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)    

        return Response({"Bad Request": "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)