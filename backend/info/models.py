from django.db import models
from lists.models import Answer


class TokenizedAdress(models.Model):
    """Model definition for TokenizedAdress."""

    answer = models.ForeignKey(Answer, on_delete=models.CASCADE)
    unrestricted_value = models.CharField(
        "Адрес одной строкой (полный, с индексом)", max_length=250)
    postal_code = models.CharField("Индекс", max_length=6)
    region = models.CharField("Регион", max_length=50)
    city = models.CharField("Город", max_length=50)
    street = models.CharField("Улица", max_length=50)
    house = models.CharField("Дом", max_length=50)

    class Meta:
        verbose_name = 'TokenizedAdress'
        verbose_name_plural = 'TokenizedAdresss'

    def __str__(self):
        """Unicode representation of TokenizedAdress."""
        return self.unrestricted_value
