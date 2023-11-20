# serializers.py
from rest_framework import serializers
from user.models import User,Story,Location,Comment,Activity #, Date, SpecificDate, Decade, Season
from rest_framework.fields import CharField
from .functions import *
import urllib.parse
from django.contrib.auth.hashers import make_password
import os
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from django.contrib.gis.geos import Point, LineString, Polygon, LinearRing

class UserRegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password','password_again')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        if validated_data["password"] != validated_data["password_again"]:
            raise serializers.ValidationError("Passwords do not match!")

        validated_data["password"] = make_password(validated_data["password"])
        del validated_data["password_again"]

        user_data = self.Meta.model(**validated_data)
        user_data.save()
        return user_data

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.update({'success': True, 'msg': 'User details got.'})
        return ret


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "biography",
            "followers",
            "profile_photo"
        ]
        read_only_fields = ("id",)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.update({'success': True, 'msg': 'User details got.'})
        return ret

class UserFollowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.update({'success': True, 'msg': 'User followers got.'})
        return ret

class UserLoginSerializer(serializers.ModelSerializer):
    #token = CharField(allow_blank=True, read_only=True)
    username = CharField(write_only=True, required=True)
    user = UsersSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "username",
            "password",
            "user",
        ]
        extra_kwargs = {"password": {"write_only": True, "required": False}}

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.update({'success': True, 'msg': 'User loged in.'})
        return ret

class UserBiographySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['biography']

    def update(self, instance, validated_data):
        instance.biography = validated_data.get('biography', instance.biography)
        instance.save()
        return instance

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.update({'success': True, 'msg': 'User bio got.'})
        return ret

class UserPhotoSerializer(serializers.ModelSerializer):

    photo_url = serializers.SerializerMethodField('get_image_url')

    class Meta:
        model = User
        fields = ['profile_photo', 'photo_url']

    def get_image_url(self, obj):
        if obj.profile_photo:
            backend_host_ip = os.environ.get('BACKEND_HOST_IP', 'localhost')
            backend_host = f"http://{backend_host_ip}:8000"
            return backend_host + obj.profile_photo.url
        return None

    def update(self, instance, validated_data):
        instance.profile_photo = validated_data.get('profile_photo', instance.profile_photo)
        instance.save()
        return instance

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.update({'success': True, 'msg': 'User photo got.'})
        return ret

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'name', 'point', 'line', 'polygon', 'circle', 'radius']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.update({'success': True, 'msg': 'Location ok.'})
        return ret



class StorySerializer(serializers.ModelSerializer):
    location_ids = LocationSerializer(many=True)
    author_username = serializers.StringRelatedField(source='author.username')

    class Meta:
        model = Story
        fields = ['id', 'author','author_username', 'title', 'content', 'story_tags', 'location_ids', 'date_type', 'season_name', 'year','start_year','end_year', 'date','creation_date','start_date','end_date','decade','include_time','likes']

    def validate(self, attrs):
        date_type = attrs.get('date_type')
        start_year = attrs.get('start_year')
        end_year = attrs.get('end_year')
        season_name = attrs.get('season_name')
        year = attrs.get('year')
        decade = attrs.get('decade')
        date = attrs.get('date')
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')

        if date_type == Story.YEAR_INTERVAL and (decade is not None or year is not None or date is not None or start_date is not None or end_date is not None):
            raise serializers.ValidationError("Only 'year_interval' field should be set when 'date_type' is 'year_interval'.")
        elif date_type == Story.YEAR and (decade is not None or start_year is not None or end_year is not None or date is not None or start_date is not None or end_date is not None):
            raise serializers.ValidationError("Only 'year' field should be set when 'date_type' is 'year'.")
        elif date_type == Story.NORMAL_DATE and (decade is not None or start_year is not None or end_year is not None or year is not None or start_date is not None or end_date is not None):
            raise serializers.ValidationError("Only 'date' field should be set when 'date_type' is 'normal_date'.")
        elif date_type == Story.INTERVAL_DATE and (decade is not None or start_year is not None or end_year is not None or year is not None or date is not None):
            raise serializers.ValidationError("Only 'date_interval' field should be set when 'date_type' is 'date_interval'.")
        elif date_type == Story.DECADE and (start_year is not None or end_year is not None or year is not None or date is not None or start_date is not None or end_date is not None):
            raise serializers.ValidationError("Only 'decade' field should be set when 'date_type' is 'decade'.")

        return attrs

    def create(self, validated_data):
        location_data = validated_data.pop('location_ids')
        locations = []
        for location in location_data:
            loc_instance = None
            if location.get('point'):
                loc_instance = Location.objects.create(
                    name=location['name'],
                    point=Point(location['point']['coordinates'], srid=4326)
                )
            elif location.get('line'):
                loc_instance = Location.objects.create(
                    name=location['name'],
                    line=LineString(location['line']['coordinates'], srid=4326)
                )
            elif location.get('polygon'):
                # Assuming location['polygon']['coordinates'] is an array containing one array of coordinates
                outer_ring_coords = location['polygon']['coordinates'][0]
                outer_ring = LinearRing(outer_ring_coords)
                loc_instance = Location.objects.create(
                    name=location['name'],
                    polygon=Polygon(outer_ring, srid=4326)
                )
            elif location.get('circle'):
                loc_instance = Location.objects.create(
                    name=location['name'],
                    circle=Point(location['circle']['coordinates'], srid=4326),
                    radius=location['radius']
                )
            if loc_instance:
                locations.append(loc_instance)

        story = Story.objects.create(**validated_data)
        story.location_ids.set(locations)
        return story

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.update({'success': True, 'msg': 'Story ok.'})
        return ret

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'comment_author', 'story', 'text', 'date']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.update({'success': True, 'msg': 'Comment create.'})
        return ret

class CommentGetSerializer(serializers.ModelSerializer):
    comment_author = serializers.SerializerMethodField()
    comment_author_id = serializers.SerializerMethodField()

    def get_comment_author(self, obj):
        return obj.comment_author.username
    def get_comment_author_id(self, obj):
        return obj.comment_author.id

    class Meta:
        model = Comment
        fields = ['id', 'comment_author','comment_author_id', 'story', 'text', 'date']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.update({'success': True, 'msg': 'Comment details got.'})
        return ret

class StoryUpdateSerializer(serializers.ModelSerializer):
    location_ids = LocationSerializer(many=True)

    class Meta:
        model = Story
        fields = ['id', 'title', 'content', 'story_tags', 'location_ids', 'date_type', 'season_name', 'year','start_year','end_year', 'date','creation_date','start_date','end_date','decade','include_time','likes']

    def validate(self, attrs):
        date_type = attrs.get('date_type')
        start_year = attrs.get('start_year')
        end_year = attrs.get('end_year')
        season_name = attrs.get('season_name')
        year = attrs.get('year')
        decade = attrs.get('decade')
        date = attrs.get('date')
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')

        if date_type == Story.YEAR_INTERVAL and (decade is not None or year is not None or date is not None or start_date is not None or end_date is not None):
            raise serializers.ValidationError("Only 'year_interval' field should be set when 'date_type' is 'year_interval'.")
        elif date_type == Story.YEAR and (decade is not None or start_year is not None or end_year is not None or date is not None or start_date is not None or end_date is not None):
            raise serializers.ValidationError("Only 'year' field should be set when 'date_type' is 'year'.")
        elif date_type == Story.NORMAL_DATE and (decade is not None or start_year is not None or end_year is not None or year is not None or start_date is not None or end_date is not None):
            raise serializers.ValidationError("Only 'date' field should be set when 'date_type' is 'normal_date'.")
        elif date_type == Story.INTERVAL_DATE and (decade is not None or start_year is not None or end_year is not None or year is not None or date is not None):
            raise serializers.ValidationError("Only 'date_interval' field should be set when 'date_type' is 'date_interval'.")
        elif date_type == Story.DECADE and (start_year is not None or end_year is not None or year is not None or date is not None or start_date is not None or end_date is not None):
            raise serializers.ValidationError("Only 'decade' field should be set when 'date_type' is 'decade'.")

        return attrs

    def update(self, instance, validated_data):
        location_data = validated_data.pop('location_ids', [])
        locations = []

        for location_dict in location_data:
            if 'point' in location_dict:
                point_coords = location_dict['point']['coordinates']
                location_dict['point'] = Point(point_coords[0], point_coords[1], srid=4326)
            elif 'line' in location_dict:
                line_coords = location_dict['line']['coordinates']
                location_dict['line'] = LineString(line_coords, srid=4326)
            elif 'polygon' in location_dict:
                polygon_coords = location_dict['polygon']['coordinates'][0]  # Assuming first element is outer ring
                location_dict['polygon'] = Polygon(polygon_coords, srid=4326)
            elif 'circle' in location_dict:
                circle_coords = location_dict['circle']['coordinates']
                location_dict['circle'] = Point(circle_coords[0], circle_coords[1], srid=4326)

            location, created = Location.objects.get_or_create(
                name=location_dict.get('name'),
                defaults=location_dict
            )
            locations.append(location)

        instance.location_ids.set(locations)

        # Update other fields of Story instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.update({'success': True, 'msg': 'Story ok.'})
        return ret

class ActivitySerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    target_user_username = serializers.CharField(source='target_user.username', read_only=True, allow_null=True)
    target_story_title = serializers.CharField(source='target_story.title', read_only=True, allow_null=True)

    class Meta:
        model = Activity
        fields = ['id', 'user', 'user_username', 'activity_type', 'date', 'viewed', 'target_user', 'target_user_username', 'target_story', 'target_story_title']
