import time
from django.core.management.base import BaseCommand
from ...models import TokenizedAdress
from lists.models import Response, Answer
from lists.BulkCreateManager import BulkCreateManager
from django.utils import timezone
from functools import lru_cache
import requests
import json
from django.conf import settings


class Command(BaseCommand):
    help = 'Токенизация адресов из ответов'

    def handle(self, *args, **options):
        begin_time = timezone.now()
        self.stdout.write(self.style.SUCCESS(f'BEGIN ALL: {begin_time}'))
        TokenizedAdress.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f'Cleaned: {begin_time}'))
        bulk_mgr = BulkCreateManager(chunk_size=100)

        resps = [x for x in Response.objects.filter(
            survey__name="Паспорт дома ДЗД")]

        answers = [x for x in Answer.objects
                   .filter(response__in=resps, question__text="Адрес")]
        try:

            for i, answer in enumerate(answers):
                req = json.dumps({"query": answer.body, "count": 1})
                self.stdout.write(self.style.SUCCESS(
                    f'{i} {timezone.now()} Send request'))

                sugg = self.get_sugg(req)
                self.stdout.write(self.style.SUCCESS(
                    f'{i} {timezone.now()} Get response'))

                try:
                    bulk_mgr.add(TokenizedAdress(
                        answer=answer,
                        answer_body=answer.body,
                        unrestricted_value=sugg["suggestions"][0]["unrestricted_value"],
                        postal_code=sugg["suggestions"][0]["data"]["postal_code"],
                        region=sugg["suggestions"][0]["data"]["region"],
                        city=sugg["suggestions"][0]["data"]["city"],
                        street=sugg["suggestions"][0]["data"]["street"],
                        house=sugg["suggestions"][0]["data"]["house"]
                    ))
                    self.stdout.write(self.style.SUCCESS(
                        f'{i} {timezone.now()} Object created'))
                except Exception:
                    self.stdout.write(self.style.SUCCESS(
                        f'{i} {sugg}'))
                time.sleep(1)
        finally:
            bulk_mgr.done()
            end_time = timezone.now()
            self.stdout.write(self.style.SUCCESS(f'END ALL: {end_time}'))
            self.stdout.write(self.style.SUCCESS(
                f'ESTIMATED: {end_time - begin_time}'))

    @lru_cache
    def get_sugg(self, request_data):
        URL = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'
        HEADERS = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': f'Token {settings.DADATA_KEY}'
        }

        return requests.post(URL,
                             headers=HEADERS,
                             data=request_data).json()
