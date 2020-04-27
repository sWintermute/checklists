from django.db import models
from django.urls import reverse
from .response import Response
from .answer import Answer


class MapNode(models.Model):
    name = models.CharField("Имя", max_length=400)
    lat = models.FloatField("Lat")
    lon = models.FloatField("Lon")
    response = models.ForeignKey(
        Response,
        on_delete=models.CASCADE,
        verbose_name="Ответ на чеклист",
        related_name="mapnodes",
    )

    answer = models.ForeignKey(
        Answer,
        on_delete=models.CASCADE,
        verbose_name="Ответ на вопрос",
        related_name="mapnodes",
    )

    class Meta(object):
        verbose_name = "Точка карты"
        verbose_name_plural = "Точки карты"

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("mapnode-detail", kwargs={"id": self.pk})
