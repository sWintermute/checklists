from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework.views import APIView

from datetime import datetime
from lists.models.response import Response as model_resp

from .utils import create_file


class ExcelView(APIView):
    def get(self, request):
        date_from = request.data.get('date_from', datetime.min)
        date_to = request.data.get('date_to', datetime.max)
        responses = model_resp.objects\
            .prefetch_related('answers', 'answers__question', 'user')\
            .filter(created__date__gt=date_from, created__date__lt=date_to)
        data = create_file(responses)
        filename = 'report.xlsx'
        return HttpResponse(str(data),
                        headers={'Content-Disposition': f'attachment; filename={filename}'},
                        content_type='application/vnd.ms-excel')
