# views.py
from rest_framework.authentication import get_authorization_header
from .models import User
from .authentication import *
from rest_framework.response import Response
from rest_framework import  status
import codecs
import re
from .models import StoryImage
import base64
from django.core.files.base import ContentFile
import os
from PIL import Image
from io import BytesIO

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

def resize_image(image_data, max_size_mb=5):
    """
    Resizes an image if it exceeds the specified size in MB.
    """
    img = Image.open(BytesIO(image_data))
    while len(image_data) / (1024 * 1024) > max_size_mb:
        width, height = img.size
        img = img.resize((int(width*0.8), int(height*0.8)))
        buffer = BytesIO()
        img.save(buffer, format="JPEG")
        image_data = buffer.getvalue()
    return image_data


def convert_base64_to_url(content):
    backend_host_ip = os.environ.get('BACKEND_HOST_IP', 'localhost')
    pattern = r'<img src="data:image/(?P<format>\w+);base64,(?P<data>[^"]+)"'

    for match in re.finditer(pattern, content):
        format, imgstr = match.group('format'), match.group('data')
        ext = format.lower()
        image_data = base64.b64decode(imgstr)

        # Resize the image if it's larger than 5 MB
        if len(image_data) / (1024 * 1024) > 5:
            image_data = resize_image(image_data)

        data = ContentFile(image_data)

        # Create a new StoryImage and save the decoded image data
        img = StoryImage()
        img.save()  # Save the object first so it gets an ID

        filename = f"story_image_{img.id}.{ext}"
        img.image.save(filename, data, save=True)

        # Construct the absolute image URL
        absolute_image_url = f"http://{backend_host_ip}:8000/story_images/{filename}"

        # Replace the base64 data inside the <img> tag with the image's absolute URL
        content = content.replace(match.group(0), f'<img src="{absolute_image_url}"')

    return content
