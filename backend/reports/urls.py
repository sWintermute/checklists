from django.urls import path, include

from .views import ExcelView

urlpatterns = [
    path('v1/excell/', ExcelView.as_view()),
]
