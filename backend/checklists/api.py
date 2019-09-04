from rest_framework import routers

from lists import views


router = routers.DefaultRouter()
router.register(r'lists', views.SurveyViewset)
router.register(r'lists', views.SurveyListViewset)
router.register(r'reports', views.ReportViewset)
router.register(r'responses', views.ResponseListViewset)
router.register(r'response', views.ResponseViewset)
router.register(r'me', views.UserViewset)
