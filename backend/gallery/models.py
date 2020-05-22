from django.contrib.auth import get_user_model
from django.db import models
from sorl.thumbnail import ImageField


class GalleryItem(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.PROTECT)
    title = models.CharField(max_length=250)
    image = ImageField(upload_to='gallery/')


class Like(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.PROTECT)
    gallery_item = models.ForeignKey(GalleryItem, on_delete=models.PROTECT)

    class Meta:
        unique_together = [('user', 'gallery_item')]


class Comment(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.PROTECT)
    gallery_item = models.ForeignKey(GalleryItem, on_delete=models.PROTECT)
    content = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
