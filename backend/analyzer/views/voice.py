from django.http import JsonResponse
from analyzer.voice_to_text.util import speech_to_text

def transcribe_view(request):
    fake_audio_path = "path/to/audio.wav"
    text = speech_to_text(fake_audio_path)
    return JsonResponse({"transcribed_text": text})