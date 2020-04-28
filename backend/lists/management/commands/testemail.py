from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings


class Command(BaseCommand):
    help = 'Отправка тестового сообщения'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str)

    def handle(self, *args, **options):
        dest_email = options["email"]
        send_mail("Test email from checklists",
                  "Test email from checklists",
                  settings.DEFAULT_FROM_EMAIL,
                  [dest_email])
