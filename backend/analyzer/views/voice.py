from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import os
import uuid
from django.conf import settings
from analyzer.voice_to_text.util import speech_to_text
from analyzer.grammar_corrector.util import grammar_corrector

@csrf_exempt
def transcribe_view(request):
    if request.method == "POST":
        audio_file = request.FILES.get('audio')

        if not audio_file:
            return JsonResponse({"error": "No audio file provided"}, status=400)

        # Save the file
        os.makedirs(settings.MEDIA_ROOT, exist_ok=True)
        filename = f"{uuid.uuid4()}.wav"
        file_path = os.path.join(settings.MEDIA_ROOT, filename)
        with open(file_path, 'wb+') as destination:
            for chunk in audio_file.chunks():
                destination.write(chunk)

        # Transcribe the audio
        transcription = speech_to_text(file_path)

        # Optionally delete file
        os.remove(file_path)

        # Return the grammar correction response
        return grammar_corrector(transcription)

    # If not POST
    return JsonResponse({"error": "Only POST allowed"}, status=405)
