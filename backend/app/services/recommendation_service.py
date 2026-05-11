import json
import logging

from app.models.forge_profile import ForgeProfile
from app.services.ai_service import AIGenerationError, _call_groq, extract_json
from app.services.profile_analysis_service import analyze_forge_profile, forge_profile_to_dict

logger = logging.getLogger("pathforge.recommendations")


def get_personalized_recommendations(profile: ForgeProfile | None) -> dict:
    analysis = analyze_forge_profile(profile)
    profile_data = forge_profile_to_dict(profile)
    fallback = _fallback_recommendations(profile_data, analysis)

    if not profile_data:
        return fallback

    prompt = _build_recommendation_prompt(profile_data, analysis)

    try:
        raw = _call_groq(prompt)
        parsed = json.loads(extract_json(raw))
        return _validate_recommendations(parsed, analysis)
    except (AIGenerationError, json.JSONDecodeError, ValueError) as exc:
        logger.warning("Using fallback ForgeProfile recommendations: %s", exc)
        return fallback


def _build_recommendation_prompt(profile_data: dict, analysis: dict) -> str:
    return f"""
Return ONLY valid JSON. No markdown.

You are PathForge's ForgeProfile recommendation engine.
Use the student's structured profile to create specific, actionable guidance.
Avoid generic advice like "practice more" unless it is tied to their exact context.

Student ForgeProfile:
{json.dumps(profile_data, indent=2)}

Computed analysis:
{json.dumps(analysis, indent=2)}

Return this JSON shape:
{{
  "roadmap_suggestions": ["3-5 specific roadmap ideas"],
  "skill_suggestions": ["4-6 specific skills"],
  "project_suggestions": ["3-5 project ideas matched to their interests and project preference"],
  "learning_tracks": ["3 learning track names with short direction"],
  "recommended_next_steps": ["4-6 next actions for the next 7 days"],
  "learning_pace_suggestions": ["2-4 pacing suggestions based on weekly_study_hours and confidence_level"],
  "suggested_domains": ["3-6 domains"],
  "growth_insights": ["3-5 concise insights"],
  "learning_strengths": ["2-4 strengths inferred from the profile"]
}}
"""


def _validate_recommendations(data: dict, analysis: dict) -> dict:
    keys = [
        "roadmap_suggestions",
        "skill_suggestions",
        "project_suggestions",
        "learning_tracks",
        "recommended_next_steps",
        "learning_pace_suggestions",
        "suggested_domains",
        "growth_insights",
        "learning_strengths",
    ]
    cleaned = {"analysis": analysis, "source": "ai"}

    for key in keys:
        value = data.get(key)
        if not isinstance(value, list):
            raise ValueError(f"Missing list: {key}")
        cleaned[key] = [str(item).strip() for item in value if str(item).strip()][:6]
        if not cleaned[key]:
            raise ValueError(f"Empty list: {key}")

    return cleaned


def _fallback_recommendations(profile_data: dict, analysis: dict) -> dict:
    skill = profile_data.get("current_skill_level") or "beginner"
    goal = profile_data.get("career_goal") or "your target career"
    domains = profile_data.get("preferred_domains") or ["software fundamentals"]
    interests = profile_data.get("interests") or domains
    project_type = profile_data.get("preferred_project_type") or "portfolio project"
    resource = profile_data.get("preferred_resource_format") or profile_data.get("preferred_learning_style") or "mixed"
    hours = profile_data.get("weekly_study_hours") or 6

    primary_domain = domains[0]
    interest = interests[0]

    return {
        "analysis": analysis,
        "roadmap_suggestions": [
            f"{primary_domain.title()} foundations for {goal}",
            f"Portfolio-ready {project_type.replace('-', ' ')} roadmap",
            f"{skill.title()} to job-ready progression in {primary_domain}",
        ],
        "skill_suggestions": [
            f"Core {primary_domain} fundamentals",
            "Problem decomposition",
            "Project documentation",
            "Interview-ready communication",
        ],
        "project_suggestions": [
            f"Build a small {project_type.replace('-', ' ')} around {interest}",
            f"Create a weekly learning tracker for {primary_domain}",
            f"Ship a case-study project that demonstrates {goal}",
        ],
        "learning_tracks": [
            f"Foundation: close gaps in {primary_domain}",
            f"Build: apply concepts through a {project_type.replace('-', ' ')}",
            f"Signal: package work for {goal}",
        ],
        "recommended_next_steps": [
            f"Choose one {primary_domain} subtopic for this week.",
            f"Block {max(1, round(hours / 3))} focused sessions on your calendar.",
            f"Pick one {resource} resource and one hands-on task.",
            "Write a short progress note after each session.",
        ],
        "learning_pace_suggestions": [
            f"Use {round(hours)} hours/week as the budget and keep milestones under 3 sessions.",
            f"Follow a {analysis['pace_label']} pace with one review checkpoint every week.",
        ],
        "suggested_domains": domains[:6],
        "growth_insights": analysis["growth_risks"][:4] or [analysis["personalization_summary"]],
        "learning_strengths": analysis["learning_strengths"][:4],
        "source": "fallback",
    }
