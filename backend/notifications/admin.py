from django.contrib import admin

from .models import Subscription


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    filter_horizontal = ('checklists', 'users',)
    list_display = ("name", "notification_type",)
    list_filter = ("notification_type", "checklists", "users")
    search_fields = ('name',)
