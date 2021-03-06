from django.contrib.auth import get_user_model
from django.db import models
from sorl.thumbnail import ImageField


class GalleryItem(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    title = models.CharField(max_length=250, blank=True, default="")
    image = ImageField(upload_to='gallery/')
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created',)


class Like(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    gallery_item = models.ForeignKey(GalleryItem, on_delete=models.CASCADE)

    class Meta:
        unique_together = [('user', 'gallery_item')]


class Comment(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    gallery_item = models.ForeignKey(GalleryItem, on_delete=models.CASCADE)
    content = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-created',)
