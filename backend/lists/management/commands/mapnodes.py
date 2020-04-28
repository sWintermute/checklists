from django.core.management.base import BaseCommand
from ...models import Response, Answer, MapNode
from ...BulkCreateManager import BulkCreateManager
from django.utils import timezone
from functools import lru_cache
import requests
import json


class Command(BaseCommand):
    help = 'Генерация MapNodes'

    def handle(self, *args, **options):
        begin_time = timezone.now()
        self.stdout.write(self.style.SUCCESS(f'BEGIN ALL: {begin_time}'))
        MapNode.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f'Cleaned: {begin_time}'))
        bulk_mgr = BulkCreateManager(chunk_size=100)

        resps = [x for x in Response.objects.filter(
            survey__name="Паспорт дома ДЗД")]

        answers = [x for x in Answer.objects
                   .filter(response__in=resps, question__text="Адрес")]

        for i, answer in enumerate(answers):
            req = json.dumps({"query": answer.body, "count": 1})
            self.stdout.write(self.style.SUCCESS(
                f'{i} {timezone.now()} Send request'))

            sugg = self.get_sugg(req)
            self.stdout.write(self.style.SUCCESS(
                f'{i} {timezone.now()} Get response'))

            bulk_mgr.add(MapNode(
                name=sugg["suggestions"][0]["unrestricted_value"],
                lat=sugg["suggestions"][0]["data"]["geo_lat"],
                lon=sugg["suggestions"][0]["data"]["geo_lon"],
                response=answer.response,
                answer=answer
            ))
            self.stdout.write(self.style.SUCCESS(
                f'{i} {timezone.now()} Object created'))

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
            'Authorization': 'Token 519fbd1afac8c2380f617046c95a6789a39fa021'
        }

        return requests.post(URL,
                             headers=HEADERS,
                             data=request_data).json()
