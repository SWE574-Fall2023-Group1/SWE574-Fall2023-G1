from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework import exceptions


def create_access_token(id):
    refresh = RefreshToken.for_user(id)
    return {
        'user_id': id,
        'access_token': str(refresh.access_token),
        'refresh_token': str(refresh)
    }


def decode_access_token(token):
    try:
        access_token = AccessToken(token)
        return access_token['user_id']
    except Exception as e:
        raise exceptions.AuthenticationFailed('unauthenticated')


def create_refresh_token(id):
    refresh = RefreshToken.for_user(id)
    return str(refresh)


def decode_refresh_token(token):
    try:
        refresh_token = RefreshToken(token)
        return refresh_token['user_id']
    except Exception as e:
        raise exceptions.AuthenticationFailed('unauthenticated')
