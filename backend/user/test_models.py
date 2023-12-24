import datetime
from django.test import TestCase
from django.contrib.gis.geos import Point, LineString, Polygon
from .models import User, Location, Story, Tag, Comment, PasswordResetToken, Activity, StoryRecommendation
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.contrib.auth.models import Group, Permission

class UserTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        User.objects.create(username='testuser', email='user@example.com')

    def test_email_field(self):
        user = User.objects.get(username='testuser')
        self.assertEquals(user.email, 'user@example.com')

    def test_creation_date_auto_now_add(self):
        user = User.objects.get(username='testuser')
        self.assertTrue(isinstance(user.creation_date, datetime.datetime))



class LocationTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create locations with different geographic attributes
        Location.objects.create(name="Test Location Point", point=Point(1, 1))
        Location.objects.create(name="Test Location Line", line=LineString((0, 0), (1, 1)))
        Location.objects.create(name="Test Location Polygon", polygon=Polygon(((0, 0), (1, 1), (1, 0), (0, 0))))
        Location.objects.create(name="Test Location Circle", circle=Point(1, 1), radius=5)

    def test_location_with_point(self):
        location = Location.objects.get(name="Test Location Point")
        self.assertEquals(str(location), 'Test Location Point')
        self.assertIsNotNone(location.point)
        self.assertIsNone(location.line)
        self.assertIsNone(location.polygon)
        self.assertIsNone(location.circle)
        self.assertIsNone(location.radius)

    def test_location_with_line(self):
        location = Location.objects.get(name="Test Location Line")
        self.assertEquals(str(location), 'Test Location Line')
        self.assertIsNone(location.point)
        self.assertIsNotNone(location.line)
        self.assertIsNone(location.polygon)
        self.assertIsNone(location.circle)
        self.assertIsNone(location.radius)

    def test_location_with_polygon(self):
        location = Location.objects.get(name="Test Location Polygon")
        self.assertEquals(str(location), 'Test Location Polygon')
        self.assertIsNone(location.point)
        self.assertIsNone(location.line)
        self.assertIsNotNone(location.polygon)
        self.assertIsNone(location.circle)
        self.assertIsNone(location.radius)

    def test_location_with_circle_and_radius(self):
        location = Location.objects.get(name="Test Location Circle")
        self.assertEquals(str(location), 'Test Location Circle')
        self.assertIsNone(location.point)
        self.assertIsNone(location.line)
        self.assertIsNone(location.polygon)
        self.assertIsNotNone(location.circle)
        self.assertIsNotNone(location.radius)


class StoryTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create user
        author = User.objects.create(username='author', email='author@example.com')

        # Create tags
        tag1 = Tag.objects.create(name='Adventure', wikidata_id='Q123', description='Adventure genre')
        tag2 = Tag.objects.create(name='History', wikidata_id='Q456', description='Historical genre')

        # Create locations
        location1 = Location.objects.create(name="Location 1", point=Point(1, 1))
        location2 = Location.objects.create(
            name="Location 2",
            line=LineString((0, 0), (1, 1))  # Replace with actual coordinates for your use case
        )
        # Create story with year field set to comply with clean method's validation
        story = Story.objects.create(
            author=author,
            title='Test Story',
            content='This is a test story content.',
            year=2020  # Only one date field is set
        )

        # Add tags and locations to the story
        story.story_tags.add(tag1, tag2)
        story.location_ids.add(location1, location2)

    def test_story_creation(self):
        story = Story.objects.get(title='Test Story')
        self.assertEquals(story.content, 'This is a test story content.')

        # Test that the tags were added correctly
        self.assertEquals(story.story_tags.count(), 2)
        self.assertTrue(story.story_tags.filter(name='Adventure').exists())
        self.assertTrue(story.story_tags.filter(name='History').exists())

        # Test that the locations were added correctly
        self.assertEquals(story.location_ids.count(), 2)
        self.assertTrue(story.location_ids.filter(name='Location 1').exists())
        self.assertTrue(story.location_ids.filter(name='Location 2').exists())

    def test_clean_method(self):
        story = Story.objects.get(title='Test Story')
        story.start_year = 1990
        story.end_year = 2000
        with self.assertRaises(ValidationError):
            story.clean()

    # ... Add more tests for field validation, relationships, and custom methods



class TagTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a tag with a Wikidata Q code, description, and label
        Tag.objects.create(
            name='Adventure',
            wikidata_id='Q123456',
            description='A genre of exciting and often risky activity.',
            label='Adventure Genre'
        )

    def test_tag_str(self):
        tag = Tag.objects.get(name='Adventure')
        self.assertEquals(str(tag), 'Adventure')

    def test_wikidata_id(self):
        tag = Tag.objects.get(name='Adventure')
        self.assertEquals(tag.wikidata_id, 'Q123456')

    def test_description(self):
        tag = Tag.objects.get(name='Adventure')
        self.assertEquals(tag.description, 'A genre of exciting and often risky activity.')

    def test_label(self):
        tag = Tag.objects.get(name='Adventure')
        self.assertEquals(tag.label, 'Adventure Genre')

    # Test for valid wikidata_id format (if you have a specific format)
    def test_wikidata_id_format(self):
        tag = Tag.objects.get(name='Adventure')
        # Here, use a regex or any other method you prefer to validate the format of the Q code
        self.assertRegex(tag.wikidata_id, r'^Q\d+$')


class CommentTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        user = User.objects.create(username='commenter', email='commenter@example.com')
        author = User.objects.create(username='author', email='author@example.com')
        story = Story.objects.create(
                author=author,
                title='Test Story',
                content='This is a test story content',
                date_type = 'year',
                year=2020  # Only one date field is set
        )
        Comment.objects.create(comment_author=user, story=story, text='Nice story!')

    def test_comment_content(self):
        comment = Comment.objects.get(text='Nice story!')
        self.assertEquals(comment.text, 'Nice story!')

    # ... Add more tests for field validation and any custom methods



class ActivityTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        user = User.objects.create(username='active_user', email='active_user@example.com')
        Activity.objects.create(user=user, activity_type='new_story')

    def test_activity_creation(self):
        activity = Activity.objects.get(user__username='active_user')
        self.assertEquals(activity.activity_type, 'new_story')

    # ... Add more tests for field validation and any custom methods


class StoryRecommendationTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        user = User.objects.create(username='recommender', email='recommender@example.com')
        author = User.objects.create(username='author', email='author@example.com')
        story = Story.objects.create(
            author=author,
            title='Story to Recommend',
            content='This is a test story Recommend',
            date_type = 'year',
            year=2020  # Only one date field is set
        )
        StoryRecommendation.objects.create(story=story, user=user)

    def test_recommendation_creation(self):
        recommendation = StoryRecommendation.objects.get(user__username='recommender')
        self.assertEquals(recommendation.story.title, 'Story to Recommend')

#     # ... Add more tests for field validation and any custom methods
