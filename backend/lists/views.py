from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, CreateModelMixin
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from lists.models import Question
from . import models, serializers


class SurveyViewset(GenericViewSet, RetrieveModelMixin, ListModelMixin):
    questions = Question.objects.all()
    queryset = models.Survey.objects.all()
    serializer_class = serializers.SurveyListSerializer

    def list(self, request):
        queryset = models.Survey.objects.all()
        serializer = serializers.SurveyListSerializer(queryset, many=True)
        return Response(data=serializer.data)


class ReportViewset(GenericViewSet, CreateModelMixin, RetrieveModelMixin, ListModelMixin):
    queryset = models.Report.objects.all()
    serializer_class = serializers.ReportSerializer


class ResponseViewset(ModelViewSet):
    queryset = models.Response.objects.all()
    serializer_class = serializers.ResponseSerializer
