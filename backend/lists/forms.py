import uuid

from django import forms
from django.core.files.base import ContentFile
from django.forms import models
from django.urls import reverse

from apps.lists.models import Answer, Question, Response
from apps.lists.signals import survey_completed
# from apps.lists.widgets import ImageSelectWidget
# from bootstrap4.widgets import RadioSelectButtonGroup
# from django.core.files.storage import default_storage


class ResponseForm(models.ModelForm):
    WIDGETS = {
        Question.TEXT: forms.Textarea,
        Question.SHORT_TEXT: forms.TextInput,
        Question.RADIO: forms.RadioSelect,
        # Question.RADIO: RadioSelectButtonGroup,
        Question.SELECT: forms.Select,
        # Question.SELECT_IMAGE: forms.ImageField,
        # Question.SELECT_IMAGE: forms.FileInput,
        Question.SELECT_IMAGE: forms.TextInput,
        Question.SELECT_MULTIPLE: forms.CheckboxSelectMultiple,
    }

    class Meta(object):
        model = Response
        fields = ()

    def __init__(self, *args, **kwargs):
        """ Expects a survey object to be passed in initially """
        self.survey = kwargs.pop("survey")
        self.user = kwargs.pop("user")
        try:
            self.step = int(kwargs.pop("step"))
        except KeyError:
            self.step = None
        super(ResponseForm, self).__init__(*args, **kwargs)
        self.uuid = uuid.uuid4().hex
        self.steps_count = len(self.survey.questions.all())
        # add a field for each survey question, corresponding to the question
        # type as appropriate.
        data = kwargs.get("data")
        for i, question in enumerate(self.survey.questions.all()):
            is_current_step = i != self.step and self.step is not None
            if self.survey.display_by_question and is_current_step:
                continue
            else:
                self.add_question(question, data)

    def get_question_widget(self, question):
        """ Return the widget we should use for a question.

        :param Question question: The question
        :rtype: django.forms.widget or None """
        try:
            return self.WIDGETS[question.type]
        except KeyError:
            return None

    def get_question_choices(self, question):
        """ Return the choices we should use for a question.

        :param Question question: The question
        :rtype: List of String or None """
        qchoices = None
        if question.type not in [Question.TEXT, Question.SHORT_TEXT, Question.INTEGER, Question.SELECT_IMAGE]:
            qchoices = question.get_choices()
            # add an empty option at the top so that the user has to explicitly
            # select one of the options
            # if question.type in [Question.SELECT, Question.SELECT_IMAGE]:
            if question.type in [Question.SELECT]:
                qchoices = tuple([("", "-------------")]) + qchoices
        return qchoices

    def get_question_field(self, question, **kwargs):
        """ Return the field we should use in our form.

        :param Question question: The question
        :param **kwargs: A dict of parameter properly initialized in
            add_question.
        :rtype: django.forms.fields """
        FIELDS = {
            Question.TEXT: forms.CharField,
            Question.SHORT_TEXT: forms.CharField,
            Question.SELECT_IMAGE: forms.ImageField,
            Question.SELECT_MULTIPLE: forms.MultipleChoiceField,
            Question.INTEGER: forms.IntegerField,
        }
        # logging.debug("Args passed to field %s", kwargs)
        try:
            return FIELDS[question.type](**kwargs)
        except KeyError:
            return forms.ChoiceField(**kwargs)

    def add_question(self, question, data):
        """ Add a question to the form.

        :param Question question: The question to add.
        :param dict data: The pre-existing values from a post request. """
        kwargs = {"label": question.text, "required": question.required}
        initial = None
        if initial:
            kwargs["initial"] = initial
        choices = self.get_question_choices(question)
        if choices:
            kwargs["choices"] = choices
        widget = self.get_question_widget(question)
        if widget:
            kwargs["widget"] = widget
        field = self.get_question_field(question, **kwargs)
        if question.category:
            field.widget.attrs["category"] = question.category.name
        else:
            field.widget.attrs["category"] = ""
        # logging.debug("Field for %s : %s", question, field.__dict__)
        self.fields["question_%d" % question.pk] = field

    def has_next_step(self):
        if self.survey.display_by_question:
            if self.step < self.steps_count - 1:
                return True
        return False

    def next_step_url(self):
        if self.has_next_step():
            context = {"id": self.survey.id, "step": self.step + 1}
            return reverse("survey-detail-step", kwargs=context)
        else:
            return None

    def current_step_url(self):
        return reverse(
            "survey-detail-step", kwargs={"id": self.survey.id, "step": self.step}
        )

    def save(self, commit=True):
        """ Save the response object """
        # Recover an existing response from the database if any
        #  There is only one response by logged user.
        response = super(ResponseForm, self).save(commit=False)
        response.survey = self.survey
        response.interview_uuid = self.uuid
        if self.user.is_authenticated:
            response.user = self.user
        response.save()
        # response "raw" data as dict (for signal)
        data = {
            "survey_id": response.survey.id,
            "interview_uuid": response.interview_uuid,
            "responses": [],
        }
        # create an answer object for each question and associate it with this
        # response.
        for field_name, field_value in list(self.cleaned_data.items()):
            if field_name.startswith("question_"):
                # warning: this way of extracting the id is very fragile and
                # entirely dependent on the way the question_id is encoded in
                # the field name in the __init__ method of this form class.
                q_id = int(field_name.split("_")[1])
                question = Question.objects.get(pk=q_id)
                answer = Answer(question=question)
                answer.body = field_value
                data["responses"].append((answer.question.id, answer.body))

                answer.response = response
                answer.save()
        survey_completed.send(sender=Response, instance=response, data=data)
        return response
