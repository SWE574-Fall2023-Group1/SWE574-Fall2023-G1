# models.py
from django.db import models
from django.contrib.auth.models import AbstractUser,Group,Permission
from django.core.exceptions import ValidationError
from django.utils.crypto import get_random_string
from datetime import timedelta
from django.utils import timezone
from ckeditor.fields import RichTextField
from django.contrib.gis.db import models as gis_models

class User(AbstractUser):
    email = models.EmailField(verbose_name="e-mail", max_length = 100, unique = True)
    username = models.CharField(max_length=30, unique=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    password_again = models.CharField(max_length=128, verbose_name='password_again',null=True)
    biography = models.TextField(blank=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    followers = models.ManyToManyField('self', related_name='following', symmetrical=False, blank=True)

class Location(models.Model):
    name = models.CharField(max_length=255)
    point = gis_models.PointField(geography=True, blank=True, null=True)
    line = gis_models.LineStringField(geography=True, blank=True, null=True)
    polygon = gis_models.PolygonField(geography=True, blank=True, null=True)  # Can be used for rectangles too
    circle = gis_models.PointField(geography=True, blank=True, null=True)  # Represented as a point with radius
    radius = models.DecimalField(max_digits=19, decimal_places=10, blank=True, null=True)  # Used with circle

    def __str__(self):
        return self.name

class StoryImage(models.Model):
    image = models.ImageField(upload_to='story_images/')

class Tag(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)
    wikidata_id = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    label = models.CharField(max_length=255, null=True)  # New field for label


    def __str__(self):
        return self.name

class Story(models.Model):
    YEAR_INTERVAL = 'year_interval'
    YEAR = 'year'
    NORMAL_DATE = 'normal_date'
    INTERVAL_DATE = 'interval_date'
    DECADE = 'decade'

    DATE_TYPES = [
        (YEAR_INTERVAL, 'Year Interval'),
        (YEAR, 'year'),
        (NORMAL_DATE, 'Normal Date'),
        (INTERVAL_DATE, 'Interval Date'),
        (DECADE, 'Decade'),
    ]


    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, default="Test Title")
    content = RichTextField(default="Test Content")
    creation_date = models.DateTimeField(null=True,auto_now_add=True)
    story_tags = models.ManyToManyField(Tag, blank=True)
    location_ids = models.ManyToManyField(Location, blank=True)
    date_type = models.CharField(max_length=20, choices=DATE_TYPES, default=NORMAL_DATE)
    season_name = models.CharField(max_length=255, null=True, blank=True)
    start_year = models.PositiveIntegerField(null=True, blank=True)
    end_year = models.PositiveIntegerField(null=True, blank=True)
    decade = models.PositiveIntegerField(null=True, blank=True)
    year = models.PositiveIntegerField(null=True, blank=True)
    date = models.DateTimeField(null=True, blank=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date =models.DateTimeField(null=True, blank=True)
    include_time = models.BooleanField(default=False)
    likes = models.ManyToManyField(User, related_name='liked_stories', blank=True)

    def clean(self):
        # Custom validation to ensure only one date field is set

        date_fields = [self.start_year, self.year, self.date, self.end_date, self.decade]
        #print(date_fields)
        if date_fields.count(None) != 4:
            raise ValidationError("Only one type of date field should be set.")

    def save(self, *args, **kwargs):
        self.clean()
        super(Story, self).save(*args, **kwargs)


    def __str__(self):
        return self.title

class Comment(models.Model):
    comment_author = models.ForeignKey(User, on_delete=models.CASCADE)
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.comment_author} on {self.story.title}'

class PasswordResetToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=64, unique=True)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.pk:
            self.token = get_random_string(length=64)
            self.expires_at = timezone.now() + timedelta(hours=24)
        super().save(*args, **kwargs)

class Activity(models.Model):
    TYPE_CHOICES = [
        ('new_story', 'New Story Created'),
        ('story_liked', 'Story Liked'),
        ('story_unliked', 'Story Unliked'),
        ('followed_user', 'Followed User'),
        ('unfollowed_user', 'Unfollowed User'),
        ('new_commented_on_story', 'Comment on Story'),
        ('new_comment_on_comment', 'Comment a Story You Commented Before'),
        # Add more types as needed
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    date = models.DateTimeField(auto_now_add=True)
    target_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='user_activities')
    target_story = models.ForeignKey(Story, on_delete=models.SET_NULL, null=True, blank=True, related_name='story_activities')
    viewed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.activity_type}"

class StoryRecommendation(models.Model):
    story = models.ForeignKey('Story', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    related_stories = models.ManyToManyField('Story', related_name='recommendations')
    location_related = models.BooleanField(default=False)
    time_related = models.BooleanField(default=False)
    content_related = models.IntegerField(default=0)
    tag_related = models.BooleanField(default=False)
    show_count = models.IntegerField(default=0)
    has_been_shown = models.BooleanField(default=False)
    points = models.FloatField(default=0.0)  # Field to store the recommendation points


    class Meta:
        unique_together = ('story', 'user')
