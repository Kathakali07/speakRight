from django.urls import path
from analyzer.views.voice import transcribe_view
from analyzer.views.grammar import grammar_view

urlpatterns = [
    path('voice/', transcribe_view, name='transcribe'),
    path('grammar/', grammar_view, name='grammar_check'),
]