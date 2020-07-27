from django.http import HttpResponse
from rest_framework.views import APIView

from datetime import datetime
from lists.models.response import Response
from lists.models.question import Question

from .utils import create_file


class ExcelView(APIView):
    def get(self, request):
        date_from = request.GET.get('from', '0001-01-01T00:00:00')
        date_to = request.GET.get('to', '9999-12-31T23:59:59')
        date_from =datetime.strptime(date_from, '%Y-%m-%dT%H:%M:%S')
        date_to = datetime.strptime(date_to, '%Y-%m-%dT%H:%M:%S')
        survey = request.GET.get('lists')
        questions = Question.objects.filter(survey=survey)
        responses = Response.objects\
            .prefetch_related('answers', 'answers__question',
                              'user', 'survey')\
            .filter(survey=survey, created__date__gt=date_from,
                    created__date__lt=date_to)
        data = create_file(responses, questions,
                           request.build_absolute_uri('/response/'))
        filename = 'report.xlsx'
        response = HttpResponse(data,
                                content_type='application/vnd.ms-excel')
        response['Content-Disposition'] = f'attachment; filename={filename}'
        return response
