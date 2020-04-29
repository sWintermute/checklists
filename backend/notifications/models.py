from django.db import models

from lists.models import Survey
from user_profile.models import UserProfile


class Subscription(models.Model):
    class Meta:
        verbose_name = "Подписка"
        verbose_name_plural = "Подписки"

    name = models.CharField("Название", max_length=50)
    checklists = models.ManyToManyField(Survey, verbose_name='Чеклисты')
    users = models.ManyToManyField(UserProfile, verbose_name='Пользователи')

    TYPE_EMAIL = 0
    TYPE_PUSH = 1

    TYPES = [
        (TYPE_EMAIL, 'E-mail'),
        (TYPE_PUSH, 'Push'),
    ]

    notification_type = models.IntegerField(verbose_name='Тип уведомления',
                                            choices=TYPES, default=TYPE_EMAIL)

    def __str__(self):
        return self.name
