import requests

def get_bot_reply(user_msg, model="mistral"):
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": model,
                "prompt": user_msg,
                "stream": False
            }
        )
        return response.json()["response"].strip()
    except Exception as e:
        print("Ollama request error:", e)
        return "⚠️ Sorry, the local AI model is not responding."
