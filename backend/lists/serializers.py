import base64
import imghdr
import uuid

from django.contrib.contenttypes.models import ContentType
from django.core.files.base import ContentFile
from rest_framework import serializers
from user_profile import models as umodels
from rest_framework_cache.serializers import CachedSerializerMixin
from rest_framework_cache.registry import cache_registry
from . import models


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Question
        fields = ('id', 'text', 'order', 'required', 'type', 'choices', 'key_choices')


@cache_registry.register
class SurveySerializer(CachedSerializerMixin, serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = models.Survey
        fields = ('id', 'name', 'description', 'questions')


class SurveyListSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Survey
        fields = ('id', 'name', 'description')


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Report
        fields = ('id', 'name', 'date_from', 'date_to', 'checklists')


class ResponseListSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Response
        fields = ('id', 'created', 'updated', 'survey')


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Answer
        fields = ('id', 'question', 'body')


class Base64ImageField(serializers.ImageField):

    def to_internal_value(self, data):
        if isinstance(data, str):
            if 'data:' in data and ';base64,' in data:
                header, data = data.split(';base64,')

            try:
                decoded_file = base64.b64decode(data)
            except TypeError:
                self.fail('invalid_image')

            file_name = str(uuid.uuid4())[:12]
            file_extension = self.get_file_extension(file_name, decoded_file)

            complete_file_name = "%s.%s" % (file_name, file_extension,)

            data = ContentFile(decoded_file, name=complete_file_name)

        return super(Base64ImageField, self).to_internal_value(data)

    def get_file_extension(self, file_name, decoded_file):
        extension = imghdr.what(file_name, decoded_file)
        extension = "jpg" if extension == "jpeg" else extension

        return extension


class AttachmentSerializer(serializers.HyperlinkedModelSerializer):
    file = Base64ImageField(max_length=None, use_url=True)

    class Meta:
        model = models.Attachment
        fields = ('file', 'name')


class ResponseSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)
    photo = AttachmentSerializer(many=True, required=False)

    class Meta:
        model = models.Response
        fields = ('id', 'created', 'updated', 'survey', "answers", 'photo')

    def create(self, validated_data):
        answers = validated_data.pop('answers')
        photos = validated_data.pop('photo')
        response = models.Response.objects.create(**validated_data)

        for answer in answers:
            models.Answer.objects.create(response=response, **answer)

        content_type = ContentType.objects.get(model='response')
        for photo in photos:
            models.Attachment.objects.create(object_id=response.id, content_type=content_type, **photo)

        return response


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = umodels.UserProfile
        fields = ('id', 'email', 'first_name', 'last_name', 'position')


# Begin report generation
class ReportQuestionSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        self.responses = kwargs.pop('responses', None)
        super(ReportQuestionSerializer, self).__init__(*args, **kwargs)

    notes = serializers.SerializerMethodField()

    def get_notes(self, obj):
        notes = []

        for response in self.responses:
            keys = []
            for question in models.Question.objects.filter(is_key=True, survey=response.survey):
                for answer in models.Answer.objects.filter(question=question, response=response):
                    keys.append({"name": question.text, "answer": answer.body})

            for answer in models.Answer.objects.filter(question=obj.id, response=response):
                if answer.body in obj.key_choices.split(";"):
                    notes.append({"created": response.created, "keys": keys})

        return notes

    class Meta:
        model = models.Question
        fields = ('id', 'text', 'order', 'choices', 'key_choices', 'notes')


class ReportSurveySerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        self.responses = kwargs.pop('responses', None)
        super(ReportSurveySerializer, self).__init__(*args, **kwargs)

    questions = serializers.SerializerMethodField()

    def get_questions(self, obj):
        quests = models.Question.objects.filter(survey=obj.id, is_key=False)
        return ReportQuestionSerializer(quests, responses=self.responses, many=True).data

    class Meta:
        model = models.Survey
        fields = ('id', 'name', 'questions')


@cache_registry.register
class ReportGetEntitySerializer(CachedSerializerMixin, serializers.ModelSerializer):
    checklists = serializers.SerializerMethodField()

    def get_checklists(self, obj):
        all_lists = obj.checklists.all()
        lists = [x for y in all_lists for x in models.Survey.objects.filter(id=y.id)]
        resps = [x for y in all_lists for x in models.Response.objects.filter(survey=y.id)]

        resps = list(filter(lambda x: obj.date_from <= x.created <= obj.date_to, resps))

        return ReportSurveySerializer(lists, responses=resps, many=True).data

    class Meta:
        model = models.Report
        fields = ('id', 'name', 'date_from', 'date_to', 'checklists')

# End report generation
