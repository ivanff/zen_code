from django.core.exceptions import ValidationError
from django.db.models import Count
from rest_framework import serializers
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.validators import UniqueTogetherValidator
from rest_framework.viewsets import ModelViewSet
from sorl.thumbnail import get_thumbnail

from gallery.models import GalleryItem, Comment, Like


class GalleryItemSer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    thumb = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()

    def get_user(self, obj):
        return obj.user.username or obj.email

    def get_thumb(self, obj):
        return get_thumbnail(obj.image, "200x200").url

    def get_like_count(self, obj):
        return obj.like_count

    def get_comment_count(self, obj):
        return obj.comment_count

    class Meta:
        model = GalleryItem
        fields = '__all__'


class GalleryItemViewSet(ModelViewSet):
    queryset = GalleryItem.objects.select_related('user').annotate(
        like_count=Count('like'),
        comment_count=Count('comment')
    )
    serializer_class = GalleryItemSer


class CommentSer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    def get_user(self, obj):
        return obj.user.username or obj.email

    class Meta:
        model = Comment
        fields = "__all__"


class CommentViewSet(ModelViewSet):
    queryset = Comment.objects.select_related('user')
    serializer_class = CommentSer

    def filter_queryset(self, queryset):
        return super().filter_queryset(queryset).filter(gallery_item=self.kwargs['pk'])

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


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

