from django.urls import path

from .views import ExcelView

urlpatterns = [
    path('v1/excel/', ExcelView.as_view()),
]
