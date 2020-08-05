from django.urls import path, include
from .views import AddressViewSet
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('info', AddressViewSet, basename='info')


urlpatterns = [
    path('v1/', include(router.urls)),
]
