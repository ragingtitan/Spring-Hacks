import requests

API_URL = "https://api-inference.huggingface.co/models/facebook/wav2vec2-base-960h"
headers = {"Authorization": "Bearer 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"}

def query(filename):
    with open(filename, "rb") as f:
        data = f.read()
    response = requests.post(API_URL, headers=headers, data=data)
    return response.json()

output = query("sample1.flac")