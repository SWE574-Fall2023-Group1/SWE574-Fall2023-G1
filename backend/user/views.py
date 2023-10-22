# views.py
from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.core.exceptions import RequestDataTooBig
from django.http import HttpResponse
from django.contrib.auth.tokens import default_token_generator
from django.core.paginator import Paginator
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.files.storage import FileSystemStorage
from django.core.mail import send_mail
from django.db.models import Q
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, smart_str
from django.utils import timezone
from django.shortcuts import get_object_or_404
import json
import os
from math import ceil,cos, radians
from datetime import datetime, timedelta
from .serializers import *
from .models import User,Story,Comment
from .authentication import *
from .models import PasswordResetToken
from django.contrib.auth import authenticate
from .functions import *

class UserRegistrationView(views.APIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            user.save()
            return Response({'message':'Successfully registered!', 'email':user.email,
                                    'username':user.username}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(views.APIView):
    queryset = User.objects.all()

    def post(self, request, *args, **kwargs):
        body = json.loads(request.body)

        # Get the username and password from the JSON data
        username = body.get('username')
        password = body.get('password')

        # Use the username and password to authenticate the user
        user = authenticate(request, username=username, password=password)

        if user is None:
            return Response({'error': 'Invalid username or password'}, status=400)

        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)
        response = Response()

        response.set_cookie(key='refreshToken', value=refresh_token, httponly=True)
        response.data = {
            'access': access_token,
            'refresh': refresh_token
        }

        return response

class AuthUserAPIView(views.APIView):
    def get(self, request):
        try:
            cookie_value = request.COOKIES['refreshToken']
            user_id = decode_refresh_token(cookie_value)
            return Response(user_id, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'user_id': None, 'is_authenticated': False}, status=status.HTTP_401_UNAUTHORIZED)

class RefreshUserAuthAPIView(views.APIView):
    def post(self,request):
        refresh_token = request.COOKIES.get('refreshToken')

        id = decode_refresh_token(refresh_token)
        print(id)
        access_token = create_access_token(id)
        return Response({
            'token': access_token
        })

class LogoutAPIView(views.APIView):
    def post(self, request):

        response = Response()
        response.delete_cookie('refreshToken')
        response.data = {
            'message': 'success'
        }
        return response

class CreateStoryView(views.APIView):
    def post(self, request):
        try:
            print(request.COOKIES)
            cookie_value = request.COOKIES['refreshToken']
            user_id = decode_refresh_token(cookie_value)

            print(request.body)
            request_data = json.loads(request.body)
            print(request_data)

            request_data['content'] = convert_base64_to_url(request_data['content'])

            request_data['author'] = user_id
            serializer = StorySerializer(data=request_data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except RequestDataTooBig:
            return Response({"detail": "Uploaded data is too large."}, status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE)


class UpdateStoryView(views.APIView):
    def put(self, request, pk):

        cookie_value = request.COOKIES['refreshToken']
        user_id = decode_refresh_token(cookie_value)

        story = get_object_or_404(Story, pk=pk)

        content = request.data.get("content")
        if content is not None:
            # Convert base64 encoded images in the content to URLs
            updated_content = convert_base64_to_url(content)

            story.content = updated_content
            story.save()
            return Response("ok")

        return Response({"error": "Content not provided"}, status=status.HTTP_400_BAD_REQUEST)



class LikeStoryView(views.APIView):
    def post(self, request, pk):

        cookie_value = request.COOKIES['refreshToken']
        user_id = decode_refresh_token(cookie_value)

        story = Story.objects.get(pk=pk)
        # Check if the user has already liked the story
        if user_id in story.likes.all().values_list('id', flat=True):
            # If the user has already liked the story, remove the like
            story.likes.remove(user_id)
            story.save()
            return Response({'message': 'Like removed successfully.'}, status=status.HTTP_200_OK)
        else:
            # If the user has not liked the story, add a new like
            story.likes.add(user_id)
            story.save()
            return Response({'message': 'Like added successfully.'}, status=status.HTTP_200_OK)

class StoryDetailView(views.APIView): ##need to add auth here?
    def get(self, request, pk):
        cookie_value = request.COOKIES['refreshToken']
        user_id = decode_refresh_token(cookie_value)

        try:
            story = Story.objects.get(pk=pk)
        except Story.DoesNotExist:
            return Response({'message': 'Story not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = StorySerializer(story)

        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CreateCommentView(views.APIView):
    def post(self, request, id):

        cookie_value = request.COOKIES['refreshToken']
        user_id = decode_refresh_token(cookie_value)

        try:
            story = Story.objects.get(pk=id)
        except Story.DoesNotExist:
            return Response({'error': 'Story does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        data = {
            'comment_author': user_id,
            'story': id,
            'text': request.data.get('text')
        }
        print(data)
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StoryCommentsView(views.APIView):
    def get(self, request, id):
        try:
            story = Story.objects.get(pk=id)
        except Story.DoesNotExist:
            return Response({'error': 'Story does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        # Get the page number and size
        page_number = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('size', 3))

        # Paginate the comments
        comments = Comment.objects.filter(story=story).order_by('date')
        paginator = Paginator(comments, page_size)
        total_pages = ceil(paginator.count / page_size)
        page = paginator.get_page(page_number)

        serializer = CommentGetSerializer(page, many=True)


        return Response({
            'comments': serializer.data,
            'has_next': page.has_next(),
            'has_prev': page.has_previous(),
            'next_page': page.next_page_number() if page.has_next() else None,
            'prev_page': page.previous_page_number() if page.has_previous() else None,
            'total_pages': total_pages,
        }, status=status.HTTP_200_OK)

class FollowUserView(views.APIView):
    def post(self, request, id):

        cookie_value = request.COOKIES['refreshToken']
        user_id = decode_refresh_token(cookie_value)
        print(user_id)
        try:
            user_to_follow = User.objects.get(pk=id)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        if user_id == user_to_follow.id:
            return Response({'error': 'You cannot follow yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        if user_to_follow.followers.filter(pk=user_id).exists():
            user_to_follow.followers.remove(user_id)
            #serializer = UsersSerializer(user_to_follow)
            return Response("unfollowed", status=status.HTTP_200_OK)
        else:
            user_to_follow.followers.add(user_id)
            #serializer = UsersSerializer(user_to_follow)

            return Response("followed", status=status.HTTP_200_OK)

class UserFollowersView(views.APIView):
    def get(self, request,user_id=None):


        if user_id:
            user = get_object_or_404(User, pk=user_id)
        else:
            cookie_value = request.COOKIES['refreshToken']
            user_id = decode_refresh_token(cookie_value)
            user = get_object_or_404(User, pk=user_id)

        followers = user.followers.all()
        serializer = UserFollowerSerializer(followers, many=True)

        print("caner")
        print(serializer.data)

        return Response(serializer.data, status=status.HTTP_200_OK)


class StoryAuthorView(views.APIView):
    def get(self, request, user_id=None):

        print(request.COOKIES)
        print(user_id)
        cookie_value = request.COOKIES['refreshToken']
        user_id_new = decode_refresh_token(cookie_value)

        if user_id:
            user = get_object_or_404(User, pk=user_id)
            stories = Story.objects.filter(author=user_id).order_by('-creation_date')
        else:
            cookie_value = request.COOKIES['refreshToken']
            user_id = decode_refresh_token(cookie_value)
            user = get_object_or_404(User, pk=user_id)
            user_ids = user.following.values_list('id', flat=True)
            stories = Story.objects.filter(author__in=user_ids).order_by('-creation_date')

        print(stories)

        # Get the page number and size
        page_number = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('size', 3))

        # Paginate the stories

        paginator = Paginator(stories, page_size)
        total_pages = ceil(paginator.count / page_size)
        page = paginator.get_page(page_number)

        serializer = StorySerializer(page, many=True)


        return Response({
            'stories': serializer.data,
            'has_next': page.has_next(),
            'has_prev': page.has_previous(),
            'next_page': page.next_page_number() if page.has_next() else None,
            'prev_page': page.previous_page_number() if page.has_previous() else None,
            'total_pages': total_pages,
        }, status=status.HTTP_200_OK)

class AllStoryView(views.APIView):
    def get(self, request):


        cookie_value = request.COOKIES['refreshToken']
        user_id = decode_refresh_token(cookie_value)

        stories = Story.objects.exclude(Q(author__id=user_id)).order_by('-creation_date')

        # Get the page number and size
        page_number = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('size', 3))

        # Paginate the stories

        paginator = Paginator(stories, page_size)
        total_pages = ceil(paginator.count / page_size)
        page = paginator.get_page(page_number)

        serializer = StorySerializer(page, many=True)


        return Response({
            'stories': serializer.data,
            'has_next': page.has_next(),
            'has_prev': page.has_previous(),
            'next_page': page.next_page_number() if page.has_next() else None,
            'prev_page': page.previous_page_number() if page.has_previous() else None,
            'total_pages': total_pages,
        }, status=status.HTTP_200_OK)


class UserDetailsView(views.APIView):

    def get(self, request, user_id=None):

        if user_id:
            user = get_object_or_404(User, pk=user_id)
        else:
            cookie_value = request.COOKIES['refreshToken']
            user_id = decode_refresh_token(cookie_value)
            user = get_object_or_404(User, pk=user_id)

        serializer = UsersSerializer(user)
        return Response(serializer.data)

class UserBiographyView(views.APIView):

    def get(self, request):
        if user_id:
            user = get_object_or_404(User, pk=user_id)
        else:
            cookie_value = request.COOKIES['refreshToken']
            user_id = decode_refresh_token(cookie_value)
            user = get_object_or_404(User, pk=user_id)

        serializer = UserBiographySerializer(user)
        return Response(serializer.data)

    def put(self, request):


        cookie_value = request.COOKIES['refreshToken']
        user_id = decode_refresh_token(cookie_value)
        user = get_object_or_404(User, pk=user_id)

        serializer = UserBiographySerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserPhotoView(views.APIView):

    def get(self, request, user_id=None):

        if user_id:
            user = get_object_or_404(User, pk=user_id)
        else:
            cookie_value = request.COOKIES['refreshToken']
            user_id = decode_refresh_token(cookie_value)
            user = get_object_or_404(User, pk=user_id)

        if not user.profile_photo:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = UserPhotoSerializer(user)
        file_ext = os.path.splitext(user.profile_photo.name)[-1].lower()
        print(user.profile_photo)


        content_type = 'image/jpeg' if file_ext == '.jpg' or file_ext == '.jpeg' else 'image/png'
        # Serve the image file with the proper content type and inline attachment
        response = HttpResponse(user.profile_photo, content_type=content_type)
        response['Content-Disposition'] = f'inline; filename="{user.profile_photo.name}"'

        return response

    def put(self, request):

        cookie_value = request.COOKIES['refreshToken']
        user_id = decode_refresh_token(cookie_value)
        user = get_object_or_404(User, pk=user_id)
        if not isinstance(request.FILES.get('profile_photo'), InMemoryUploadedFile):
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserPhotoSerializer(user, data={'profile_photo': request.FILES['profile_photo']})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        cookie_value = request.COOKIES['refreshToken']
        user_id = decode_refresh_token(cookie_value)
        user = get_object_or_404(User, pk=user_id)

        if user.profile_photo:
            # Create a FileSystemStorage object
            storage = FileSystemStorage()
            # Delete the file from the storage
            storage.delete(user.profile_photo.name)
            # Update the user model to remove the profile photo
            user.profile_photo = None
            user.save()
            return Response({'success': 'Profile photo deleted'})
        else:
            return Response({'error': 'Profile photo does not exist'})


class SearchUserView(views.APIView):



    def get(self, request, *args, **kwargs):

        cookie_value = request.COOKIES['refreshToken']
        user_id = decode_refresh_token(cookie_value)
        user = get_object_or_404(User, pk=user_id)

        search_query = request.query_params.get('search', '')

        # Search for users by username
        user_queryset = User.objects.filter(Q(username__icontains=search_query))
        users_serializer = UsersSerializer(user_queryset, many=True)

        return Response({
            "users": users_serializer.data,
        }, status=status.HTTP_200_OK)

class SearchStoryView(views.APIView):
    def get(self, request, *args, **kwargs ):
        cookie_value = request.COOKIES['refreshToken']
        user_id = decode_refresh_token(cookie_value)
        user = get_object_or_404(User, pk=user_id)

        title_search = request.query_params.get('title', '')
        author_search = request.query_params.get('author', '')
        time_type = request.query_params.get('time_type', '')
        time_value = request.query_params.get('time_value', '')
        location = request.query_params.get('location', '')
        radius_diff = float(request.query_params.get('radius_diff', ''))
        date_diff = float(request.query_params.get('date_diff', ''))
        tag_search = request.query_params.get('tag', '')

        print(tag_search)
        query_filter = Q()
        if title_search:
            query_filter &= Q(title__icontains=title_search)
        if tag_search:
            query_filter &= Q(story_tags__icontains=tag_search)
        if author_search:
            query_filter &= Q(author__username__icontains=author_search)
        if time_type and time_value:

            time_value = json.loads(time_value)
            if time_type == 'season':
                time_value = time_value["seasonName"]
                query_filter &= Q(season_name__icontains=time_value)
            elif time_type == 'year':
                year_value = time_value["year"]
                season_value = time_value["seasonName"]
                query_filter &= Q(season_name__icontains=season_value, year__exact=year_value) | Q(date__year__exact=year_value) | Q(start_date__year__exact=year_value) | Q(end_date__year__exact=year_value)
            elif time_type == 'year_interval':
                start_year = time_value["startYear"]
                end_year = time_value["endYear"]
                season_value = time_value["seasonName"]
                query_filter &= Q(season_name__icontains=season_value, start_year__gte=start_year, end_year__lte=end_year) | Q(year__range=(start_year, end_year)) | Q(date__year__range=(start_year, end_year)) ##here can be change for now it shows greater than of that year
            elif time_type == 'normal_date':

                given_date = datetime.strptime(time_value["date"], "%Y-%m-%d")

                # Calculate the date range
                start_date = given_date - timedelta(days=date_diff+1)
                end_date = given_date + timedelta(days=date_diff+1)
                print(start_date)
                print(end_date)
                query_filter &= Q(date__range=(start_date, end_date)) ##I can change the date to get 2 dates for interval on normal_date too
            elif time_type == 'interval_date':
                query_filter &= Q(
                    start_date__gte=time_value['startDate'],
                    end_date__lte=time_value['endDate']
                )
            elif time_type == 'decade':
                decade_value = time_value["decade"]
                start_year = decade_value
                end_year = decade_value + 9
                query_filter &= Q(decade__exact=decade_value) | Q(year__range=(start_year, end_year)) | Q(date__year__range=(start_year, end_year)) | Q(start_date__year__range=(start_year, end_year)) | Q(end_date__year__range=(start_year, end_year))


        if location != "null":
            location = json.loads(location)
            lat = location['latitude']
            lng = location['longitude']
            radius = radius_diff  # radius set for near search

            query_filter &= Q(
                location_ids__latitude__range=(lat - radius / 110.574, lat + radius / 110.574),
                location_ids__longitude__range=(lng - radius / (111.320 * cos(radians(lat))), lng + radius / (111.320 * cos(radians(lat))))
            )


        stories = Story.objects.filter(query_filter).order_by('-creation_date')

        # Page sizes and numbers
        page_number = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('size', 10))


        paginator = Paginator(stories, page_size)
        total_pages = ceil(paginator.count / page_size)
        page = paginator.get_page(page_number)

        serializer = StorySerializer(page, many=True)

        return Response({
            'stories': serializer.data,
            'has_next': page.has_next(),
            'has_prev': page.has_previous(),
            'next_page': page.next_page_number() if page.has_next() else None,
            'prev_page': page.previous_page_number() if page.has_previous() else None,
            'total_pages': total_pages,
        }, status=status.HTTP_200_OK)


class SendPasswordResetEmail(views.APIView):
    def post(self, request):
        email = request.data.get("email")
        user = User.objects.filter(email=email).first()
        if user:
            token, created = PasswordResetToken.objects.get_or_create(user=user)
            token.created_at = timezone.now()
            token.save()

            user_id = str(user.pk)
            encoded_user_id = urlsafe_base64_encode(force_bytes(user_id))
            # Send password reset email
            subject = "Password Reset Request"
            token_str = default_token_generator.make_token(user)
            email_body = (
                f"To reset your password, click the link below:\n\n"
                f"http://localhost:3000/resetPassword/{token_str}/{encoded_user_id}\n"
            )
            send_mail(subject, email_body, "noreply@yourapp.com", [email])

        return Response({"detail": "Password reset email sent."}, status=status.HTTP_200_OK)

class ResetPassword(views.APIView):
    def post(self, request, token, uidb64):
        print("caner")
        print(uidb64)
        print(token)

        user_id = smart_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=int(user_id))

        if default_token_generator.check_token(user, token):
            new_password = request.data.get("new_password")
            user.set_password(new_password)
            user.save()
            return Response({"detail": "Password has been reset."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
