import requests
import os
import json



def speech_to_text(audio_path):

    PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    config_file_path = os.path.join(PROJECT_ROOT, 'config.json')

    # Load the API key from config.json
    with open(config_file_path, 'r') as config_file:
        config = json.load(config_file)
    HUGGING_FACE_API_KEY = config.get("HUGGING_FACE_API_KEY")
    
    API_URL = "https://api-inference.huggingface.co/models/openai/whisper-large"
    headers = {
        "Authorization": f"Bearer {HUGGING_FACE_API_KEY}"
    }

    with open(audio_path, "rb") as audio_file:
        audio_bytes = audio_file.read()

    response = requests.post(API_URL, headers=headers, data=audio_bytes)

    if response.status_code == 200:
        try:
            result = response.json()
            return result.get("text", "No transcription found.")
        except Exception as e:
            return f"Error parsing response JSON: {str(e)}"
    else:
        return f"API returned status {response.status_code}: {response.text}"
