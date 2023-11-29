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
    path('register', UserRegistrationView.as_view(), name="register"),
    path('login', UserLoginView.as_view(),name="login"),
    path('user', AuthUserAPIView.as_view()),
    path('refresh', RefreshUserAuthAPIView.as_view()),
    path('logout', LogoutAPIView.as_view(),name="logout"),
    path('storyCreate',CreateStoryView.as_view(),name="createStory"),
    path('storyUpdate/<int:pk>', UpdateStoryView.as_view(),name="storyUpdate"),
    path('like/<int:pk>',LikeStoryView.as_view()),
    path('storyGet/<int:pk>', StoryDetailView.as_view()),
    path('storyGetbyAuthor/<int:user_id>', StoryAuthorView.as_view()),
    path('comment/<int:story_id>', CreateCommentView.as_view(), name='create_comment'),
    path('commentsByStory/<int:id>',StoryCommentsView.as_view()),
    path('followByUser/<int:id>',FollowUserView.as_view()),
    path('userFollowers',UserFollowersView.as_view()),
    path('userFollowers/<int:user_id>',UserFollowersView.as_view()),
    path('userStories',StoryAuthorView.as_view()),
    path('userStories/<int:user_id>',StoryAuthorView.as_view()),
    path('allStories',AllStoryView.as_view()),
    # path('usernamesbyId',UsernamesByIDsView.as_view()), #unused
    path('biography',UserBiographyView.as_view()),
    path('userDetails',UserDetailsView.as_view()),
    path('userDetails/<int:user_id>',UserDetailsView.as_view()),
    path('profilePhoto',UserPhotoView.as_view()),
    path('profilePhoto/<int:user_id>',UserPhotoView.as_view()),
    # path('storyPhoto/<int:story_id>',StoryPhotosView.as_view()), #unused
    # path('storyPhotoOps/<int:story_id>',AddStoryPhotoView.as_view()), #unused
    # path('storyPhotoOps/<int:story_id>/<int:photo_id>',AddStoryPhotoView.as_view()), #unused
    path('searchUser', SearchUserView.as_view()),
    path('storySearch', SearchStoryView.as_view()),
    path("passwordReset", SendPasswordResetEmail.as_view()),
    path("passwordReset/<token>/<uidb64>", ResetPassword.as_view()),
    path('api/swagger', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('storySearchByLocation', SearchStoryByLocationView.as_view()),
    path('activities', ActivityStreamView.as_view(), name='activity-stream'),
    path('activities/<int:activity_id>', ActivityStreamView.as_view(), name='activity-detail'),
    path('wikidataSearch', WikidataSearchView.as_view(), name='wikidata_search'),



]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
