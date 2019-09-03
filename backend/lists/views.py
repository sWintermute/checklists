from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, CreateModelMixin
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from lists.models import Question
from . import models, serializers


class SurveyListViewset(GenericViewSet, ListModelMixin):
    queryset = models.Survey.objects.all()
    serializer_class = serializers.SurveyListSerializer


class SurveyViewset(GenericViewSet, RetrieveModelMixin):
    questions = Question.objects.all()
    queryset = models.Survey.objects.all()
    serializer_class = serializers.SurveySerializer


class ReportViewset(GenericViewSet, CreateModelMixin, RetrieveModelMixin, ListModelMixin):
    queryset = models.Report.objects.all()
    serializer_class = serializers.ReportSerializer


class ResponseViewset(ModelViewSet):
    queryset = models.Response.objects.all()
    serializer_class = serializers.ResponseSerializer
