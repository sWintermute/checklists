from django.core.management.base import BaseCommand
from post_office import mail
from django.conf import settings


class Command(BaseCommand):
    help = 'Отправка тестового сообщения'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str)

    def handle(self, *args, **options):
        dest_email = options["email"]
        mail.send(
            dest_email,
            settings.DEFAULT_FROM_EMAIL,
            subject="Test email from checklists",
            message="Hi there!",
            html_message="Hi <strong>there</strong>!",
        )
