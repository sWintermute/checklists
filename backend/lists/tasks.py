from django.conf import settings
import requests
import json
from . import models
from info.models import TokenizedAdress


def update_mapnode(answer):
    request_data = json.dumps({"query": answer.body, "count": 1})
    response = get_dadata_suggestion(request_data)

    try:
        suggestion = response["suggestions"][0]

        if suggestion["unrestricted_value"] in (None, ''):
            raise Exception
        unvalue = suggestion["unrestricted_value"]

        if suggestion["data"]["geo_lat"] in (None, ''):
            raise Exception
        geo_lat = suggestion["data"]["geo_lat"]

        if suggestion["data"]["geo_lon"] in (None, ''):
            raise Exception
        geo_lon = suggestion["data"]["geo_lon"]

        postal_code = suggestion["data"]["postal_code"],
        region = suggestion["data"]["region"],
        city = suggestion["data"]["city"],
        street = suggestion["data"]["street"],
        house = suggestion["data"]["house"]
    except Exception as e:
        raise Exception(
            f"\nRequest query:\n{answer.body}\n\n--- --- ---\n\nResponse:\n{response}").with_traceback(e.__traceback__)
    else:
        nodes = [x for x in models.MapNode.objects.filter(answer=answer)]
        if nodes:
            for node in nodes:
                node.name = unvalue
                node.lat = geo_lat
                node.lon = geo_lon
                node.save()
        else:
            models.MapNode.objects.create(
                name=unvalue,
                lat=geo_lat,
                lon=geo_lon,
                response=answer.response,
                answer=answer
            )

        # nodes = [x for x in TokenizedAdress.objects.filter(answer=answer)]
        # if nodes:
        #     for node in nodes:
        #         # node.answer = answer
        #         # node.answer_body = answer.body
        #         node.unrestricted_value = unvalue
        #         node.postal_code = postal_code
        #         node.region = region
        #         node.city = city
        #         node.street = street
        #         node.house = house
        #         node.save()
        # else:
        TokenizedAdress.objects.create(
            # answer=answer,
            # answer_body=answer.body,
            unrestricted_value=unvalue,
            postal_code=postal_code,
            region=region,
            city=city,
            street=street,
            house=house
        )


def get_dadata_suggestion(request_data):
    URL = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'
    HEADERS = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': f'Token {settings.DADATA_KEY}'
    }

    return requests.post(URL,
                         headers=HEADERS,
                         data=request_data).json()
