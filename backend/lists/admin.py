from django.contrib import admin
from import_export import resources
from import_export.admin import ExportMixin

from lists.models import Report
from .models import Response, Survey, Question, Category, Answer


class SurveyResource(resources.ModelResource):
    class Meta:
        model = Survey


class ReportResource(resources.ModelResource):
    class Meta:
        model = Report


class QuestionInline(admin.TabularInline):
    model = Question
    ordering = ("order", "category")
    extra = 1


class CategoryInline(admin.TabularInline):
    model = Category
    extra = 0


@admin.register(Survey)
class SurveyAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = SurveyResource
    list_display = ("name", "is_published", "need_logged_user", "template")
    list_filter = ("is_published", "need_logged_user")
    inlines = [QuestionInline]


class AnswerBaseInline(admin.StackedInline):
    fields = ("question", "body")
    readonly_fields = ("question",)
    extra = 0
    model = Answer


@admin.register(Response)
class ResponseAdmin(admin.ModelAdmin):
    list_display = ("interview_uuid", "survey", "created", "user")
    list_filter = ("survey", "created")
    date_hierarchy = "created"
    inlines = [AnswerBaseInline]
    readonly_fields = ("survey", "created", "updated", "interview_uuid", "user")


@admin.register(Report)
class ReportAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = ReportResource
