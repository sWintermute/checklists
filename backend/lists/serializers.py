from rest_framework import serializers
from . import models


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Question
        fields = ('id', 'text', 'order', 'required', 'type', 'choices')


class SurveySerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = models.Survey
        fields = ('id', 'name', 'description', 'latest_answer_date', 'questions')


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Report
        fields = ('id', 'name', 'date_from', 'date_to', 'checklists')


class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Response
        fields = ('id', 'created', 'updated', 'survey', 'user')
