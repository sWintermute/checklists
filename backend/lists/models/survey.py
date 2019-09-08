# -*- coding: utf-8 -*-

from django.db import models
from django.urls import reverse


class Survey(models.Model):
    name = models.CharField("Имя", max_length=400)
    description = models.TextField("Описание", blank=True, null=True)
    is_published = models.BooleanField("Users can see it and answer it", default=True, editable=False)
    need_logged_user = models.BooleanField(
        "Only authenticated users can see it and answer it", default=True, editable=False
    )
    display_by_question = models.BooleanField("Display by question", default=False, editable=False)
    template = models.CharField("Template", max_length=255, null=True, blank=True, editable=False)

    class Meta(object):
        verbose_name = "чеклист"
        verbose_name_plural = "чеклисты"

    def __str__(self):
        return self.name

    def latest_answer_date(self):
        """ Return the latest answer date.

        Return None is there is no response. """
        min_ = None
        for response in self.responses.all():
            if min_ is None or min_ < response.updated:
                min_ = response.updated
        return min_

    def get_absolute_url(self):
        return reverse("survey-detail", kwargs={"id": self.pk})
