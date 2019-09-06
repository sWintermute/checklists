from django.shortcuts import get_object_or_404
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, CreateModelMixin, UpdateModelMixin, \
    DestroyModelMixin
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from user_profile import models as umodels
from . import models, serializers


class SurveyListViewset(GenericViewSet, ListModelMixin):
    queryset = models.Survey.objects.all()
    serializer_class = serializers.SurveyListSerializer


class ResponseListViewset(GenericViewSet, ListModelMixin):
    queryset = models.Response.objects.all()
    serializer_class = serializers.ResponseListSerializer

    def get_queryset(self):
        """
        This view should return a list of all the purchases
        for the currently authenticated user.
        """
        return models.Response.objects.filter(user=self.request.user)


class SurveyViewset(GenericViewSet, RetrieveModelMixin):
    questions = models.Question.objects.all()
    queryset = models.Survey.objects.all()
    serializer_class = serializers.SurveySerializer


class ResponseViewset(GenericViewSet, CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin):
    answers = models.Answer.objects.all()
    queryset = models.Response.objects.all()
    serializer_class = serializers.ResponseSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.update(user=self.request.user)

    def get_queryset(self):
        """
        This view should return a list of all the purchases
        for the currently authenticated user.
        """
        return models.Response.objects.filter(user=self.request.user)


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


# Report viewasets
class ReportListViewset(GenericViewSet, ListModelMixin, CreateModelMixin, DestroyModelMixin):
    queryset = models.Report.objects.all()
    serializer_class = serializers.ReportSerializer
    permission_classes = (IsAdminUser,)


class ReportViewset(GenericViewSet, RetrieveModelMixin):
    queryset = models.Report.objects.all()
    serializer_class = serializers.ReportGetEntitySerializer
    permission_classes = (IsAdminUser,)

    # def get_object(self):
    #     queryset = self.get_queryset()
    #     qfilter = {}
    #
    #     qfilter['pk'] = self.lookup_field
    #
    #     obj = get_object_or_404(queryset, **qfilter)
    #     obj.responses = models.Response.objects.all()
    #     return obj
