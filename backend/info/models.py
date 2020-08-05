from django.db import models
from lists.models import Answer


class TokenizedAdress(models.Model):
    """Model definition for TokenizedAdress."""

    answer = models.ForeignKey(Answer, on_delete=models.CASCADE)
    answer_body = models.CharField("Текст из ответа", max_length=250)
    unrestricted_value = models.CharField(
        "Адрес одной строкой (полный, с индексом)", max_length=250)
    postal_code = models.CharField(
        "Индекс", max_length=6, blank=True, null=True)
    region = models.CharField("Регион", max_length=50, blank=True, null=True)
    city = models.CharField("Город", max_length=50, blank=True, null=True)
    street = models.CharField("Улица", max_length=50, blank=True, null=True)
    house = models.CharField("Дом", max_length=50, blank=True, null=True)

    class Meta:
        verbose_name = 'TokenizedAdress'
        verbose_name_plural = 'TokenizedAdresss'

    def __str__(self):
        """Unicode representation of TokenizedAdress."""
        return self.unrestricted_value
