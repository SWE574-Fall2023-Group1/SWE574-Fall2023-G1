import jwt
from datetime import datetime, timedelta
from rest_framework import exceptions

def create_access_token(id):
    token = jwt.encode({
        'user_id':id,
        'exp':datetime.utcnow() + timedelta(seconds=300),
        'iat': datetime.utcnow()
    }, 'access_secret', algorithm='HS256')
    token_new = token.decode('utf-8')
    return  token_new

def decode_access_token(token):
    print(token)
    print(type(token))
    try:
        payload = jwt.decode(token, 'access_secret', algorithms= ['HS256'])
        print(payload)
        return payload['user_id']

    except:
        raise exceptions.AuthenticationFailed('unauthenticated')

def create_refresh_token(id):
    token  = jwt.encode({
        'user_id':id,
        'exp':datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow()
    }, 'refresh_secret', algorithm='HS256')
    token_new = token.decode('utf-8')
    return  token_new

def decode_refresh_token(token):
    try:
        payload = jwt.decode(token, 'refresh_secret', algorithms=['HS256'])
        return payload['user_id']

    except:
        raise exceptions.AuthenticationFailed('unauthenticated')
