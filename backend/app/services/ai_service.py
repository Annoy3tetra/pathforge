import requests
import json
import re

from app.core.config import settings

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


def extract_json(text):
    match = re.search(
        r"\{.*\}",
        text,
        re.DOTALL
    )

    if not match:
        raise Exception(
            "No valid JSON found in AI response"
        )

    return match.group(0)


def generate_roadmap(goal: str):
    prompt = f"""
    Create a beginner-friendly learning roadmap for:
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
        "temperature": 0.5
    }

    response = requests.post(
        GROQ_URL,
        headers=headers,
        json=payload
    )

    data = response.json()

    if "choices" not in data:
        raise Exception(
            f"Groq API Error: {data}"
        )

    content = data["choices"][0]["message"]["content"]

    print("AI RESPONSE:")
    print(content)

    cleaned_json = extract_json(content)

    return json.loads(cleaned_json)