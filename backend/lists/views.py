from rest_framework.mixins import ListModelMixin, RetrieveModelMixin, \
    CreateModelMixin, UpdateModelMixin, DestroyModelMixin
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.pagination import PageNumberPagination

from . import models, serializers
from datetime import datetime


class SurveyListViewset(GenericViewSet, ListModelMixin):
    queryset = models.Survey.objects.all()
    serializer_class = serializers.SurveyListSerializer


class ResponseListViewset(GenericViewSet, ListModelMixin):
    queryset = models.Response.objects.prefetch_related(
        'answers', 'answers__question', 'user').all()
    serializer_class = serializers.ResponseListSerializer

    def list(self, request, *args, **kwargs):
        self.pagination_class = PageNumberPagination
        self.page_size = 5
        self.pagination_class.page_size = 5
        queryset = models.Response.objects \
            .prefetch_related('answers', 'answers__question', 'user') \
            .all()
        fr = request.query_params.get("from", None)
        if (fr):
            queryset = queryset.filter(
                created__gte=datetime.strptime(fr, '%Y-%m-%dT%H:%M:%S'))

        to = request.query_params.get("to", None)
        if (to):
            queryset = queryset.filter(
                created__lte=datetime.strptime(to, '%Y-%m-%dT%H:%M:%S'))

        lsts = request.query_params.get("lists", None)
        if lsts:
            lists = [int(x) for x in lsts.split(',')]
            queryset = queryset.filter(survey__in=lists)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.paginator.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class SurveyViewset(GenericViewSet, RetrieveModelMixin):
    questions = models.Question.objects.all()
    queryset = models.Survey.objects.all()
    serializer_class = serializers.SurveySerializer


class ResponseViewset(GenericViewSet, CreateModelMixin,
                      RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin):
    queryset = models.Response.objects.prefetch_related(
        'answers', 'answers__question', 'survey').all()
    serializer_class = serializers.ResponseSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Report viewsets


class ReportListViewset(GenericViewSet, ListModelMixin,
                        CreateModelMixin, DestroyModelMixin):
    queryset = models.Report.objects.prefetch_related('checklists').all()
    serializer_class = serializers.ReportSerializer
    permission_classes = (IsAdminUser,)


class ReportViewset(GenericViewSet, RetrieveModelMixin):
    queryset = models.Report.objects.all()
    serializer_class = serializers.ReportGetEntitySerializer
    authentication_classes = ()
    permission_classes = (AllowAny,)


class MapNodeViewset(GenericViewSet, ListModelMixin):
    authentication_classes = ()
    permission_classes = (AllowAny,)
    serializer_class = serializers.MapNodeSerializer
    queryset = models.MapNode.objects.all()
