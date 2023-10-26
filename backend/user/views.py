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
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import logging

logger = logging.getLogger('django')

class UserRegistrationView(views.APIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]
    @swagger_auto_schema(request_body=UserRegisterSerializer)
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            user.save()
            return Response({'success':True ,'msg':'Successfully registered!', 'email':user.email,
                                    'username':user.username}, status=status.HTTP_201_CREATED)
        else:
            return Response({'success':False ,'msg':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


custom_schema_login = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'username': openapi.Schema(type=openapi.TYPE_STRING, description='enter username'),
        'password': openapi.Schema(type=openapi.TYPE_STRING, description='enter password'),
    },
    required=['content','password'],
)
class UserLoginView(views.APIView):
    queryset = User.objects.all()
    @swagger_auto_schema(request_body=custom_schema_login)
    def post(self, request, *args, **kwargs):
        body = json.loads(request.body)

        # Get the username and password from the JSON data
        username = body.get('username')
        password = body.get('password')

        # Use the username and password to authenticate the user
        user = authenticate(request, username=username, password=password)

        if user is None:
            return Response({'success':False ,'msg': 'Invalid username or password'}, status=status.HTTP_400_BAD_REQUEST)

        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)
        response = Response(status=status.HTTP_201_CREATED)

        response.set_cookie(key='refreshToken', value=refresh_token, httponly=True)
        response.data = {
            'success':True ,
            'msg': 'Login success',
            'access': access_token,
            'refresh': refresh_token
        }

        return response

class AuthUserAPIView(views.APIView):
    def get(self, request):
        try:
            cookie_value = request.COOKIES['refreshToken']
            user_id = decode_refresh_token(cookie_value)
            return Response({'success':True ,'msg': 'User is authed', 'user_id': user_id}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'success':False ,'msg': 'Unauthenticated','user_id': None, 'is_authenticated': False}, status=status.HTTP_401_UNAUTHORIZED)
class RefreshUserAuthAPIView(views.APIView):
    def post(self,request):
        refresh_token = request.COOKIES.get('refreshToken')

        try:
            id = decode_refresh_token(refresh_token)
        except:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        access_token = create_access_token(id)
        return Response({
            'success':True ,
            'msg': 'Access token refreshed',
            'token': access_token
        },status=status.HTTP_201_CREATED)

class LogoutAPIView(views.APIView):
    def post(self, request):

        response = Response(status=status.HTTP_201_CREATED)
        response.delete_cookie('refreshToken')
        response.data = {
            'success':True ,
            'msg': 'Logout Success'
        }
        return response

class CreateStoryView(views.APIView):
    @swagger_auto_schema(request_body=StorySerializer)
    def post(self, request):
        try:
            cookie_value = request.COOKIES['refreshToken']
            try:
                user_id = decode_refresh_token(cookie_value)
            except:
                return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)

            request_data = json.loads(request.body)

            request_data['content'] = convert_base64_to_url(request_data['content'])

            request_data['author'] = user_id
            serializer = StorySerializer(data=request_data)

            if serializer.is_valid():
                serializer.save()
                serializer.data.update({'success':True ,'msg': 'Story Created'})
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({'success':False ,'msg': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except RequestDataTooBig:
            return Response({'success':False ,'msg': 'Uploaded data is too large.'}, status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE)

custom_schema_update_story = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'content': openapi.Schema(type=openapi.TYPE_STRING, description='enter new content'),
    },
    required=['content'],
)
class UpdateStoryView(views.APIView):
    @swagger_auto_schema(request_body=custom_schema_update_story)
    def put(self, request, pk):

        cookie_value = request.COOKIES['refreshToken']
        try:
            user_id = decode_refresh_token(cookie_value)
        except:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        story = get_object_or_404(Story, pk=pk)

        content = request.data.get("content")
        if content is not None:
            # Convert base64 encoded images in the content to URLs
            updated_content = convert_base64_to_url(content)

            story.content = updated_content
            story.save()
            return Response({'success':True ,'msg': 'Update story content successfull.'}, status=status.HTTP_201_CREATED)

        return Response({'success':False ,'msg': 'Update content failed.'}, status=status.HTTP_400_BAD_REQUEST)



class LikeStoryView(views.APIView):
    def post(self, request, pk):

        cookie_value = request.COOKIES['refreshToken']
        try:
            user_id = decode_refresh_token(cookie_value)
        except:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        story = Story.objects.get(pk=pk)
        # Check if the user has already liked the story
        if user_id in story.likes.all().values_list('id', flat=True):
            # If the user has already liked the story, remove the like
            story.likes.remove(user_id)
            story.save()
            return Response({'success':True ,'msg': 'Disliked.'}, status=status.HTTP_201_CREATED)
        else:
            # If the user has not liked the story, add a new like
            story.likes.add(user_id)
            story.save()
            return Response({'success':True ,'msg': 'Liked.'}, status=status.HTTP_201_CREATED)

class StoryDetailView(views.APIView): ##need to add auth here?
    def get(self, request, pk):
        cookie_value = request.COOKIES['refreshToken']
        try:
            user_id = decode_refresh_token(cookie_value)
        except:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            story = Story.objects.get(pk=pk)
        except Story.DoesNotExist:
            return Response({'success':False ,'msg': 'Story does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = StorySerializer(story)
        serializer.data.update({'success':True ,'msg': 'Story detail got.'})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        cookie_value = request.COOKIES.get('refreshToken')
        if not cookie_value:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            user_id = decode_refresh_token(cookie_value)
        except:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            story = Story.objects.get(pk=pk)
            story.delete()
            return Response({'success':True ,'msg': 'Story deleted successfully.'}, status=status.HTTP_200_OK)
        except Story.DoesNotExist:
            return Response({'success':False ,'msg': 'Story does not exist.'}, status=status.HTTP_404_NOT_FOUND)
class CreateCommentView(views.APIView):
    @swagger_auto_schema(request_body=CommentSerializer)
    def post(self, request, id):

        cookie_value = request.COOKIES['refreshToken']
        try:
            user_id = decode_refresh_token(cookie_value)
        except:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            story = Story.objects.get(pk=id)
        except Story.DoesNotExist:
            return Response({'success':False ,'msg': 'Story does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        data = {
            'comment_author': user_id,
            'story': id,
            'text': request.data.get('text')
        }
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            serializer.data.update({'success':True ,'msg': 'Comment added.'})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({'success':False ,'msg': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class StoryCommentsView(views.APIView):
    def get(self, request, id):
        try:
            story = Story.objects.get(pk=id)
        except Story.DoesNotExist:
            return Response({'success':False ,'msg': 'Story does not exist.'}, status=status.HTTP_404_NOT_FOUND)

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
            'success':True ,
            'msg': 'Story commnents got',
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
        try:
            user_id = decode_refresh_token(cookie_value)
        except:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            user_to_follow = User.objects.get(pk=id)
        except User.DoesNotExist:
            return Response({'success':False ,'msg': 'User does not exists.'}, status=status.HTTP_404_NOT_FOUND)
        if user_id == user_to_follow.id:
            return Response({'success':False ,'msg': 'You cannot follow yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        if user_to_follow.followers.filter(pk=user_id).exists():
            user_to_follow.followers.remove(user_id)
            return Response({'success':True ,'msg': 'Unfollowed'}, status=status.HTTP_201_CREATED)
        else:
            user_to_follow.followers.add(user_id)

            return Response({'success':True ,'msg': 'Followed'}, status=status.HTTP_201_CREATED)

class UserFollowersView(views.APIView):
    def get(self, request,user_id=None):

        if user_id:
            user = get_object_or_404(User, pk=user_id)
        else:
            cookie_value = request.COOKIES['refreshToken']
            try:
                user_id = decode_refresh_token(cookie_value)
            except:
                return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)
            user = get_object_or_404(User, pk=user_id)

        followers = user.followers.all()
        serializer = UserFollowerSerializer(followers, many=True)
        serializer.data.update({'success':True ,'msg': 'Get user followers.'})
        return Response(serializer.data , status=status.HTTP_200_OK)


class StoryAuthorView(views.APIView):
    def get(self, request, user_id=None):

        cookie_value = request.COOKIES['refreshToken']
        try:
            decode_refresh_token(cookie_value)
        except:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        if user_id:
            user = get_object_or_404(User, pk=user_id)
            stories = Story.objects.filter(author=user_id).order_by('-creation_date')
        else:
            cookie_value = request.COOKIES['refreshToken']
            user_id = decode_refresh_token(cookie_value)
            user = get_object_or_404(User, pk=user_id)
            user_ids = user.following.values_list('id', flat=True)
            stories = Story.objects.filter(author__in=user_ids).order_by('-creation_date')

        # Get the page number and size
        page_number = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('size', 3))

        # Paginate the stories

        paginator = Paginator(stories, page_size)
        total_pages = ceil(paginator.count / page_size)
        page = paginator.get_page(page_number)

        serializer = StorySerializer(page, many=True)


        return Response({
            'success':True ,
            'msg': 'Show story details by authors itself',
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
        try:
            user_id = decode_refresh_token(cookie_value)
        except:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)

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
            'success':True ,
            'msg': 'Get all stories',
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
            try:
                user_id = decode_refresh_token(cookie_value)
            except:
                return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)
            user = get_object_or_404(User, pk=user_id)

        serializer = UsersSerializer(user)
        serializer.data.update({'success':True ,'msg':'Get user details'})
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserBiographyView(views.APIView):

    def get(self, request):
        if user_id:
            user = get_object_or_404(User, pk=user_id)
        else:
            cookie_value = request.COOKIES['refreshToken']
            try:
                user_id = decode_refresh_token(cookie_value)
            except:
                return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)
            user = get_object_or_404(User, pk=user_id)

        serializer = UserBiographySerializer(user)
        serializer.data.update({'success':True ,'msg': 'Got user bio'})
        return Response(serializer.data, status=status.HTTP_200_OK)
    @swagger_auto_schema(request_body=UserBiographySerializer)
    def put(self, request):


        cookie_value = request.COOKIES['refreshToken']
        try:
            user_id = decode_refresh_token(cookie_value)
        except:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        user = get_object_or_404(User, pk=user_id)

        serializer = UserBiographySerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            serializer.data.update({'success':True ,'msg': 'Update user bio'})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'success':False ,'msg': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class UserPhotoView(views.APIView):

    def get(self, request, user_id=None):

        if user_id:
            user = get_object_or_404(User, pk=user_id)
        else:
            cookie_value = request.COOKIES['refreshToken']
            try:
                user_id = decode_refresh_token(cookie_value)
            except:
                return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)
            user = get_object_or_404(User, pk=user_id)

        if not user.profile_photo:
            return Response({'success':False ,'msg': 'Profile photo not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserPhotoSerializer(user)

        return Response({'success': True, 'msg': 'Photo got', 'photo_url': serializer.data['photo_url']}, status=status.HTTP_200_OK)

    @swagger_auto_schema(request_body=UserPhotoSerializer)
    def put(self, request):

        cookie_value = request.COOKIES['refreshToken']
        try:
            user_id = decode_refresh_token(cookie_value)
        except:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        user = get_object_or_404(User, pk=user_id)
        if not isinstance(request.FILES.get('profile_photo'), InMemoryUploadedFile):
            return Response({'success':False ,'msg': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserPhotoSerializer(user, data={'profile_photo': request.FILES['profile_photo']})
        if serializer.is_valid():
            serializer.save()
            serializer.data.update({'success':True ,'msg': 'Profile photo changed'})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'success':False ,'msg': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        cookie_value = request.COOKIES['refreshToken']
        try:
            user_id = decode_refresh_token(cookie_value)
        except:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        user = get_object_or_404(User, pk=user_id)

        if user.profile_photo:
            # Create a FileSystemStorage object
            storage = FileSystemStorage()
            # Delete the file from the storage
            storage.delete(user.profile_photo.name)
            # Update the user model to remove the profile photo
            user.profile_photo = None
            user.save()
            return Response({'success':True ,'msg': 'Profile photo deleted'}, status=status.HTTP_200_OK)
        else:
            return Response({'success':False ,'msg': 'Profile photo does not exist'}, status=status.HTTP_400_BAD_REQUEST)


class SearchUserView(views.APIView):
    def get(self, request, *args, **kwargs):

        cookie_value = request.COOKIES['refreshToken']
        try:
            user_id = decode_refresh_token(cookie_value)
        except:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        user = get_object_or_404(User, pk=user_id)

        search_query = request.query_params.get('search', '')

        # Search for users by username
        user_queryset = User.objects.filter(Q(username__icontains=search_query))
        users_serializer = UsersSerializer(user_queryset, many=True)

        return Response({
            'success':True ,
            'msg': 'Searching user success',
            "users": users_serializer.data,
        }, status=status.HTTP_200_OK)

class SearchStoryView(views.APIView):
    def get(self, request, *args, **kwargs ):
        cookie_value = request.COOKIES['refreshToken']
        try:
            user_id = decode_refresh_token(cookie_value)
        except:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        user = get_object_or_404(User, pk=user_id)

        title_search = request.query_params.get('title', '')
        author_search = request.query_params.get('author', '')
        time_type = request.query_params.get('time_type', '')
        time_value = request.query_params.get('time_value', '')
        location = request.query_params.get('location', '')
        radius_diff = float(request.query_params.get('radius_diff', ''))
        date_diff = float(request.query_params.get('date_diff', ''))
        tag_search = request.query_params.get('tag', '')

        #print(tag_search)
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
                #print(start_date)
                #print(end_date)
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
            'success':True ,
            'msg': 'Search success',
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
        #print("caner")
        #print(uidb64)
        #print(token)

        user_id = smart_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=int(user_id))

        if default_token_generator.check_token(user, token):
            new_password = request.data.get("new_password")
            user.set_password(new_password)
            user.save()
            return Response({"detail": "Password has been reset."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
