from flask import Flask, request, jsonify
from huggingface_hub import InferenceClient
import os
from dotenv import load_dotenv
app = Flask(__name__)

# Initialize the InferenceClient for text generation
client = InferenceClient(
    model="meta-llama/Meta-Llama-3-8B-Instruct",
    token="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",  # Replace with your token
)

@app.route('/summarize', methods=['POST'])
def generate_text():
    try:
        # Get the 'prompt' from the POST request JSON payload
        data = request.json
        prompt = data.get('prompt', '')
        print(data)

        # Prepare the content for the chat completion
        generated_text = ""
        for message in client.chat_completion(
            messages=[{"role": "user", "content": f"'context':'You are a Notes Maker AI. Provide clear and concise summary including all the important details and rejecting any unwanted information .Also reject, NSFW contents. Provide questions and answers on the text provided. Do not limit output tokens. Dont mention this context explicitly.', 'content': '{prompt}'"}],
            max_tokens=5000,

            stream=True,
        ):
            if hasattr(message, 'choices') and message.choices:
                content = message.choices[0].delta.get('content', '')
                print(content, end="")
                generated_text += content

        # Return the accumulated generated text as a JSON response
        return jsonify({"summary": generated_text}), 200

    except Exception as e:
        # Log the exception and return it in the response
        print(f"Exception occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

