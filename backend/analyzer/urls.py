from django.urls import path
from analyzer.views.voice import transcribe_view

urlpatterns = [
    path('voice/', transcribe_view, name='transcribe')
]
