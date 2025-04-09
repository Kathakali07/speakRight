import requests

def speech_to_text(audio_path):
    API_URL = "https://api-inference.huggingface.co/models/openai/whisper-large"
    headers = {
        "Authorization": f"Bearer YOUR_HUGGINGFACE_API_KEY"
    }

    with open(audio_path, "rb") as audio_file:
        audio_bytes = audio_file.read()

    response = requests.post(API_URL, headers=headers, data=audio_bytes)

    try:
        result = response.json()
        return result.get("text", "No transcription found.")
    except Exception as e:
        return f"Error: {str(e)}"
