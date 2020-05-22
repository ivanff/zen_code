from django.contrib.auth import get_user_model, logout
from django.contrib.auth.forms import AuthenticationForm
from django.core.exceptions import ValidationError, PermissionDenied
from django.db.models import Count
from django.contrib.auth import login as auth_login

from rest_framework import serializers, status
from rest_framework.decorators import api_view
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from sorl.thumbnail import get_thumbnail

from gallery.forms import RegForm
from gallery.models import GalleryItem, Comment, Like


class GalleryItemSer(serializers.ModelSerializer):
    is_owner = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    thumb = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()

    def get_is_owner(self, obj):
        return obj.user == self.context['request'].user

    def get_user(self, obj):
        return obj.user.username or obj.email

    def get_thumb(self, obj):
        try:
            return get_thumbnail(obj.image, "200x200").url
        except:
            return None

    def get_like_count(self, obj):
        return getattr(obj, 'like_count', 0)

    def get_comment_count(self, obj):
        return getattr(obj, 'comment_count', 0)

    class Meta:
        model = GalleryItem
        fields = '__all__'


class GalleryItemViewSet(ModelViewSet):
    queryset = GalleryItem.objects.select_related('user').annotate(
        like_count=Count('like'),
        comment_count=Count('comment')
    )
    serializer_class = GalleryItemSer
    pagination_class = LimitOffsetPagination

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied
        super().perform_destroy(instance)


class CommentSer(serializers.ModelSerializer):
    is_owner = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    def get_is_owner(self, obj):
        return obj.user == self.context['request'].user

    def get_user(self, obj):
        return obj.user.username or obj.email

    class Meta:
        model = Comment
        fields = "__all__"


class CommentViewSet(ModelViewSet):
    queryset = Comment.objects.select_related('user')
    serializer_class = CommentSer

    def filter_queryset(self, queryset):
        print(
            self.kwargs
        )
        qs = super().filter_queryset(queryset)
        if 'gallery_item_pk' in self.kwargs:
            qs = qs.filter(gallery_item=self.kwargs['gallery_item_pk'])
        return qs

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied
        super().perform_destroy(instance)


class LikeSer(serializers.ModelSerializer):

    def validate(self, attrs):
        if Like.objects.filter(user=self.context['request'].user, gallery_item=attrs['gallery_item']).exists():
            raise ValidationError("Like is exists")
        return attrs

    class Meta:
        model = Like
        exclude = [
            'user'
        ]


class LikeCreate(CreateAPIView):
    serializer_class = LikeSer
    queryset = Like.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserSer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = [
            'email',
            'username'
        ]


class UserRetrieveView(RetrieveAPIView):
    serializer_class = UserSer
    permission_classes = (
        IsAuthenticated,
    )

    def get_object(self):
        return self.request.user


class UserViewSet(ModelViewSet):
    serializer_class = UserSer

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def logout(self, request):
        logout(request)
        return Response({})

    def login(self, request):
        form = AuthenticationForm(request, data=request.data)
        if form.is_valid():
            auth_login(request, form.get_user())
            return self.retrieve(request)
        return Response(form.errors, status=status.HTTP_403_FORBIDDEN)

    def register(self, request):
        form = RegForm(request.data)
        if form.is_valid():
            auth_login(request, form.save())
            return self.retrieve(request)
        return Response(form.errors, status=status.HTTP_403_FORBIDDEN)


@api_view(['POST'])
def upload(request):
    instances = []

    for title, file in zip(
            request.data.getlist('titles'),
            request.FILES.getlist('files')
    ):
        instances.append(
            GalleryItem.objects.create(
                user=request.user,
                title=title,
                image=file
            )
        )
    return Response(GalleryItemSer(instances, many=True, context={'request': request}).data)


upload.permission_classes = (
    IsAuthenticated,
)
