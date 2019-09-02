from django.db import models


class Report(models.Model):
    class Meta:
        verbose_name = "Отчет"
        verbose_name_plural = "Отчеты"

    name = models.CharField("Название", max_length=50)
    date_from = models.DateTimeField("Начало отсчета")
    date_to = models.DateTimeField("Конец отсчета")

    checklists = models.ManyToManyField('Survey', verbose_name="Чеклисты")

    def __str__(self):
        return self.name
