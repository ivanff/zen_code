from django.urls import path

from .views import GalleryItemViewSet, CommentViewSet, LikeCreate, UserViewSet, UserRetrieveView, upload

urlpatterns = [
    path('user/', UserRetrieveView.as_view()),
    path('user/logout/', UserViewSet.as_view({'get': 'logout'})),
    path('user/login/', UserViewSet.as_view({'post': 'login'})),
    path('user/reg/', UserViewSet.as_view({'post': 'register'})),

    path('<int:pk>/', GalleryItemViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'})),
    path('list/', GalleryItemViewSet.as_view({'get': 'list'})),

    path('like/', LikeCreate.as_view()),

    path('<int:gallery_item_pk>/comment/list/', CommentViewSet.as_view({'get': 'list'})),
    path('<int:gallery_item_pk>/comment/<int:pk>/', CommentViewSet.as_view({'delete': 'destroy'})),
    path('comment/',  CommentViewSet.as_view({'post': 'create'})),

    path('upload/',  upload),
]
