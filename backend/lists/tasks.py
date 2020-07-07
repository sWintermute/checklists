from django.conf import settings
import requests
import json
from . import models


def update_mapnode(answer):
    request_data = json.dumps({"query": answer.body, "count": 1})
    response = get_dadata_suggestion(request_data)

    suggestion = response["suggestions"][0]
    unvalue = suggestion["unrestricted_value"]
    geo_lat = suggestion["data"]["geo_lat"]
    geo_lon = suggestion["data"]["geo_lon"]

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
