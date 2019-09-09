from rest_framework import serializers

from . import models
from user_profile import models as umodels


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Question
        fields = ('id', 'text', 'order', 'required', 'type', 'choices')


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


from django.core.files.base import ContentFile
import base64
import six
import uuid
import imghdr

class Base64ImageField(serializers.ImageField):

    def to_internal_value(self, data):

        # Check if this is a base64 string
        if isinstance(data, six.string_types):
            # Check if the base64 string is in the "data:" format
            if 'data:' in data and ';base64,' in data:
                # Break out the header from the base64 content
                header, data = data.split(';base64,')

            # Try to decode the file. Return validation error if it fails.
            try:
                decoded_file = base64.b64decode(data)
            except TypeError:
                self.fail('invalid_image')

            # Generate file name:
            file_name = str(uuid.uuid4())[:12]  # 12 characters are more than enough.
            # Get the file name extension:
            file_extension = self.get_file_extension(file_name, decoded_file)

            complete_file_name = "%s.%s" % (file_name, file_extension,)

            data = ContentFile(decoded_file, name=complete_file_name)

        return super(Base64ImageField, self).to_internal_value(data)

    def get_file_extension(self, file_name, decoded_file):

        extension = imghdr.what(file_name, decoded_file)
        extension = "jpg" if extension == "jpeg" else extension

        return extension


class AttachmentSerializer(serializers.HyperlinkedModelSerializer):
    file = Base64ImageField(
        max_length=None, use_url=True,
    )

    class Meta:
        model = models.Attachment
        fields = ('object_id', 'file', 'name', 'description')


# Update ?
class ResponseSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)
    photo = AttachmentSerializer(many=True)

    class Meta:
        model = models.Response
        fields = ('id', 'created', 'updated', 'survey', "answers", 'photo')

    def create(self, validated_data):
        profile_data = validated_data.pop('answers')
        response = models.Response.objects.create(**validated_data)

        for i in profile_data:
            models.Answer.objects.create(response=response, **i)
        return response


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = umodels.UserProfile
        fields = ('id', 'email', 'first_name', 'last_name', 'position')


# Begin report generation
class ReportQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Question
        fields = ('id', 'text', 'order', 'required', 'type', 'choices', 'is_key', 'key_choices')


class ReportSurveySerializer(serializers.ModelSerializer):
    questions = ReportQuestionSerializer(many=True)

    class Meta:
        model = models.Survey
        fields = ('id', 'name', 'description', 'questions')


class ReportResponseSerializer(serializers.ModelSerializer):
    answers = serializers.SerializerMethodField()
    photo = AttachmentSerializer(many=True)

    def get_answers(self, obj):
        answers = models.Answer.objects.all()
        return AnswerSerializer(answers, many=True).data

    class Meta:
        model = models.Response
        fields = ('id', 'created', 'updated', "answers", 'photo')


class ReportGetEntitySerializer(serializers.ModelSerializer):
    responses = serializers.SerializerMethodField()
    checklists = serializers.SerializerMethodField()

    def get_checklists(self, obj):
        lists = []
        for i in obj.checklists.all():
            lists += models.Survey.objects.filter(id=i.id)
        return ReportSurveySerializer(lists, many=True).data

    def get_responses(self, obj):
        resps = []
        for i in obj.checklists.all():
            resps += models.Response.objects.filter(survey=i.id)

        resps = list(filter(lambda x: x.created >= obj.date_from, resps))
        resps = list(filter(lambda x: x.created <= obj.date_to, resps))

        return ReportResponseSerializer(resps, many=True).data

    class Meta:
        model = models.Report
        fields = ('id', 'name', 'date_from', 'date_to', 'checklists', 'responses')

# End report generation
