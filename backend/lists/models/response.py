from django.contrib.auth.models import User
from django.db import models
from django.contrib.contenttypes import fields

from .attachment import Attachment
from .survey import Survey
from django_q.tasks import async_task
from notifications import tasks


try:
    from django.conf import settings

    if settings.AUTH_USER_MODEL:
        user_model = settings.AUTH_USER_MODEL
    else:
        user_model = User
except (ImportError, AttributeError):
    user_model = User


class Response(models.Model):
    """
        A Response object is a collection of questions and answers.
    """

    created = models.DateTimeField("Creation date", auto_now_add=True)
    updated = models.DateTimeField("Update date", auto_now=True)
    survey = models.ForeignKey(
        Survey,
        on_delete=models.CASCADE,
        verbose_name="Survey",
        related_name="responses",
    )
    user = models.ForeignKey(
        user_model,
        on_delete=models.SET_NULL,
        verbose_name="User",
        null=True,
        blank=True,
    )

    photo = fields.GenericRelation(Attachment)

    class Meta(object):
        verbose_name = "Ответ на чеклист"
        verbose_name_plural = "Ответы на чеклисты"

    def __str__(self):
        msg = "Response to {} by {}".format(self.survey, self.user)
        msg += " on {}".format(self.created)
        return msg

    def save(self,
             force_insert=False,
             force_update=False,
             using=None,
             update_fields=None):

        res = super().save(force_insert=force_insert,
                           force_update=force_update,
                           using=using,
                           update_fields=update_fields)

        async_task(tasks.basic_report, self)
        return res
