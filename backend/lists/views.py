from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, CreateModelMixin, UpdateModelMixin, \
    DestroyModelMixin
from rest_framework.permissions import IsAdminUser
from rest_framework.viewsets import GenericViewSet

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


class ReportViewset(GenericViewSet, CreateModelMixin, RetrieveModelMixin, ListModelMixin, DestroyModelMixin):
    queryset = models.Report.objects.all()
    serializer_class = serializers.ReportSerializer
    permission_classes = (IsAdminUser,)


class ResponseViewset(GenericViewSet, CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin):
    answers = models.Answer.objects.all()
    queryset = models.Response.objects.all()
    serializer_class = serializers.ResponseSerializer


class UserViewset(GenericViewSet, ListModelMixin):
    queryset = umodels.UserProfile.objects.all()
    serializer_class = serializers.UserSerializer

    def get_object(self):
        pk = self.kwargs.get('pk')

        if pk == "current":
            return self.request.user

        return super(UserViewset, self).get_object()
