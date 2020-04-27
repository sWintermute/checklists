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
        bulk_mgr = BulkCreateManager(chunk_size=100)

        resps = [x for x in Response.objects.filter(
            survey__name="Паспорт дома ДЗД")]

        answers = [x for x in Answer.objects
                   .filter(response__in=resps, question__text="Адрес")]

        for i, answer in enumerate(answers):
            self.stdout.write(self.style.SUCCESS(
                f'{i} {timezone.now()} BEGIN'))
            self.stdout.write(self.style.SUCCESS(
                f'{i} {timezone.now()} Send request'))
            req = json.dumps({"query": answer.body, "count": 1})
            sugg = self.get_sugg(req)
            self.stdout.write(self.style.SUCCESS(
                f'{i} {timezone.now()} Get response'))
            self.stdout.write(self.style.SUCCESS(f'{i} {json.dumps(sugg)}'))
            bulk_mgr.add(MapNode(
                name=sugg["name"],
                lat=sugg["lat"],
                lon=sugg["lon"],
                response=answer.response,
                answer=answer
            ))
            self.stdout.write(self.style.SUCCESS(
                f'{i} {timezone.now()} Object created'))
            self.stdout.write(self.style.SUCCESS(f'{i} {timezone.now()} END'))

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

        res = requests.post(URL,
                            headers=HEADERS,
                            data=request_data,
                            timeout=(1, 1)).json()

        res = {
            'name': res["suggestions"][0]["unrestricted_value"],
            'lat': res["suggestions"][0]["data"]["geo_lat"],
            'lon': res["suggestions"][0]["data"]["geo_lon"]
        }
        return res
