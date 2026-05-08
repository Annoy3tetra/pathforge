import requests
import json

from app.core.config import settings

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


def generate_roadmap(goal: str):
    prompt = f"""
    Create a learning roadmap for:
    {goal}

    Return ONLY valid JSON.

    Format:
    {{
      "title": "Roadmap title",
      "description": "short description",
      "milestones": [
        {{
          "title": "Milestone title",
          "description": "Milestone description",
          "estimated_days": 7
        }}
      ]
    }}
    """

    headers = {
        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
    "model": "llama-3.1-8b-instant",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.7
    }

    response = requests.post(
        GROQ_URL,
        headers=headers,
        json=payload
    )

    print("STATUS CODE:", response.status_code)
    print("RAW RESPONSE:", response.text)

    data = response.json()

    if "choices" not in data:
        raise Exception(
            f"Groq API Error: {data}"
        )

    content = data["choices"][0]["message"]["content"]

    return json.loads(content)