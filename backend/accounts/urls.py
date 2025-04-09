from django.urls import path
from .views import signup_api, signin_api

urlpatterns = [
    path('signup/', signup_api, name='signup'),
    path('signin/', signin_api, name='signin'),
]
