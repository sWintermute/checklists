from django.http import HttpResponse
from rest_framework.views import APIView

from datetime import datetime
from lists.models.response import Response
from lists.models.question import Question

from .utils import create_file


class ExcelView(APIView):
    def get(self, request):
        date_from = request.GET.get('date_from', datetime.min)
        date_to = request.GET.get('date_to', datetime.max)
        survey = request.GET.get('lists')
        questions = Question.objects.filter(survey=survey)
        responses = Response.objects\
            .prefetch_related('answers', 'answers__question',
                              'user', 'survey')\
            .filter(survey=survey, created__date__gt=date_from,
                    created__date__lt=date_to)
        data = create_file(responses, questions)
        filename = 'report.xlsx'
        response = HttpResponse(data,
                                content_type='application/vnd.ms-excel')
        response['Content-Disposition'] = f'attachment; filename={filename}'
        return response
