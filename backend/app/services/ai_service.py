import requests
import json
import re
import logging
import time

from app.core.config import settings
from app.services.resource_engine import attach_trusted_resources

logger = logging.getLogger("pathforge.ai")

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

# Configuration
MAX_RETRIES = 3
REQUEST_TIMEOUT = 30  # seconds
RETRY_DELAY = 2  # seconds between retries


class AIGenerationError(Exception):
    """Raised when AI generation fails after all retries."""

    def __init__(self, message: str, detail: str = None):
        self.message = message
        self.detail = detail
        super().__init__(self.message)


def extract_json(text: str) -> str:
    """
    Extract the first valid JSON object from a text response.
    Tries multiple strategies: direct parse, regex extraction,
    and markdown code-fence stripping.
    """
    # Strategy 1: Try parsing the entire text directly
    stripped = text.strip()
    if stripped.startswith("{"):
        try:
            json.loads(stripped)
            return stripped
        except json.JSONDecodeError:
            pass

    # Strategy 2: Strip markdown code fences
    fenced = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if fenced:
        try:
            json.loads(fenced.group(1))
            return fenced.group(1)
        except json.JSONDecodeError:
            pass

    # Strategy 3: Greedy regex for outermost braces
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        return match.group(0)

    raise AIGenerationError(
        "No valid JSON found in AI response",
        detail=f"Raw response (first 500 chars): {text[:500]}"
    )


def validate_roadmap(data: dict) -> dict:
    """
    Validate and sanitize the parsed roadmap data.
    Raises AIGenerationError for structurally invalid responses.
    """
    # Required top-level fields
    if not isinstance(data, dict):
        raise AIGenerationError("AI response is not a JSON object")

    if "title" not in data or not isinstance(data["title"], str) or not data["title"].strip():
        raise AIGenerationError("Missing or empty 'title' in AI response")

    if "milestones" not in data or not isinstance(data["milestones"], list):
        raise AIGenerationError("Missing or invalid 'milestones' in AI response")

    if len(data["milestones"]) == 0:
        raise AIGenerationError("AI returned an empty milestones list")

    # Set description fallback
    if "description" not in data or not data.get("description"):
        data["description"] = f"AI-generated roadmap for: {data['title']}"

    # Validate each milestone
    cleaned_milestones = []
    for idx, m in enumerate(data["milestones"]):
        if not isinstance(m, dict):
            logger.warning(f"Milestone {idx} is not a dict, skipping: {m}")
            continue

        if not m.get("title") or not isinstance(m.get("title"), str):
            logger.warning(f"Milestone {idx} missing title, skipping")
            continue

        # Sanitize estimated_days
        est_days = m.get("estimated_days")
        if est_days is None or not isinstance(est_days, (int, float)):
            est_days = 7  # default fallback
            logger.info(f"Milestone {idx} missing estimated_days, defaulting to 7")

        est_days = max(1, int(est_days))  # ensure positive integer

        cleaned_milestones.append({
            "title": m["title"].strip(),
            "description": (m.get("description") or "").strip(),
            "estimated_days": est_days,
            "resources": [],
        })

    if len(cleaned_milestones) == 0:
        raise AIGenerationError(
            "All milestones were invalid after validation"
        )

    data["milestones"] = attach_trusted_resources(cleaned_milestones)
    data["title"] = data["title"].strip()
    data["description"] = data["description"].strip()

    return data


VALID_RESOURCE_TYPES = {"video", "article", "course", "docs"}
VALID_DIFFICULTIES = {"beginner", "intermediate", "advanced"}


def _validate_resources(resources: list, milestone_idx: int) -> list:
    """Validate and sanitize resource entries for a single milestone."""
    if not isinstance(resources, list):
        return []

    cleaned = []
    for r in resources:
        if not isinstance(r, dict):
            continue
        title = r.get("title")
        url = r.get("url")
        if not title or not url or not isinstance(title, str) or not isinstance(url, str):
            continue

        rtype = str(r.get("type", "article")).lower().strip()
        if rtype not in VALID_RESOURCE_TYPES:
            rtype = "article"

        difficulty = r.get("difficulty")
        if difficulty:
            difficulty = str(difficulty).lower().strip()
            if difficulty not in VALID_DIFFICULTIES:
                difficulty = None

        cleaned.append({
            "title": title.strip(),
            "url": url.strip(),
            "type": rtype,
            "difficulty": difficulty,
        })

    return cleaned


def _call_groq(prompt: str) -> str:

    """
    Make a single call to the Groq API.
    Returns the content string from the response.
    Raises AIGenerationError on failures.
    """
    headers = {
        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.5,
    }

    try:
        response = requests.post(
            GROQ_URL,
            headers=headers,
            json=payload,
            timeout=REQUEST_TIMEOUT,
        )
    except requests.exceptions.Timeout:
        raise AIGenerationError(
            "AI service timed out",
            detail=f"Request exceeded {REQUEST_TIMEOUT}s timeout"
        )
    except requests.exceptions.ConnectionError:
        raise AIGenerationError(
            "Could not connect to AI service",
            detail="Network connection error to Groq API"
        )

    if response.status_code != 200:
        raise AIGenerationError(
            "AI service returned an error",
            detail=f"HTTP {response.status_code}: {response.text[:300]}"
        )

    data = response.json()

    if "choices" not in data or len(data["choices"]) == 0:
        raise AIGenerationError(
            "AI returned an unexpected response format",
            detail=f"Response keys: {list(data.keys())}"
        )

    content = data["choices"][0]["message"]["content"]

    if not content or not content.strip():
        raise AIGenerationError("AI returned an empty response")

    return content


def generate_roadmap(goal: str, profile: dict = None) -> dict:
    """
    Generate a learning roadmap for the given goal.
    Includes retry logic, response validation, structured error handling,
    and profile-based personalization.
    """
    
    profile_context = ""
    if profile:
        # Build profile context string
        context_parts = []
        if profile.get("skill_level"):
            context_parts.append(f"- Current Skill Level: {profile['skill_level']}")
        if profile.get("current_skill_level"):
            context_parts.append(f"- ForgeProfile Skill Level: {profile['current_skill_level']}")
        if profile.get("education_level") or profile.get("field_of_study"):
            edu = filter(None, [profile.get("education_level"), profile.get("field_of_study")])
            context_parts.append(f"- Education Background: {' in '.join(edu)}")
        if profile.get("career_goal"):
            context_parts.append(f"- Career Goal: {profile['career_goal']}")
        if profile.get("weekly_study_hours"):
            context_parts.append(f"- Available Study Time: {profile['weekly_study_hours']} hours per week")
        if profile.get("preferred_learning_style"):
            context_parts.append(f"- Preferred Learning Style: {profile['preferred_learning_style']}")
        if profile.get("preferred_resource_format"):
            context_parts.append(f"- Preferred Resource Format: {profile['preferred_resource_format']}")
        if profile.get("preferred_domains"):
            context_parts.append(f"- Preferred Domains: {', '.join(profile['preferred_domains'])}")
        if profile.get("biggest_learning_struggle"):
            context_parts.append(f"- Biggest Learning Struggle: {profile['biggest_learning_struggle']}")
        if profile.get("motivation_type"):
            context_parts.append(f"- Motivation Type: {profile['motivation_type']}")
        if profile.get("preferred_project_type"):
            context_parts.append(f"- Preferred Project Type: {profile['preferred_project_type']}")
        if profile.get("confidence_level"):
            context_parts.append(f"- Confidence Level: {profile['confidence_level']}/10")
        if profile.get("target_timeline"):
            context_parts.append(f"- Target Timeline: {profile['target_timeline']}")
        if profile.get("current_focus"):
            context_parts.append(f"- Current Focus: {profile['current_focus']}")
        if profile.get("interests"):
            context_parts.append(f"- Interests: {', '.join(profile['interests'])}")
            
        if context_parts:
            profile_context = "\n    USER PROFILE CONTEXT:\n    " + "\n    ".join(context_parts) + """
            
    Please personalize the roadmap based on this context:
    - Adjust the 'estimated_days' for each milestone based on their available study hours and skill level.
    - Tailor the complexity of the milestones to their skill level.
    - If they have a preferred learning style, heavily prioritize resources of that type (e.g. video, article, course).
    - Align the milestones with their career goals and interests where applicable.
    - Address their biggest struggle directly with milestone design and descriptions.
    - Prefer project work that matches their preferred project type.
    - Keep the roadmap realistic for their target timeline and confidence level.
"""

    prompt = f"""
    Create a learning roadmap for:
    {goal}
{profile_context}
    Return ONLY valid JSON. No explanations, no markdown.

    Format:
    {{
      "title": "Roadmap title",
      "description": "short description",
      "milestones": [
        {{
          "title": "Milestone title",
          "description": "Milestone description",
          "estimated_days": 7,
          "resources": []
        }}
      ]
    }}

    Do not generate resource URLs. PathForge will attach verified resources from its trusted catalog.
    """

    last_error = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            logger.info(f"AI generation attempt {attempt}/{MAX_RETRIES} for goal: '{goal[:80]}'")

            content = _call_groq(prompt)

            logger.debug(f"AI raw response (attempt {attempt}): {content[:300]}")

            cleaned_json = extract_json(content)
            parsed_data = json.loads(cleaned_json)
            validated = validate_roadmap(parsed_data)

            logger.info(
                f"AI generation succeeded on attempt {attempt}: "
                f"'{validated['title']}' with {len(validated['milestones'])} milestones"
            )
            return validated

        except (json.JSONDecodeError, AIGenerationError) as e:
            last_error = e
            detail_str = f" | Detail: {e.detail}" if isinstance(e, AIGenerationError) and e.detail else ""
            logger.warning(
                f"AI generation attempt {attempt} failed: {e}{detail_str}"
            )
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY)
            continue

        except Exception as e:
            last_error = e
            logger.error(
                f"Unexpected error on AI generation attempt {attempt}: {e}",
                exc_info=True,
            )
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY)
            continue

    # All retries exhausted
    error_msg = f"AI generation failed after {MAX_RETRIES} attempts"
    last_error_detail = f" | Detail: {last_error.detail}" if isinstance(last_error, AIGenerationError) and last_error.detail else ""
    logger.error(f"{error_msg}. Last error: {last_error}{last_error_detail}")
    raise AIGenerationError(
        error_msg,
        detail=f"{last_error}{last_error_detail}"
    )
