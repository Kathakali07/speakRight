from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import os
import uuid
from django.conf import settings
from analyzer.voice_to_text.util import speech_to_text
from analyzer.grammar_corrector.util import grammar_corrector

@api_view(['POST'])
def transcribe_view(request):
    audio_file = request.FILES.get('audio')

    if not audio_file:
        return Response({"error": "No audio file provided"}, status=status.HTTP_400_BAD_REQUEST)

    # Save the file
    os.makedirs(settings.MEDIA_ROOT, exist_ok=True)
    filename = f"{uuid.uuid4()}.wav"
    file_path = os.path.join(settings.MEDIA_ROOT, filename)
    with open(file_path, 'wb+') as destination:
        for chunk in audio_file.chunks():
            destination.write(chunk)

    # Transcribe the audio
    transcription = speech_to_text(file_path)

    # Delete the file after processing
    os.remove(file_path)

    # Grammar correction
    result = grammar_corrector(transcription)

    return Response(result)
