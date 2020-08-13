from django.db import models
from lists.models.response import Response


class TokenizedAdress(models.Model):
    """Model definition for TokenizedAdress."""

    response = models.ForeignKey(Response,
                                 on_delete=models.CASCADE,
                                 default=434)
    unrestricted_value = models.CharField(
        "Адрес одной строкой (полный, с индексом)", max_length=250)
    postal_code = models.CharField(
        "Индекс", max_length=50, blank=True, null=True)
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
