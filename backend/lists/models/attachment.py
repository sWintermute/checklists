import os

from django.contrib.contenttypes import fields
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.utils.text import slugify


def get_file_path(instance, filename):
    name, ext = os.path.splitext(filename)
    return os.path.join('files', slugify(name, allow_unicode=True) + ext)


class Attachment(models.Model):
    file = models.FileField('Файл', upload_to=get_file_path)
    name = models.CharField('Название', max_length=255, blank=True, null=True)
    description = models.CharField("Описание", max_length=255, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    content_type = models.ForeignKey(ContentType, verbose_name="Тип", on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField("ID")
    content_object = fields.GenericForeignKey('content_type', 'object_id')

    class Meta:
        verbose_name = "вложение"
        verbose_name_plural = "вложения"

    def __str__(self):
        return self.name or self.file.name
