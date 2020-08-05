from .models import TokenizedAdress
from django.contrib import admin
from import_export.admin import ImportExportActionModelAdmin


@admin.register(TokenizedAdress)
class TokenizedAdressAdmin(ImportExportActionModelAdmin):
    list_display = ("unrestricted_value",)
