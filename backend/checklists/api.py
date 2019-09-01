from rest_framework import routers

from lists import views

router = routers.DefaultRouter()
router.register(r'lists', views.FriendViewset)
