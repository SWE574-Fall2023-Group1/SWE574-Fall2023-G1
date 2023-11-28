# tests.py
from django.core.exceptions import ValidationError
from datetime import datetime
from .models import User, Location, Story, Comment
from django.test import TestCase, RequestFactory
from django.urls import reverse
from rest_framework.test import APIClient,APITestCase
from django.shortcuts import get_object_or_404
from rest_framework import status
from .authentication import *
from .views import *
import json


def get_jwt_for_user(user):
    token = create_refresh_token(user.pk)
    return token

def get_user_id_from_token(token):
    user_id = decode_refresh_token(token)
    return user_id

class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="testpassword"
        )

    def test_user_creation(self):
        self.assertEqual(self.user.username, "testuser")
        self.assertEqual(self.user.email, "testuser@example.com")

    def test_user_following(self):
        user2 = User.objects.create_user(
            username="testuser2",
            email="testuser2@example.com",
            password="testpassword2"
        )
        self.user.following.add(user2)
        self.assertTrue(user2 in self.user.following.all())

# class LocationModelTest(TestCase):
#     def setUp(self):
#         self.location = Location.objects.create(
#             name="Test Location",
#             latitude=12.3456789,
#             longitude=98.7654321
#         )

#     def test_location_creation(self):
#         self.assertEqual(self.location.name, "Test Location")
#         self.assertEqual(self.location.latitude, 12.3456789)
#         self.assertEqual(self.location.longitude, 98.7654321)

class StoryModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="testpassword"
        )
        self.story = Story.objects.create(
            author=self.user,
            title="Test Story",
            content="<p>This is a test story.</p>",
            story_tags="test, story",
            date=datetime(2023, 5, 15)
        )

    def test_story_creation(self):
        self.assertEqual(self.story.author, self.user)
        self.assertEqual(self.story.title, "Test Story")
        self.assertEqual(self.story.content, "<p>This is a test story.</p>")
        self.assertEqual(self.story.story_tags, "test, story")

    # def test_invalid_date_fields(self):
    #     with self.assertRaises(ValidationError):
    #         story = Story(
    #             author=self.user,
    #             title="Invalid Date Test",
    #             content="<p>Invalid date test story.</p>",
    #             story_tags="test, invalid",
    #             date=datetime(2023, 5, 15)
    #         )
    #         story.save()

class CommentModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="testpassword"
        )
        self.story = Story.objects.create(
            author=self.user,
            title="Test Story",
            content="<p>This is a test story.</p>",
            story_tags="test, story",
            year=1996
        )
        self.comment = Comment.objects.create(
            comment_author=self.user,
            story=self.story,
            text="This is a test comment."
        )

    def test_comment_creation(self):
        self.assertEqual(self.comment.comment_author, self.user)
        self.assertEqual(self.comment.story, self.story)
        self.assertEqual(self.comment.text, "This is a test comment.")

client = APIClient()

class UserRegistrationViewTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.view = UserRegistrationView.as_view()

    def test_user_registration_view(self):
        data = {
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "testpassword",
            "password_again": "testpassword"
        }
        response = self.client.post(reverse('register'), data)
        self.assertEqual(response.status_code, 201)

class UserLoginViewTestCase(APITestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.view = UserLoginView.as_view()
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="testpassword"
        )
        self.client = APIClient()

    def test_user_login_view(self):
        data = {
            "username": "testuser",
            "password": "testpassword"
        }
        response = self.client.post(reverse('login'), json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('refreshToken', response.cookies)

    def test_user_login_view_invalid_credentials(self):
        data = {
            "username": "testuser",
            "password": "wrongpassword"
        }
        response = self.client.post(reverse('login'), json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('success', response.data)
        self.assertEqual(response.data['success'], False)


class CreateStoryViewTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.view = CreateStoryView.as_view()
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpassword')

    def test_create_story_view(self):
    # Assuming 'location_ids' is a list of locations,
    # and each location only contains a 'name' field.
        location_data = [
            {'name': 'location1', 'latitude': 12.3456789, 'longitude': 98.7654321},
            {'name': 'location2', 'latitude': 12.3456789, 'longitude': 98.7654321},
        ]

        story_data = {
            'title': 'Test Story',
            'content': '<p>This is a test story.</p>',
            'story_tags': 'test, story',
            'location_ids': location_data,
            'date_type': Story.YEAR,
            'season_name': 'Spring',
            'year': 1996,
        }

        request = self.factory.post(reverse('createStory'), data=json.dumps(story_data), content_type='application/json')
        request.user = self.user
        refresh_token = create_refresh_token(self.user.id)
        request.COOKIES['refreshToken'] = refresh_token

        response = self.view(request)
        self.assertEqual(response.status_code, 201)

        # Login for subsequent tests if required
        self.client = APIClient()
        self.client.login(username='testuser', password='testpassword')



class LogoutAPIViewTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.view = LogoutAPIView.as_view()
        self.user = User.objects.create_user(username="testuser", password="testpassword")

    def test_logout_api_view(self):
        request = self.factory.post(reverse('logout'))
        request.user = self.user
        refresh_token = create_refresh_token(self.user.id)
        request.COOKIES['refreshToken'] = refresh_token

        response = self.view(request)
        self.assertEqual(response.status_code, 201)

class UpdateStoryViewTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.view = UpdateStoryView.as_view()
        self.user = User.objects.create_user(username="testuser", password="testpassword")
        self.story = Story.objects.create(
            author=self.user,
            title="Test Story",
            content="<p>This is a test story.</p>",
            story_tags="test, story",
            date=datetime(2023, 5, 15)
        )

    def test_update_story_view(self):
        # Add updated content to request data
        updated_data = {
            'content': '<p>This is an updated test story.</p>'
        }

        request = self.factory.put(reverse('storyUpdate', args=[self.story.pk]), data=updated_data, content_type='application/json')
        request.user = self.user
        refresh_token = create_refresh_token(self.user.id)
        request.COOKIES['refreshToken'] = refresh_token

        response = self.view(request, pk=self.story.pk)
        self.assertEqual(response.status_code, 201)


# class CreateCommentViewTestCase(TestCase):
#     def setUp(self):
#         self.factory = RequestFactory()
#         self.view = CreateCommentView.as_view()
#         self.user = User.objects.create_user(username="testuser", password="testpassword")
#         self.story = Story.objects.create(
#             author=self.user,
#             title="Test Story2",
#             content="<p>This is a test story.</p>",
#             story_tags="test, story",
#             year=1996,
#             season_name="Spring"
#         )

#     def test_create_comment_view(self):
#         comment_data = {
#             'text': 'This is a test comment.'
#         }

#         request = self.factory.post(reverse('comment', args=[self.story.pk]), data=comment_data)
#         request.user = self.user
#         refresh_token = create_refresh_token(self.user.id)
#         request.COOKIES['refreshToken'] = refresh_token

#         response = self.view(request, id=self.story.pk)
#         self.assertEqual(response.status_code, 201)

#         self.client = APIClient()
#         self.client.login(username='testuser', password='testpassword')
