from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, CreateModelMixin, UpdateModelMixin, \
    DestroyModelMixin
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from user_profile import models as umodels
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


class ReportListViewset(GenericViewSet, ListModelMixin):
    queryset = models.Report.objects.all()
    serializer_class = serializers.ReportSerializer
    permission_classes = (IsAdminUser,)


class ReportViewset(GenericViewSet, CreateModelMixin, RetrieveModelMixin, DestroyModelMixin):
    queryset = models.Report.objects.all()
    serializer_class = serializers.ReportGetSerializer
    permission_classes = (IsAdminUser,)


class ResponseViewset(GenericViewSet, CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin):
    answers = models.Answer.objects.all()
    queryset = models.Response.objects.all()
    serializer_class = serializers.ResponseSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserViewset(GenericViewSet, ListModelMixin):
    queryset = umodels.UserProfile.objects.all()
    model = umodels.UserProfile
    serializer_class = serializers.UserSerializer

    def get_object(self):
        return self.request.user

    def list(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
