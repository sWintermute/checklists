from django.conf import settings
from post_office import mail
from rest_framework.renderers import JSONRenderer


def send_email(dest_email, title, message, html_message):
    return mail.send(
        dest_email,
        settings.DEFAULT_FROM_EMAIL,
        subject=title,
        message=message,
        html_message=html_message,
    )


def basic_report(response, answers, questions):
    from lists import serializers
    report = serializers.ReportSurveySerializer([response.survey],
                                                responses=[response],
                                                answers=answers,
                                                questions=questions,
                                                many=True).data
    fl = False
    for question in report[0]["questions"]:
        if question["notes"] is None or question["notes"] is []:
            fl = True

    if fl:
        send_email()

    json = JSONRenderer().render(report)
    print(json)
