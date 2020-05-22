from django.urls import path

from .views import GalleryItemViewSet, CommentViewSet, LikeCreate

urlpatterns = [
    path('<int:pk>/', GalleryItemViewSet.as_view({'get': 'retrieve'})),
    path('list/', GalleryItemViewSet.as_view({'get': 'list'})),
    path('like/', LikeCreate.as_view()),

    path('<int:pk>/comment/list/', CommentViewSet.as_view({'get': 'list'})),
    path('comment/',  CommentViewSet.as_view({'post': 'create'})),
]
