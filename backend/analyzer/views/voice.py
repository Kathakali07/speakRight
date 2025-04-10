from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import os
import uuid
from django.conf import settings
from analyzer.voice_to_text.util import speech_to_text
from analyzer.grammar_corrector.util import grammar_corrector
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def transcribe_view(request):
    # Debug logging
    logger.info(f"Audio submission request from user: {request.user.username}")
    logger.info(f"Request headers: {request.headers}")
    
    if 'audio' not in request.FILES:
        logger.error("No audio file in request")
        return Response({"error": "No audio file provided"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        audio_file = request.FILES['audio']
        logger.info(f"Received audio file: {audio_file.name} ({audio_file.size} bytes)")

        # Save to temporary file
        os.makedirs(settings.MEDIA_ROOT, exist_ok=True)
        filename = f"{uuid.uuid4()}.wav"
        file_path = os.path.join(settings.MEDIA_ROOT, filename)
        
        with open(file_path, 'wb+') as destination:
            for chunk in audio_file.chunks():
                destination.write(chunk)

        # Process audio
        transcription = speech_to_text(file_path)
        logger.info(f"Raw transcription: {transcription}")
        
        # Grammar correction
        result = grammar_corrector(transcription)
        logger.info(f"Corrected text: {result.get('Output Text')}")

        # Cleanup
        os.remove(file_path)
        
        return Response({
            **result,
            "user": request.user.username
        })

    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)