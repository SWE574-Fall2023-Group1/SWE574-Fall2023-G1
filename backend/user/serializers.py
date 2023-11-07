# serializers.py
from rest_framework import serializers
from user.models import User,Story,Location,Comment #, Date, SpecificDate, Decade, Season
from rest_framework.fields import CharField
from .functions import *
import urllib.parse
from django.contrib.auth.hashers import make_password
import os
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from django.contrib.gis.geos import Point, LineString, Polygon

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

class LocationSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'name', 'point', 'line', 'polygon', 'circle', 'radius']
        geo_field = "geometry"  # You can use a generic geometry field to cover all types

    def get_geometry(self):
        if self.instance.circle and self.instance.radius:
            # Create a buffer around the point to simulate a circle
            return self.instance.circle.buffer(self.instance.radius)
        if self.instance.line:
            return self.instance.line
        if self.instance.polygon:
            return self.instance.polygon
        return self.instance.point

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.update({'success': True, 'msg': 'Location got.'})
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

    def create(self, validated_data, **kwargs):
        location_data = validated_data.pop('location_ids')
        locations = []
        for location in location_data:
            # Determine the type and create the corresponding geometry
            if location.get('type') == 'point':
                geom = Point(location['longitude'], location['latitude'])
            elif location.get('type') == 'line':
                geom = LineString(location['coordinates'])
            elif location.get('type') == 'polygon':
                geom = Polygon(location['coordinates'])
            elif location.get('type') == 'circle':
                geom = Point(location['longitude'], location['latitude'])
                loc_instance = Location.objects.create(name=location['name'], circle=geom, radius=location['radius'])
                locations.append(loc_instance)
                continue
            # For point, line, and polygon
            loc_instance = Location.objects.create(name=location['name'], geometry=geom)
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
