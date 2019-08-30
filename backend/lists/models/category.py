# -*- coding: utf-8 -*-

from django.db import models
from django.utils.text import slugify

from .survey import Survey


class Category(models.Model):
    name = models.CharField("Name", max_length=400)
    survey = models.ForeignKey(
        Survey,
        on_delete=models.CASCADE,
        verbose_name="Survey",
        related_name="categories",
    )
    order = models.IntegerField("Display order", blank=True, null=True)
    description = models.CharField(
        "Description", max_length=2000, blank=True, null=True
    )

    class Meta(object):
        # pylint: disable=too-few-public-methods
        verbose_name = "category"
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name

    def slugify(self):
        return slugify(str(self))
