# -*- coding: utf-8 -*-

from django.db import models
from django.urls import reverse


class Survey(models.Model):
    name = models.CharField("Имя", max_length=400)
    description = models.TextField("Описание", blank=True, null=True)

    class Meta(object):
        verbose_name = "чеклист"
        verbose_name_plural = "чеклисты"

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("survey-detail", kwargs={"id": self.pk})
