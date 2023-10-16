# views.py
from rest_framework.authentication import get_authorization_header
from .models import User
from .authentication import *
from rest_framework.response import Response
from rest_framework import  status
import codecs

def auth_check(request):
    auth = get_authorization_header(request).split()

    if auth and len(auth) == 2:
        token = auth[1].decode('utf-8')
        id = decode_refresh_token(token)

        user = User.objects.filter(pk=id).first()

        #deneme = User.objects.filter(user=user).first()
        return user.id
            
    return Response({'error': 'Authentication failed.'}, status=status.HTTP_401_UNAUTHORIZED)

def decode_location_name(location):
    location['name'] = codecs.decode(location['name'], 'unicode_escape')
    return location