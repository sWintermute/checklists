import json
from .serializers import AddressResultSerializer, AddressSerializer
from .models import TokenizedAdress
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
import requests
from django.conf import settings


class AddressViewSet(viewsets.ViewSet):
    @action(detail=False)
    @swagger_auto_schema(
        query_serializer=AddressSerializer,
        responses={
            200: AddressResultSerializer()
        })
    def getState(self, request):
        URL = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'
        HEADERS = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': f'Token {settings.DADATA_KEY}'
        }
        try:
            rq = request.query_params['address']
            req = json.dumps({"query": rq, "count": 1})
            js_res = requests.post(URL, headers=HEADERS, data=req).json()
            print(js_res)
            un_value = js_res["suggestions"][0]["unrestricted_value"]

            vs = [x for x in TokenizedAdress.objects.all()
                  .filter(unrestricted_value=un_value)]
        except:
            vs = []
        finally:
            res = {}
            res["state"] = False
            if len(vs):
                res["state"] = True

        serializer = AddressResultSerializer(res, many=False)
        return Response(serializer.data)
