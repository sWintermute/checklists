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
    fl = True
    for question in report[0]["questions"]:
        if question["notes"] is not None and question["notes"] is not []:
            fl = False

    if fl:
        return

    from .models import Subscription
    subscriptions = Subscription.objects.filter(
        checklists__in=[response.survey])

    dests = set()
    for subscription in subscriptions:
        for user in subscription.users.all():
            dests.add(user.email)

    for dest in dests:
        mail.send(dest,
                  settings.DEFAULT_FROM_EMAIL,
                  subject="Test email from checklists",
                  message="Hi there!",
                  html_message="Hi <strong>there</strong>!",)

    json = JSONRenderer().render(report)
    print(json)
