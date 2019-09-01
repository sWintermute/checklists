from rest_framework import viewsets
from rest_framework.response import Response

from lists.models import Question
from . import models, serializers


class FriendViewset(viewsets.ModelViewSet):
    questions = Question.objects.all()
    queryset = models.Survey.objects.all()
    serializer_class = serializers.SurveySerializer

    def list(self, request):
        score = request.GET.get('score', None)
        queryset = models.Survey.objects.all()
        if score:
            queryset = queryset.filter(score__gte=score)
        serializer = serializers.SurveySerializer(queryset, many=True)
        return Response(data=serializer.data)
