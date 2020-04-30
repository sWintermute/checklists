from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import get_template
import pytz


def get_user_text(obj):
    email = obj.user.email
    if obj.user.first_name and obj.user.last_name:
        res = f"{obj.user.first_name[0]}. {obj.user.last_name} <{email}>"
    else:
        res = email
    return res


def basic_report(response, answers, questions):
    from .models import Subscription
    subscriptions = Subscription.objects.filter(
        checklists__in=[response.survey])

    dests = set()
    for subscription in subscriptions:
        for user in subscription.users.all():
            dests.add(user.email)

    if not dests:
        return

    from lists import serializers
    report = serializers.ReportSurveySerializer([response.survey],
                                                responses=[response],
                                                answers=answers,
                                                questions=questions,
                                                many=True).data[0]
    report["created"] = response.created
    report["updated"] = response.updated
    report["user"] = get_user_text(response)

    fl = True
    for question in report["questions"]:
        if question["notes"] is not None and question["notes"] is not []:
            fl = False

    if fl:
        return

    tz = pytz.timezone('Asia/Novokuznetsk')
    created = report["created"].astimezone(tz).strftime("%d.%m.%Y %H:%M")
    for dest in dests:
        subject = f'Чеклист "{report["name"]}" от {created} - {report["user"]}'
        body = "Plain text body"
        email_message = EmailMultiAlternatives(subject, body,
                                               settings.DEFAULT_FROM_EMAIL,
                                               [dest])
        template = get_template('basic_report.html', using='post_office')
        html = template.render(report)
        email_message.attach_alternative(html, 'text/html')
        template.attach_related(email_message)
        email_message.send()
