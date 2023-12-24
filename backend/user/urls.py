from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from rest_framework_swagger.views import get_swagger_view
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="SWE574 G1 Memories Application API",
        default_version='v1',
        description="SWE574 G1 Memories Application API Documentation",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)
urlpatterns = [
    path('register', UserRegistrationView.as_view(), name="user_register"),
    path('login', UserLoginView.as_view(),name="user_login"),
    path('user', AuthUserAPIView.as_view(), name='user_auth'),
    path('refresh', RefreshUserAuthAPIView.as_view(), name='user_refresh'),
    path('logout', LogoutAPIView.as_view(),name="user_logout"),
    path('storyCreate',CreateStoryView.as_view(),name="create_story"),
    path('storyUpdate/<int:pk>', UpdateStoryView.as_view(),name="update_story"),
    path('like/<int:pk>',LikeStoryView.as_view(), name='like_story'),
    path('storyGet/<int:pk>', StoryDetailView.as_view(), name='get_story'),
    path('storyGetbyAuthor/<int:user_id>', StoryAuthorView.as_view(), name='story_get_by_author'),
    path('comment/<int:story_id>', CreateCommentView.as_view(), name='create_comment'),
    path('commentsByStory/<int:id>',StoryCommentsView.as_view(), name='comments_get'),
    path('followByUser/<int:id>',FollowUserView.as_view(), name= 'follow_user'),
    path('userFollowers',UserFollowersView.as_view(), name = 'user_followers'),
    path('userFollowers/<int:user_id>',UserFollowersView.as_view(), name='user_followers_2'),
    path('userStories',StoryAuthorView.as_view(), name = 'user_stories'),
    path('userStories/<int:user_id>',StoryAuthorView.as_view(), name= 'user_stories_by_id'),
    path('allStories',AllStoryView.as_view(), name='all_stories'),
    path('biography',UserBiographyView.as_view(), name='user_bio'),
    path('userDetails',UserDetailsView.as_view(), name='user_details'),
    path('userDetails/<int:user_id>',UserDetailsView.as_view(), name = 'user_details_by_id'),
    path('profilePhoto',UserPhotoView.as_view(), name='user_photo'),
    path('profilePhoto/<int:user_id>',UserPhotoView.as_view(), name='user_photo_by_id'),
    path('searchUser', SearchUserView.as_view(), name='search_user'),
    path('storySearch', SearchStoryView.as_view(), name='search_story'),
    path("passwordReset", SendPasswordResetEmail.as_view(), name='password_reset'),
    path("passwordReset/<token>/<uidb64>", ResetPassword.as_view(), name='password_reset_token'),
    path('api/swagger', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('storySearchByLocation', SearchStoryByLocationView.as_view(), name='story_search_by_location'),
    path('activities', ActivityStreamView.as_view(), name='activity-stream'),
    path('activities/<int:activity_id>', ActivityStreamView.as_view(), name='activity-detail'),
    path('wikidataSearch', WikidataSearchView.as_view(), name='wikidata_search'),
    path('recommendations', GetRecommendationsView.as_view(), name='get_recommendations'),
    path('recommendationsByUsers', GetRecommendationsByUserView.as_view(), name='get_recommendations'),
    path('updateRecommendationsByUsers', UpdateRecommendationsByUserView.as_view(), name='update_recommendations'),
    path('allStorieswithOwn',AllStorywithOwnView.as_view(), name='stories_by_own'),
    path('keywordExtraction',KeywordExtractionView.as_view(), name='keywords'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
