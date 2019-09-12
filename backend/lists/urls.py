from django.urls import path, include

from checklists.api import router

urlpatterns = [
    path('v1/', include(router.urls)),
]
