# views.py
from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
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
from django.utils import timezone
from math import ceil,cos, radians
from datetime import datetime, timedelta
from .serializers import *
from .models import User,Story,Comment,StoryRecommendation,PasswordResetToken
from .authentication import *
from django.contrib.auth import authenticate
from .functions import *
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import logging
from django.contrib.gis.geos import GEOSGeometry, LineString, Polygon
from django.contrib.gis.measure import D  # 'D' is a shortcut for creating Distance objects
from django.db.models import F
import requests
from .recomFunctions import *

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
            return Response(
                {
                    'success': True,
                    'msg': 'Successfully registered!',
                    'email': user.email,
                    'username': user.username,
                },
                status=status.HTTP_201_CREATED,
            )
        else:
            registration_error = (
                serializer.errors.get("username") or
                serializer.errors.get("email") or
                serializer.errors.get("password") or
                ["Registration failed."]
            )
            return Response(
                {
                    'success': False,
                    'msg': registration_error[0]
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


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
            # Authentication and user retrieval
            cookie_value = request.COOKIES['refreshToken']
            user_id = decode_refresh_token(cookie_value)

            logger.warning(f"Request Data: {request.body}")  # Log the raw request data

            # Request data processing
            request_data = json.loads(request.body)
            logger.warning(f"Parsed Data: {request_data}")  # Log the raw request data
            request_data['content'] = convert_base64_to_url(request_data['content'])
            request_data['author'] = user_id

            # Tags processing
            tags_data = request_data.pop('story_tags', [])
            logger.warning(f"Tags Data: {tags_data}")  # Log the raw request data

            tags = []
            for tag_data in tags_data:
                tag = Tag.objects.create(
                    wikidata_id=tag_data['wikidata_id'],
                    label=tag_data['label'],
                    name=tag_data['name'],
                    description=tag_data['description']
                )
                tags.append(tag)

            # Serializer processing
            serializer = StorySerializer(data=request_data)
            if serializer.is_valid():
                story = serializer.save()
                story.story_tags.set(tags)  # Associate tags with the story

                # Activity creation for each follower
                for follower in story.author.followers.all():
                    Activity.objects.create(
                        user=follower,
                        activity_type='new_story',
                        target_story=story,
                        target_user=story.author
                    )
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                error_messages = "\n".join(["{}: {}".format(field, "; ".join(errors)) for field, errors in serializer.errors.items()])
                return Response({
                    'success': False,
                    'msg': error_messages,  # Concatenated error messages
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'success': False, 'msg': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



custom_schema_update_story = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'content': openapi.Schema(type=openapi.TYPE_STRING, description='enter new content'),
    },
    required=['content'],
)
class UpdateStoryView(views.APIView):
    def put(self, request, pk):
        try:
            # Authentication and user retrieval
            cookie_value = request.COOKIES.get('refreshToken')
            if not cookie_value:
                return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)

            user_id = decode_refresh_token(cookie_value)
            story = get_object_or_404(Story, pk=pk, author=user_id)

            logger.warning(f"Request Data: {request.body}")  # Log the raw request data

            # Request data processing
            request_data = json.loads(request.body)
            logger.warning(f"Parsed Data: {request_data}")  # Log the parsed request data
            request_data['content'] = convert_base64_to_url(request_data['content'])
            request_data['author'] = user_id

            # Tags processing
            tags_data = request_data.pop('story_tags', [])
            logger.warning(f"Tags Data: {tags_data}")  # Log the tags data

            tags = []
            try:
                story = get_object_or_404(Story, pk=pk, author=user_id)
                serializer = StoryUpdateSerializer(story, data=request_data)
                if serializer.is_valid():
                    updated_story = serializer.save()

                    updated_story.story_tags.clear()
                    # Handling tags
                    for tag_data in tags_data:
                        tag = Tag.objects.create(
                            wikidata_id=tag_data['wikidata_id'],
                            label=tag_data['label'],
                            name=tag_data['name'],
                            description=tag_data['description']
                        )
                        updated_story.story_tags.add(tag)

                    updated_story.save()
                    return Response({'success': True, 'msg': 'Story updated successfully.', 'data': serializer.data}, status=status.HTTP_200_OK)
                else:
                    error_messages = "\n".join(["{}: {}".format(field, "; ".join(errors)) for field, errors in serializer.errors.items()])
                    return Response({
                        'success': False,
                        'msg': error_messages,  # Concatenated error messages
                        'errors': serializer.errors
                    }, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'success': False, 'msg': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'success': False, 'msg': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LikeStoryView(views.APIView):
    def post(self, request, pk):
        cookie_value = request.COOKIES['refreshToken']
        try:
            liker_id = decode_refresh_token(cookie_value)
        except:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        liker = get_object_or_404(User, pk=liker_id)
        story = get_object_or_404(Story, pk=pk)
        author = story.author

        # Check if the liker has already liked the story
        if liker in story.likes.all():
            # If the liker has already liked the story, remove the like
            story.likes.remove(liker)
            story.save()

            # Log the activity of unliking the story for the author
            Activity.objects.create(user=author, activity_type='story_unliked', target_story=story, target_user=liker)

            return Response({'success': True, 'msg': 'Disliked.'}, status=status.HTTP_201_CREATED)
        else:
            # If the liker has not liked the story, add a new like
            story.likes.add(liker)
            story.save()

            # Log the activity of liking the story for the author
            Activity.objects.create(user=author, activity_type='story_liked', target_story=story, target_user=liker)
            logger.warning(f"Liker: {liker}")

            # update_recommendations(liker) Commented out for now because it may too long
            return Response({'success': True, 'msg': 'Liked.'}, status=status.HTTP_201_CREATED)


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
    def post(self, request, story_id):
        cookie_value = request.COOKIES.get('refreshToken')
        try:
            user_id = decode_refresh_token(cookie_value)
        except:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        story = get_object_or_404(Story, pk=story_id)
        commenter = get_object_or_404(User, pk=user_id)


        data = {
            'comment_author': commenter.username,  # Use only the username here
            'story': story_id,
            'text': request.data.get('text')
        }
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()

            # Create an activity for the story's author if the commenter is not the author
            if story.author != commenter:
                Activity.objects.create(
                    user=story.author,
                    activity_type='new_commented_on_story',
                    target_story=story,
                    target_user=commenter
                )

            # Create activities for other commenters on the story
            previous_commenters = Comment.objects.filter(story=story).exclude(comment_author=commenter).values_list('comment_author_id', flat=True).distinct()
            for previous_commenter_id in previous_commenters:
                previous_commenter = User.objects.get(pk=previous_commenter_id)
                if previous_commenter != story.author:
                    Activity.objects.create(
                        user=previous_commenter,
                        activity_type='new_comment_on_comment',
                        target_story=story,
                        target_user=commenter
                    )
            logger.warning(f"Serializer: {serializer.data}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({'success': False, 'msg': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

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
            follower = get_object_or_404(User, pk=user_id)

        except User.DoesNotExist:
            return Response({'success':False ,'msg': 'User does not exists.'}, status=status.HTTP_404_NOT_FOUND)
        if user_id == user_to_follow.id:
            return Response({'success':False ,'msg': 'You cannot follow yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        if user_to_follow.followers.filter(pk=user_id).exists():
            user_to_follow.followers.remove(user_id)
            Activity.objects.create(user=user_to_follow, activity_type='unfollowed_user', target_user=follower)

            return Response({'success':True ,'msg': 'Unfollowed'}, status=status.HTTP_201_CREATED)
        else:
            user_to_follow.followers.add(user_id)
            Activity.objects.create(user=user_to_follow, activity_type='followed_user', target_user=follower)

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

        return Response({'success':  serializer.data['success'], 'msg':  serializer.data['msg'], 'photo_url': serializer.data['photo_url']}, status=status.HTTP_200_OK)

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
            "users": users_serializer.data,
        }, status=status.HTTP_200_OK)

class SearchStoryView(views.APIView):
    def extract_timestamp(self, story):
    # Default to creation date in case there's an issue
        default_timestamp = story.creation_date

        if story.date_type == Story.YEAR_INTERVAL or story.date_type == Story.YEAR:
            year = story.start_year if story.date_type == Story.YEAR_INTERVAL else story.year
            if story.season_name == "Summer":
                return timezone.make_aware(datetime(year, 6, 1))
            elif story.season_name == "Fall":
                return timezone.make_aware(datetime(year, 9, 1))
            elif story.season_name == "Winter":
                return timezone.make_aware(datetime(year, 12, 1))
            elif story.season_name == "Spring":
                return timezone.make_aware(datetime(year, 3, 1))
            else:
                return timezone.make_aware(datetime(year, 1, 1))

        elif story.date_type == Story.NORMAL_DATE:
            logger.info(story.date)
            return story.date

        elif story.date_type == Story.INTERVAL_DATE:
            return story.start_date

        elif story.date_type == Story.DECADE:
            return timezone.make_aware(datetime(story.decade, 1, 1))

        else:
            return default_timestamp

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
        date_diff = float(request.query_params.get('date_diff', 2))
        wikidata_id = request.query_params.get('tag', '')

        sort_field = request.query_params.get('sort_field', 'extract_timestamp')  # Default to 'extract_timestamp'
        sort_type = request.query_params.get('sort_type', 'desc')  # Default to 'desc'


        logger.info(f"locationsearch: {location}")
        #print(tag_search)
        query_filter = Q()
        if title_search:
            query_filter &= Q(title__icontains=title_search)
        if wikidata_id:
            query_filter &= Q(story_tags__wikidata_id=wikidata_id)
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

        stories = Story.objects.filter(query_filter)

        if location != "null" and location != "":
            location = json.loads(location)
            location_point = GEOSGeometry(json.dumps(location), srid=4326)
                # Transform the point to a projected coordinate system where units are meters (e.g., UTM)
            utm_srid = 32633  # Example: UTM zone 33N SRID
            location_point.transform(utm_srid)
            logger.info(f"location_point: {location_point}")

            radius = radius_diff * 1000  # Assuming radius_diff is in kilometers, convert to meters

            # Create a search area (buffer) around the point using the correct units
            search_area = location_point.buffer(radius)

            # Transform the search area back to WGS 84 if necessary
            search_area.transform(4326)

            logger.info(f"search_area: {search_area}")

            # Start with a base queryset for all locations
            location_query = Q()

            # Handle points
            location_query |= Q(location_ids__point__intersects=search_area)

            # Handle lines
            location_query |= Q(location_ids__line__intersects=search_area)

            # Handle polygons
            location_query |= Q(location_ids__polygon__intersects=search_area)

            # Apply the combined location query to the stories queryset


                # Handle circles
            for location in Location.objects.filter(circle__isnull=False):
                circle_center = GEOSGeometry(location.circle, srid=4326)
                circle_center.transform(utm_srid)
                circle_area = circle_center.buffer(location.radius)
                circle_area.transform(4326)
                logger.info(f"circle_area: {circle_area}")
                logger.info(f"search_area: {search_area}")
                if circle_area.intersects(search_area):
                    logger.info("circle_area intersects with (search_area)")
                    location_query |= Q(location_ids__id=location.id)

            stories = stories.filter(location_query)

        if sort_field == 'extract_timestamp':
            # Already handled by existing code
            sorted_stories = sorted(stories, key=self.extract_timestamp, reverse=(sort_type == 'desc'))
        elif sort_field == 'creation_date':
            # Sorting by creation_date
            if sort_type == 'desc':
                stories = stories.order_by('-creation_date')
            else:
                stories = stories.order_by('creation_date')
            sorted_stories = stories
        else:
            # Default sorting if sort_field is not recognized
            sorted_stories = sorted(stories, key=self.extract_timestamp, reverse=True)

        serializer = StorySerializer(sorted_stories, many=True)

        return Response({
            'stories': serializer.data
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


class SearchStoryByLocationView(views.APIView):
    def extract_timestamp(self, story):
    # Default to creation date in case there's an issue
        default_timestamp = story.creation_date

        if story.date_type == Story.YEAR_INTERVAL or story.date_type == Story.YEAR:
            year = story.start_year if story.date_type == Story.YEAR_INTERVAL else story.year
            if story.season_name == "Summer":
                return timezone.make_aware(datetime(year, 6, 1))
            elif story.season_name == "Fall":
                return timezone.make_aware(datetime(year, 9, 1))
            elif story.season_name == "Winter":
                return timezone.make_aware(datetime(year, 12, 1))
            elif story.season_name == "Spring":
                return timezone.make_aware(datetime(year, 3, 1))
            else:
                return timezone.make_aware(datetime(year, 1, 1))

        elif story.date_type == Story.NORMAL_DATE:
            logger.info(story.date)
            return story.date

        elif story.date_type == Story.INTERVAL_DATE:
            return story.start_date

        elif story.date_type == Story.DECADE:
            return timezone.make_aware(datetime(story.decade, 1, 1))

        else:
            return default_timestamp


    def get(self, request, *args, **kwargs ):
        cookie_value = request.COOKIES['refreshToken']
        try:
            user_id = decode_refresh_token(cookie_value)
        except:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        user = get_object_or_404(User, pk=user_id)

        #logger.info(f"Query Params {request.query_params.get()}")
        location_json = request.query_params.get('location', '')
        radius_diff = float(request.query_params.get('radius_diff', '5'))
        utm_srid = 32633

        if location_json != "null":
            location_data = json.loads(location_json)
            geom_type = location_data.get("type")

            # Constructing the appropriate geometry based on the type
            if geom_type == "Point":
                center = Point(location_data["longitude"], location_data["latitude"], srid=4326)

                # Transform the point to a UTM coordinate system
                # Adjust this based on your location
                center.transform(utm_srid)

                # Create the buffer in the UTM system (assuming radius_diff is in kilometers)
                buffer_area = center.buffer(radius_diff*1000)

                # Transform the buffer back to WGS 84
                buffer_area.transform(4326)

                logger.info(f"Point Buffer: {buffer_area}")

            elif geom_type == "LineString":
                # Filter out any null coordinates and ensure they are in the correct format
                line_coords = []
                for coord in location_data["coordinates"]:
                    if coord["lat"] is not None and coord["lng"] is not None:
                        line_coords.append((float(coord["lng"]), float(coord["lat"])))

                if not line_coords:
                    return Response({'success': False, 'msg': 'Invalid line coordinates'}, status=status.HTTP_400_BAD_REQUEST)

                try:
                    geom = LineString(line_coords, srid=4326)

                    # Transform to UTM, create buffer, and transform back
                    # Adjust based on your location
                    geom.transform(utm_srid)
                    buffer_area = geom.buffer(radius_diff*1000)
                    buffer_area.transform(4326)

                    logger.info(f"Line Buffer: {buffer_area}")
                except Exception as e:
                    logger.error(f"Error creating LineString: {e}")
                    return Response({'success': False, 'msg': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



            elif geom_type == "Polygon":
                # Filter out any null coordinates and ensure the polygon is closed
                poly_coords = [(coord["lng"], coord["lat"]) for coord in location_data["coordinates"] if coord["lat"] is not None and coord["lng"] is not None]

                if poly_coords and poly_coords[0] != poly_coords[-1]:
                    poly_coords.append(poly_coords[0])  # Close the polygon

                try:
                    geom = Polygon(poly_coords, srid=4326)
                    buffer_area = geom  # No buffer needed for a polygon
                    logger.info(f"Polygon Buffer: {buffer_area}")
                except Exception as e:
                    logger.error(f"Error creating polygon: {e}")
                    return Response({'success': False, 'msg': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


            elif geom_type == "Circle":
                center = Point(location_data["center"]["lng"], location_data["center"]["lat"], srid=4326)
                radius = location_data["radius"]

                # Transform the center point to UTM coordinate system
                utm_srid = 32633  # Adjust this based on your location
                center.transform(utm_srid)

                # Create the buffer in UTM system
                buffer_area = center.buffer(radius)  # Radius is assumed to be in meters

                # Transform the buffer back to WGS 84
                buffer_area.transform(4326)

                logger.info(f"Circle Buffer: {buffer_area}")

            else:
                return Response({'success': False, 'msg': 'Invalid geometry type'}, status=status.HTTP_400_BAD_REQUEST)

            # Query filter using intersects lookup
            query_filter = Q(location_ids__point__intersects=buffer_area) | \
                           Q(location_ids__line__intersects=buffer_area) | \
                           Q(location_ids__polygon__intersects=buffer_area)

            for location in Location.objects.filter(circle__isnull=False):
                circle_center = GEOSGeometry(location.circle, srid=4326)
                circle_center.transform(utm_srid)  # Transform to UTM coordinate system
                circle_area = circle_center.buffer(location.radius)
                circle_area.transform(4326)  # Transform back to WGS 84

                if circle_area.intersects(buffer_area):
                    query_filter |= Q(location_ids=location.id)  # Add to query filter if intersects

        stories = Story.objects.filter(query_filter).distinct()

        serializer = StorySerializer(stories, many=True)

        # Page sizes and numbers

        return Response({
            'success' : True,
            'msg' : 'Stories successfully got',
            'stories': serializer.data
        }, status=status.HTTP_200_OK)


class ActivityStreamView(views.APIView):
    def get(self, request):

        cookie_value = request.COOKIES['refreshToken']
        try:
            user_id = decode_refresh_token(cookie_value)
        except:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        user = get_object_or_404(User, pk=user_id)

        activities = Activity.objects.filter(user_id=user_id).order_by('-date')
        serializer = ActivitySerializer(activities, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, activity_id):
        try:
            user_id = decode_refresh_token(request.COOKIES['refreshToken'])
        except:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        # Fetch the activity and ensure it belongs to the requesting user
        activity = get_object_or_404(Activity, pk=activity_id, user_id=user_id)

        # Update the 'viewed' field of the activity
        activity.viewed = True
        activity.save()

        return Response({'success': True, 'msg': 'Activity marked as viewed'}, status=status.HTTP_200_OK)


class WikidataSearchView(views.APIView):
    def get(self, request, *args, **kwargs):
        search_term = request.GET.get('query', '')
        if not search_term:
            return Response({'tags': []}, status=status.HTTP_200_OK)

        logger.warning(f"search term: {search_term}")  # Log the raw request data

        url = f'https://www.wikidata.org/w/api.php?action=wbsearchentities&search={search_term}&language=en&format=json'
        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            tags = [{'id': item['id'], 'label': item['label'], 'description': item.get('description', '')} for item in data.get('search', [])]
            logger.warning(f"Tags Searched: {tags}")  # Log the raw request data
            return Response({'tags': tags}, status=status.HTTP_200_OK)
        except requests.RequestException as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetRecommendationsView(views.APIView):
    def get(self, request, format=None):
        try:
            user_id = decode_refresh_token(request.COOKIES['refreshToken'])
            user = User.objects.get(id=user_id)
        except:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        recommendations = StoryRecommendation.objects.filter(
            user=user
        ).order_by('show_count')[:3]  # Fetch only the first 5 recommendations

        for recommendation in recommendations:
            recommendation.show_count += 1
            recommendation.has_been_shown = True
            recommendation.save()

        serializer = StorySerializer([rec.story for rec in recommendations], many=True)
        return Response(
            {'success': True, 'msg': 'Recommendations fetched successfully', 'recommendations': serializer.data},
            status=status.HTTP_200_OK
        )

class GetRecommendationsByUserView(views.APIView):
    def get(self, request, format=None):
        try:
            user_id = decode_refresh_token(request.COOKIES['refreshToken'])
            user = User.objects.get(id=user_id)
        except:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        update_recommendations(user)

        recommendations = StoryRecommendation.objects.filter(user=user)

        serializer = StoryRecommendationSerializer(recommendations, many=True)
        return Response(
            {'success': True, 'msg': 'Recommendations fetched successfully', 'recommendations': serializer.data},
            status=status.HTTP_200_OK
        )

class UpdateRecommendationsByUserView(views.APIView):
    def get(self, request, format=None):
        try:
            user_id = decode_refresh_token(request.COOKIES['refreshToken'])
            user = User.objects.get(id=user_id)
        except:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        update_recommendations(user)

        return Response(
            {'success': True, 'msg': 'Recommendations updated successfully'},
            status=status.HTTP_200_OK
        )

class AllStorywithOwnView(views.APIView):
    def get(self, request):


        cookie_value = request.COOKIES['refreshToken']
        try:
            user_id = decode_refresh_token(cookie_value)
        except:
            return Response({'success': False, 'msg': 'Unauthenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        stories = Story.objects.order_by('-creation_date')

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
