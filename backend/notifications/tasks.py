from django.conf import settings
from django.core.mail import send_mail


def send_email(title, message, dest_email):
    return send_mail(title, message,
                     settings.DEFAULT_FROM_EMAIL,
                     [dest_email])
