from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, CreateModelMixin, UpdateModelMixin, \
    DestroyModelMixin
from rest_framework.viewsets import GenericViewSet

from . import models, serializers


class SurveyListViewset(GenericViewSet, ListModelMixin):
    queryset = models.Survey.objects.all()
    serializer_class = serializers.SurveyListSerializer


class ResponseListViewset(ListModelMixin, GenericViewSet):
    queryset = models.Response.objects.all()
    serializer_class = serializers.ResponseListSerializer


class SurveyViewset(GenericViewSet, RetrieveModelMixin):
    questions = models.Question.objects.all()
    queryset = models.Survey.objects.all()
    serializer_class = serializers.SurveySerializer


class ReportViewset(GenericViewSet, CreateModelMixin, RetrieveModelMixin, ListModelMixin, DestroyModelMixin):
    queryset = models.Report.objects.all()
    serializer_class = serializers.ReportSerializer


class ResponseViewset(GenericViewSet, CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin):
    answers = models.Answer.objects.all()
    queryset = models.Response.objects.all()
    serializer_class = serializers.ResponseSerializer
