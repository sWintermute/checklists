from django.conf import settings
from post_office import mail


def send_email(dest_email, title, message, html_message):
    return mail.send(
        dest_email,
        settings.DEFAULT_FROM_EMAIL,
        subject=title,
        message=message,
        html_message=html_message,
    )
