from rest_framework.test import APITestCase
from django.urls import reverse
from .models import User, Story, Comment, Tag, Location
from rest_framework import status
from django.contrib.gis.geos import Point, LineString
from unittest.mock import patch
from rest_framework.test import APITestCase, APIClient
from .authentication import create_refresh_token, decode_refresh_token  # Adjust the import based on your actual token creation method
import json
from datetime import datetime

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

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Story.objects.count(), 1)
        created_story = Story.objects.get()
        self.assertEqual(created_story.title, 'Test Story')
        self.assertEqual(created_story.author, self.user)

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
        url = reverse('get_story', kwargs={'pk': self.story.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.story.title)

    def test_story_detail_not_found(self):
        # Test response for a non-existent story
        url = reverse('get_story', kwargs={'pk': 99999})  # An unlikely ID
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class UserLogoutTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='logouttest', email='logouttest@example.com', password='testpassword')
        self.refresh_token = create_refresh_token(self.user.id)
        self.client.cookies['refreshToken'] = self.refresh_token
        self.client.force_authenticate(user=self.user)

    def test_user_logout(self):
        url = reverse('user_logout')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Check if 'refreshToken' is set to an empty string, indicating deletion
        self.assertEqual(response.cookies.get('refreshToken').value, '')


class FollowUserViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='follower', email='follower@example.com', password='testpassword')
        self.target_user = User.objects.create_user(username='targetuser', email='targetuser@example.com', password='testpassword')
        self.refresh_token = create_refresh_token(self.user.id)
        self.client.cookies['refreshToken'] = self.refresh_token
        self.client.force_authenticate(user=self.user)

    def test_follow_user(self):
        url = reverse('follow_user', kwargs={'id': self.target_user.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['msg'], 'Followed')

class UserDetailsViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='detailviewuser', email='detailviewuser@example.com', password='testpassword')
        self.refresh_token = create_refresh_token(self.user.id)
        self.client.cookies['refreshToken'] = self.refresh_token
        self.client.force_authenticate(user=self.user)

    def test_get_user_details(self):
        url = reverse('user_details')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)

class UserBiographyUpdateTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='biographer', email='bio@example.com', password='testpassword')
        self.refresh_token = create_refresh_token(self.user.id)  # Create a JWT refresh token
        self.client.cookies['refreshToken'] = self.refresh_token  # Set the refresh token in the cookies
        self.client.force_authenticate(user=self.user)  # Authenticate the user for this test

    def test_update_user_biography(self):
        url = reverse('user_bio')
        new_biography = "This is the new biography."
        data = {'biography': new_biography}
        response = self.client.put(url, data, format='json')

        # Print response data for debugging
        print("Response Data:", response.data)
        print("Response Status Code:", response.status_code)

        # Adjust the expected status code if necessary
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.user.refresh_from_db()
        self.assertEqual(self.user.biography, new_biography)


class ActivityStreamViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='activeuser', email='active@example.com', password='testpassword')
        self.refresh_token = create_refresh_token(self.user.id)
        self.client.cookies['refreshToken'] = self.refresh_token
        self.client.force_authenticate(user=self.user)

    def test_activity_stream(self):
        url = reverse('activity-stream')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data.get('activity'), list)

class WikidataSearchViewTest(APITestCase):
    def test_wikidata_search(self):
        url = reverse('wikidata_search')
        response = self.client.get(url, {'query': 'test'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['tags']), 0)


class SearchStoryViewTest(APITestCase):
    def setUp(self):
        # Set up data and authenticate as needed
        self.user = User.objects.create_user(username='searcher', email='searcher@example.com', password='testpassword')
        self.author = User.objects.create_user(username='author', email='author@example.com', password='testpassword')

        # Create tags and locations
        self.tag_adventure = Tag.objects.create(name='Adventure', wikidata_id='Q123', description='Adventure genre', label='Adventure')
        self.tag_history = Tag.objects.create(name='History', wikidata_id='Q456', description='Historical genre', label='History')
        self.location_mountain = Location.objects.create(name="Mountain", point=Point(10, 50))
        self.location_sea = Location.objects.create(name="Sea", line=LineString((0, 0), (5, 5)))

        # Create stories with appropriate date and date_type
        self.story1 = Story.objects.create(
            author=self.author,
            title='Adventure in the Mountains',
            content='Story content about mountains',
            date_type=Story.NORMAL_DATE,
            date=datetime(2020, 1, 1)
        )
        self.story2 = Story.objects.create(
            author=self.author,
            title='History of the Seas',
            content='Story content about seas',
            date_type=Story.NORMAL_DATE,
            date=datetime(2021, 1, 1)
        )

        # Add tags and locations to the stories
        self.story1.story_tags.add(self.tag_adventure)
        self.story1.location_ids.add(self.location_mountain)
        self.story2.story_tags.add(self.tag_history)
        self.story2.location_ids.add(self.location_sea)

        # Authenticate
        self.refresh_token = create_refresh_token(self.user.id)
        self.client.cookies['refreshToken'] = self.refresh_token
        self.client.force_authenticate(user=self.user)

    def test_search_story_with_location(self):
        url = reverse('search_story')

        location = {
        "type": "Point",
        "coordinates": [10, 50]
        }
        radius_diff = 10

        search_params = {
            'location': json.dumps(location),
            'radius_diff': radius_diff,
            'title': 'Adventure'
        }

        # Make the request and assert the response
        response = self.client.get(url, search_params, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the correct story is returned based on location and title
        self.assertIn('Adventure in the Mountains', [story['title'] for story in response.data['stories']])

    def test_search_story_with_title(self):
        url = reverse('search_story')

        search_params = {
            'title': 'Adventure in the Mountains'
        }

        # Make the request and assert the response
        response = self.client.get(url, search_params, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Adventure in the Mountains', [story['title'] for story in response.data['stories']])

    def test_search_story_with_author(self):
        url = reverse('search_story')

        search_params = {
            'author': 'author'
        }

        # Make the request and assert the response
        response = self.client.get(url, search_params, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected_author_id = self.author.id
        self.assertTrue(all(story['author'] == expected_author_id for story in response.data['stories']))


    def test_search_story_with_tag(self):
        url = reverse('search_story')

        search_params = {
            'tag': 'Q123'  # Wikidata ID for the 'Adventure' tag
        }
        response = self.client.get(url, search_params, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertTrue(any('Q123' in [tag['wikidata_id'] for tag in story.get('story_tags', [])] for story in response.data['stories']))


    def test_search_story_not_found(self):
        url = reverse('search_story')

        search_params = {
            'location': json.dumps({"type": "Point", "coordinates": [80, -40]}),
            'radius_diff': 5,
            'title': 'Nonexistent'
        }

        # Make the request and assert the response
        response = self.client.get(url, search_params, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['stories']), 0)
