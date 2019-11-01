import base64
import imghdr
import uuid

from django.contrib.contenttypes.models import ContentType
from django.core.files.base import ContentFile
from rest_framework import serializers
from user_profile import models as umodels

from . import models


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Question
        fields = ('id', 'text', 'order', 'required',
                  'type', 'choices', 'key_choices')


class SurveySerializer(serializers.ModelSerializer):
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
            models.Attachment.objects.create(
                object_id=response.id, content_type=content_type, **photo)

        return response


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = umodels.UserProfile
        fields = ('id', 'email', 'first_name', 'last_name', 'position')


# Begin report generation
class ReportQuestionSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        self.responses = kwargs.pop('responses', None)
        self.answers = kwargs.pop('answers', None)
        self.questions = kwargs.pop('questions', None)
        super(ReportQuestionSerializer, self).__init__(*args, **kwargs)

    notes = serializers.SerializerMethodField()

    def get_notes(self, obj):
        notes = []

        for response in self.responses:
            response_answers = [
                x for x in self.answers if x.response_id is response.id]

            keys = [{"name": question.text, "answer": answer.body}
                    for question in self.questions
                    for answer in [x for x in response_answers
                                   if x.question_id is question.id]
                    ]

            for answer in [x for x in response_answers
                           if x.question_id is obj.id]:
                if answer.body in obj.key_choices.split(";"):
                    notes.append({"created": response.created, "keys": keys})

        return notes

    class Meta:
        model = models.Question
        fields = ('id', 'text', 'order', 'choices', 'key_choices', 'notes')


class ReportSurveySerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        self.responses = kwargs.pop('responses', None)
        self.answers = kwargs.pop('answers', None)
        self.questions = kwargs.pop('questions', None)
        super(ReportSurveySerializer, self).__init__(*args, **kwargs)

    questions = serializers.SerializerMethodField()

    def get_questions(self, obj):
        que = [x for x in self.questions
               if x.survey_id is obj.id]

        quests = [x for x in que
                  if x.is_key is False]
        quests_key = [x for x in que
                      if x.is_key is True]

        answers = [x for x in self.answers
                   for qu in que
                   if x.question_id is qu.id]

        resps = [x for x in self.responses
                 if x.survey_id is obj.id]

        return ReportQuestionSerializer(quests,
                                        responses=resps,
                                        answers=answers,
                                        questions=quests_key,
                                        many=True).data

    class Meta:
        model = models.Survey
        fields = ('id', 'name', 'questions')


class ReportGetEntitySerializer(serializers.ModelSerializer):
    checklists = serializers.SerializerMethodField()

    def get_checklists(self, obj):
        lists = [x for x in models.Survey.objects.filter(
            id__in=obj.checklists.all()).only('id', 'name')]

        resps = [x for x in models.Response.objects
                 .filter(survey__in=lists,
                         created__range=[obj.date_from, obj.date_to])
                 .only('id', 'created', 'survey_id')
                 ]

        answers = [x for x in models.Answer.objects
                   .filter(response__in=resps)
                   .only('id', 'body', 'question_id', 'response_id')
                   ]

        questions = [x for x in models.Question.objects
                     .filter(survey__in=lists)
                     .select_related('survey')]

        return ReportSurveySerializer(lists,
                                      responses=resps,
                                      answers=answers,
                                      questions=questions,
                                      many=True).data

    class Meta:
        model = models.Report
        fields = ('id', 'name', 'date_from', 'date_to', 'checklists')

# End report generation
