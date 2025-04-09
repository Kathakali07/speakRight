import requests

def grammar_corrector(text):
    API_URL = "https://api-inference.huggingface.co/models/prithivida/grammar_error_correcter_v1"
    headers = {"Authorization": f"Bearer YOUR_HUGGINGFACE_API_KEY"}
    payload = {"inputs": text}
    response = requests.post(API_URL, headers=headers, json=payload)
    
    try:
        result = response.json()
        # Assuming the API returns a list with a dict holding 'generated_text'
        corrected_text = result[0].get("generated_text", "")
    except Exception as e:
        corrected_text = "Error processing text"
    return corrected_text
