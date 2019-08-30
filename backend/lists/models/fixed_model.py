from django.db import models
from django.db.models.base import ModelBase
from django.db.models.fields import Field
from django.utils import six
from simple_history.models import HistoricalRecords
import os
from django.contrib.auth.models import User
from django.utils import timezone
from django.utils.text import slugify

try:
    from django.conf import settings

    if settings.AUTH_USER_MODEL:
        user_model = settings.AUTH_USER_MODEL
    else:
        user_model = User
except (ImportError, AttributeError):
    user_model = User


def get_time_now():
    return timezone.localtime(timezone.now())


def get_file_path(instance, filename):
    name, ext = os.path.splitext(filename)
    return os.path.join('files', slugify(name, allow_unicode=True) + ext)



class FixedQuerySet(models.query.QuerySet):

    def delete(self):
        return super(FixedQuerySet, self).update(_disabled=get_time_now(), _active=None)

    def delete_hardcore(self):
        return super(FixedQuerySet, self).delete()


class AuthorModel(models.Model):
    """
    Абстрактный класс всех моделей, для которых нужно реализовать логику добавления модератора и времени
    """
    datetime_create = models.DateTimeField('Время добавления', auto_now_add=True)
    datetime_update = models.DateTimeField('Время обновления', auto_now=True)
    author = models.ForeignKey(user_model, verbose_name="Автор",
                               related_name='author_%(class)s',
                               blank=True,
                               null=True,
                               on_delete=models.SET_NULL)

    author_updated = models.ForeignKey(user_model,
                                       verbose_name="Редактор",
                                       related_name='author_updated_%(class)s',
                                       blank=True,
                                       null=True,
                                       on_delete=models.SET_NULL)

    class Meta:
        abstract = True


class ActualManager(models.Manager):
    """
    Менеджер, работающий только с активными объектами
    """

    def get_queryset(self):
        return FixedQuerySet(model=self.model, using=self._db, hints=self._hints).filter(
            _enabled__lte=get_time_now(),
            _disabled__isnull=True
        )


class FixedManager(models.Manager):
    def get_queryset(self):
        return FixedQuerySet(model=self.model, using=self._db, hints=self._hints)


class FixedModel(AuthorModel):
    """
    Абстрактный класс всех моделей, для которых нужно реализовать логику неудаления и поиска по дате
    """
    _enabled = models.DateTimeField('Время активизации', blank=True, null=True, editable=False)
    _disabled = models.DateTimeField('Время отключения', blank=True, null=True, editable=False)
    _active = models.SmallIntegerField('Активен', default=True, blank=True, null=True, editable=False)
    history = HistoricalRecords(verbose_name='История Изменений', inherit=True)

    def __str__(self):
        return f'{self.__class__.__name__}: {self.pk}'

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if not self._enabled:
            self._enabled = get_time_now()
        super(FixedModel, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """
        Замороженные объекты не удаляются, а переходят в невидимый статус
        :param args:
        :param kwargs:
        :return:
        """
        self.disable()

    def delete_hardcore(self):
        return super(FixedModel, self).delete()

    def disable(self, dt=None):
        self._disabled = dt or get_time_now()
        self._active = None
        super(FixedModel, self).save()

    objects = ActualManager()
    fixeds = FixedManager()


class FixedModelMeta(ModelBase):
    def __new__(mcs, name, bases, attrs):
        if name != 'FixedModelRelated':
            # собираем атрибуты объекта
            uniq = [attr_name for attr_name, attr in six.iteritems(attrs) if isinstance(attr, Field)]
            # создаем мета-объект с объявлением уник. атрибутов
            meta = type('', (), {})()
            meta.unique_together = uniq + ['_active']
            attrs['Meta'] = meta

        return super(FixedModelMeta, mcs).__new__(mcs, name, bases, attrs)


class FixedModelRelated(six.with_metaclass(FixedModelMeta, FixedModel)):
    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        """
        Зависимость может быть либо создана, либо удалена
        """
        # если это изменение зависимости - "удаляем" ее и создаем новую
        if self.pk:
            obj = self.__class__.objects.get(pk=self.pk)
            obj.delete()

            self.pk = None
            self._enabled = get_time_now()

        super(FixedModelRelated, self).save(*args, **kwargs)
