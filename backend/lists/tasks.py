from django.core.mail import send_mail
from django.conf import settings
import requests
import json
from . import models


def send_email(title, message, dest_email):
    return send_mail(title, message,
                     settings.DEFAULT_FROM_EMAIL,
                     [dest_email])


def create_mapnode(answer):
    request_data = json.dumps({"query": answer.body, "count": 1})
    response = get_dadata_suggestion(request_data)

    models.MapNode.objects.create(
        name=response["suggestions"][0]["unrestricted_value"],
        lat=response["suggestions"][0]["data"]["geo_lat"],
        lon=response["suggestions"][0]["data"]["geo_lon"],
        response=answer.response,
        answer=answer
    )


def update_mapnode(answer):
    nodes = [x for x in models.MapNode.objects.filter(answer=answer)]
    if nodes:
        request_data = json.dumps({"query": answer.body, "count": 1})
        response = get_dadata_suggestion(request_data)
        for node in nodes:
            node.name = response["suggestions"][0]["unrestricted_value"]
            node.lat = response["suggestions"][0]["data"]["geo_lat"]
            node.lon = response["suggestions"][0]["data"]["geo_lon"]
            node.save()
    else:
        return create_mapnode(answer)


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
