from rest_framework.test import APITestCase
from django.urls import reverse
from .models import User, Story, Comment, Tag, Location
from rest_framework import status
from django.contrib.gis.geos import Point, LineString
from unittest.mock import patch
from rest_framework.test import APITestCase, APIClient
from .authentication import create_refresh_token, decode_refresh_token  # Adjust the import based on your actual token creation method


class UserRegistrationTest(APITestCase):
    def test_user_registration(self):
        url = reverse('user_register')
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'some_strong_psw',
            'password_again': 'some_strong_psw'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')

class UserLoginTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')

    def test_user_login(self):
        # Ensure the login URL is correct
        url = reverse('user_login')
        data = {'username': 'testuser', 'password': 'testpassword'}
        response = self.client.post(url, data, format='json')

        # Assert the response status code and the presence of tokens in the response
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['msg'], 'Login success')
        self.assertIn('refreshToken', response.cookies)

        # Further checks can be added here to validate the structure and content of the access and refresh tokens



class CreateStoryTest(APITestCase):
    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(username='author', email='author@example.com', password='testpassword')

        # Create a token for the user
        self.refresh_token = create_refresh_token(self.user.id)

        # Set up the client and authenticate
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.client.cookies['refreshToken'] = self.refresh_token

    def test_create_story(self):
        # Define the URL and the data
        url = reverse('create_story')
        data = {
            'author': self.user.id,
            'title': 'Test Story',
            'content': 'This is a test story content.',
            'date_type': 'year',
            'year': 2020,
            'location_ids': [
                {'name': 'Location 1', 'point': {'type': 'Point', 'coordinates': [1, 1]}},
                {'name': 'Location 2', 'line': {'type': 'LineString', 'coordinates': [[0, 0], [1, 1]]}}
            ],
            'story_tags': [
                {'name': 'Adventure', 'wikidata_id': 'Q123', 'description': 'Adventure genre', 'label': 'test_advanture'},
                {'name': 'History', 'wikidata_id': 'Q456', 'description': 'Historical genre', 'label': 'test_history'}
            ]
        }

        # Make the request and assert the response
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Story.objects.count(), 1)
        created_story = Story.objects.get()
        self.assertEqual(created_story.title, 'Test Story')
        self.assertEqual(created_story.author, self.user)

        # Assert other fields as necessary

class CreateCommentTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='commenter', email='commenter@example.com', password='testpassword')
        self.refresh_token = create_refresh_token(self.user.id)

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.client.cookies['refreshToken'] = self.refresh_token

        self.author = User.objects.create_user(username='author', email='author@example.com', password='testpassword')
        self.story = Story.objects.create(author=self.author, title='A Story', content='Story content', year=2020)
        self.tag1 = Tag.objects.create(name='Adventure', wikidata_id='Q123', description='Adventure genre', label='Test Label 1')
        self.tag2 = Tag.objects.create(name='History', wikidata_id='Q456', description='Historical genre', label='Test Label 2')
        self.location1 = Location.objects.create(name="Location 1", point=Point(1, 1))
        self.location2 = Location.objects.create(name="Location 2", line=LineString((0, 0), (1, 1)))

        # Add tags and locations to the story
        self.story.story_tags.add(self.tag1, self.tag2)
        self.story.location_ids.add(self.location1, self.location2)


    def test_create_comment(self):
        url = reverse('create_comment', kwargs={'story_id': self.story.id})
        data = {'text': 'Nice story!'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 1)
        self.assertEqual(Comment.objects.get().text, 'Nice story!')


class UpdateStoryTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='author', email='author@example.com', password='testpassword')
        self.refresh_token = create_refresh_token(self.user.id)

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.client.cookies['refreshToken'] = self.refresh_token

        self.story = Story.objects.create(author=self.user, title='Original Title', content='Original Content', year=2020)
        self.tag1 = Tag.objects.create(name='Adventure', wikidata_id='Q123', description='Adventure genre', label='Test Label 1')
        self.tag2 = Tag.objects.create(name='History', wikidata_id='Q456', description='Historical genre', label='Test Label 2')
        self.location1 = Location.objects.create(name="Location 1", point=Point(1, 1))
        self.location2 = Location.objects.create(name="Location 2", line=LineString((0, 0), (1, 1)))

        # Add tags and locations to the story
        self.story.story_tags.add(self.tag1, self.tag2)
        self.story.location_ids.add(self.location1, self.location2)

    def test_update_story(self):
        url = reverse('update_story', kwargs={'pk': self.story.id})
        data = {
            "title": "Updated Title",
            "content": "Updated content",
            "year": 2021,
            "location_ids": [
                {'id': self.location1.id, 'name': 'Updated Location 1'},
                {'id': self.location2.id, 'name': 'Updated Location 2'}
            ],
            "story_tags": [
                {'id': self.tag1.id, 'name': 'Updated Adventure', 'wikidata_id': self.tag1.wikidata_id, 'description':'Adventure genre', 'label':'Update Label 1'},
                {'id': self.tag2.id, 'name': 'Updated History', 'wikidata_id': self.tag2.wikidata_id, 'description':'History genre', 'label':'Update Label 2'}
            ]
        }
        response = self.client.put(url, data, format='json')
        if response.status_code != status.HTTP_200_OK:
            print("Response data:", response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.story.refresh_from_db()
        self.assertEqual(self.story.title, 'Updated Title')
        self.assertEqual(self.story.content, 'Updated content')


class LikeStoryTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='liker', email='liker@example.com', password='testpassword')
        self.refresh_token = create_refresh_token(self.user.id)

        self.author = User.objects.create_user(username='author', email='author@example.com', password='testpassword')
        self.story = Story.objects.create(author=self.author, title='A Story', content='Story content', year=2020)
        self.tag1 = Tag.objects.create(name='Adventure', wikidata_id='Q123', description='Adventure genre', label='Test Label 1')
        self.tag2 = Tag.objects.create(name='History', wikidata_id='Q456', description='Historical genre', label='Test Label 2')
        self.location1 = Location.objects.create(name="Location 1", point=Point(1, 1))
        self.location2 = Location.objects.create(name="Location 2", line=LineString((0, 0), (1, 1)))

        # Add tags and locations to the story
        self.story.story_tags.add(self.tag1, self.tag2)
        self.story.location_ids.add(self.location1, self.location2)


        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.client.cookies['refreshToken'] = self.refresh_token

    def test_like_story(self):
        url = reverse('like_story', kwargs={'pk': self.story.id})
        response = self.client.post(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.story.refresh_from_db()
        self.assertTrue(self.user in self.story.likes.all())


class StoryDetailViewTest(APITestCase):
    def setUp(self):
        # Set up data and authenticate as needed
        self.user = User.objects.create_user(username='viewer', email='viewer@example.com', password='testpassword')
        self.author = User.objects.create_user(username='storyauthor', email='storyauthor@example.com', password='testpassword')
        self.story = Story.objects.create(author=self.author, title='A Story', content='Story content', year=2020)
        self.tag1 = Tag.objects.create(name='Adventure', wikidata_id='Q123', description='Adventure genre', label='Test Label 1')
        self.tag2 = Tag.objects.create(name='History', wikidata_id='Q456', description='Historical genre', label='Test Label 2')
        self.location1 = Location.objects.create(name="Location 1", point=Point(1, 1))
        self.location2 = Location.objects.create(name="Location 2", line=LineString((0, 0), (1, 1)))

        # Add tags and locations to the story
        self.story.story_tags.add(self.tag1, self.tag2)
        self.story.location_ids.add(self.location1, self.location2)

        self.refresh_token = create_refresh_token(self.user.id)
        self.client.cookies['refreshToken'] = self.refresh_token
        self.client.force_authenticate(user=self.user)

    def test_story_detail_success(self):
        # Test successful retrieval of story details
        url = reverse('get_story', kwargs={'pk': self.story.id})  # Adjust to your URL name
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.story.title)  # Ensure the correct story is returned

    def test_story_detail_not_found(self):
        # Test response for a non-existent story
        url = reverse('get_story', kwargs={'pk': 99999})  # An unlikely ID
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
