from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

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
    path('comment/<int:id>',CreateCommentView.as_view(),name="comment"),
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
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
