from django.contrib import admin

from .models import *


class BaseAdmin(admin.ModelAdmin):
    save_on_top = True


@admin.register(GalleryItem)
class GalleryItemAdmin(BaseAdmin):
    pass


@admin.register(Like)
class LikeAdmin(BaseAdmin):
    pass


@admin.register(Comment)
class CommentAdmin(BaseAdmin):
    pass
