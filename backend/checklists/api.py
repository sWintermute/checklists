from rest_framework import routers

from lists import views


router = routers.DefaultRouter()
router.register(r'lists', views.SurveyViewset)
router.register(r'lists', views.SurveyListViewset)
router.register(r'report', views.ReportViewset)
router.register(r'reports', views.ReportListViewset)
router.register(r'responses', views.ResponseListViewset)
router.register(r'response', views.ResponseViewset)
router.register(r'maps', views.MapReportViewset, 'maps')
