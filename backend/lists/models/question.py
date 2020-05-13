# -*- coding: utf-8 -*-

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify

from .survey import Survey

try:  # pragma: no cover
    from _collections import OrderedDict
except ImportError:  # pragma: no cover
    from ordereddict import OrderedDict

CHOICES_HELP_TEXT = """The choices field is only used if the question type
if the question type is 'radio', 'select', or
'select multiple' provide a comma-separated list of
options for this question ."""


def validate_choices(choices):
    """  Verifies that there is at least two choices in choices
    :param String choices: The string representing the user choices.
    """
    values = choices.split(settings.CHOICES_SEPARATOR)
    empty = 0
    for value in values:
        if value.replace(" ", "") == "":
            empty += 1
    if len(values) < 2 + empty:
        msg = "The selected field requires an associated list of choices."
        msg += " Choices must contain more than one item."
        raise ValidationError(msg)


class Question(models.Model):
    TEXT = "textarea"
    SHORT_TEXT = "text"
    RADIO = "radio"
    SELECT = "select"
    SELECT_IMAGE = "select-image"
    SELECT_MULTIPLE = "select-multiple"
    INTEGER = "integer"
    AUTOCOMPLETE_ADDRESS = 'address-autocomplete'
    PHONE_NUMBER = 'phone-number'

    QUESTION_TYPES = (
        (TEXT, "Многострочный текст"),
        (SHORT_TEXT, "Однострочный текст"),
        (RADIO, "Выбор одного варианта"),
        (SELECT, "Выпадающий список вариантов"),
        (SELECT_MULTIPLE, "Выбор нескольких вариантов"),
        (SELECT_IMAGE, "Изображение"),
        (INTEGER, "Целое"),
        (AUTOCOMPLETE_ADDRESS, "Адрес (с автодополнением)"),
        (PHONE_NUMBER, "Номер телефона"),
    )

    text = models.TextField("Текст")
    order = models.IntegerField("Номер")
    required = models.BooleanField("Обязателен?")
    is_key = models.BooleanField("Ключевой?")

    survey = models.ForeignKey(
        Survey,
        on_delete=models.CASCADE,
        verbose_name="Survey",
        related_name="questions",
    )
    type = models.CharField(
        "Тип", max_length=200, choices=QUESTION_TYPES, default=TEXT
    )
    choices = models.TextField(
        "Варианты ответа", blank=True, null=True, help_text=CHOICES_HELP_TEXT
    )
    key_choices = models.TextField(
        "Варианты ответа для попадания в отчет", blank=True, null=True)

    class Meta(object):
        verbose_name = "Вопрос"
        verbose_name_plural = "Вопросы"
        # ordering = ("survey", "order")

    def save(self, *args, **kwargs):
        if self.type in [Question.RADIO, Question.SELECT, Question.SELECT_MULTIPLE]:
            validate_choices(self.choices)
        super(Question, self).save(*args, **kwargs)

    def get_clean_choices(self):
        """ Return split and stripped list of choices with no null values. """
        if self.choices is None:
            return []
        choices_list = []
        for choice in self.choices.split(settings.CHOICES_SEPARATOR):
            choice = choice.strip()
            if choice:
                choices_list.append(choice)
        return choices_list

    @staticmethod
    def standardize(value, group_by_letter_case=None, group_by_slugify=None):
        """ Standardize a value in order to group by slugify or letter case """
        if group_by_slugify:
            value = slugify(value)
        if group_by_letter_case:
            value = value.lower()
        return value

    @staticmethod
    def standardize_list(string_list, group_by_letter_case=None, group_by_slugify=None):
        """ Return a list of standardized string from a csv string.."""
        return [
            Question.standardize(strng, group_by_letter_case, group_by_slugify)
            for strng in string_list
        ]

    def get_choices(self):
        """
        Parse the choices field and return a tuple formatted appropriately
        for the 'choices' argument of a form widget.
        """
        choices_list = []
        for choice in self.get_clean_choices():
            choices_list.append((slugify(choice, allow_unicode=True), choice))
        choices_tuple = tuple(choices_list)
        return choices_tuple

    def __str__(self):
        return self.text
