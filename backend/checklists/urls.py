from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import RedirectView
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

admin.site.site_header = "Адмнистрирование чеклистов"
admin.site.site_title = "Адмнистрирование чеклистов"
admin.site.index_title = "Чеклисты"

favicon_view = RedirectView.as_view(url='/static/favicon.ico', permanent=True)

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^favicon\.ico$', favicon_view),
]

# API
urlpatterns += [
    path('auth/', include('djoser.urls.authtoken')),
    path('api/', include('lists.urls')),
]

# Swagger
schema_view = get_schema_view(
    openapi.Info(
        title="Checklists API",
        default_version='v1',
        description="API documentation for checklists app. Auth 'Token <token>'",
        contact=openapi.Contact(email="belyy_ns@kuzro.ru"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns += [
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
