from app.models.forge_profile import ForgeProfile


PROFILE_FIELDS = [
    "current_skill_level",
    "career_goal",
    "preferred_domains",
    "weekly_study_hours",
    "preferred_learning_style",
    "biggest_learning_struggle",
    "motivation_type",
    "preferred_project_type",
    "confidence_level",
    "target_timeline",
    "preferred_resource_format",
    "interests",
    "current_focus",
]


def forge_profile_to_dict(profile: ForgeProfile | None) -> dict:
    if not profile:
        return {}

    return {
        field: getattr(profile, field)
        for field in PROFILE_FIELDS
        if getattr(profile, field) not in (None, "", [])
    }


def calculate_completion(profile: ForgeProfile | None) -> int:
    if not profile:
        return 0

    answered = sum(1 for field in PROFILE_FIELDS if getattr(profile, field) not in (None, "", []))
    return round((answered / len(PROFILE_FIELDS)) * 100)


def analyze_forge_profile(profile: ForgeProfile | None) -> dict:
    data = forge_profile_to_dict(profile)
    completion = calculate_completion(profile)
    hours = data.get("weekly_study_hours") or 0
    confidence = data.get("confidence_level") or 5
    skill = data.get("current_skill_level") or "beginner"
    domains = data.get("preferred_domains") or []
    interests = data.get("interests") or []
    struggle = data.get("biggest_learning_struggle")

    readiness_score = min(100, round((completion * 0.55) + (min(hours, 25) * 1.2) + (confidence * 2)))
    pace_label = "steady"
    if hours >= 15 and confidence >= 7:
        pace_label = "accelerated"
    elif hours <= 5 or confidence <= 4:
        pace_label = "gentle"

    if skill == "advanced":
        archetype = "builder ready for specialization"
    elif "portfolio" == data.get("motivation_type") or data.get("preferred_project_type"):
        archetype = "project-driven learner"
    elif struggle:
        archetype = "guided improver"
    else:
        archetype = "explorer building foundations"

    strengths = []
    if domains:
        strengths.append(f"Clear domain pull toward {', '.join(domains[:2])}.")
    if hours >= 8:
        strengths.append(f"Consistent weekly capacity of {hours:g} hours.")
    if data.get("preferred_learning_style"):
        strengths.append(f"Knows a preferred learning mode: {data['preferred_learning_style']}.")
    if interests:
        strengths.append(f"Interest anchors: {', '.join(interests[:3])}.")
    if not strengths:
        strengths.append("Early-stage curiosity that can still be shaped intentionally.")

    risks = []
    if hours < 5:
        risks.append("Limited weekly study time means milestones should stay small and concrete.")
    if confidence <= 4:
        risks.append("Low confidence suggests quick wins and visible progress should come first.")
    if struggle:
        risks.append(f"Primary friction to design around: {struggle}.")
    if not data.get("career_goal"):
        risks.append("Career direction is not yet explicit, so recommendations should preserve exploration.")

    missing = [field for field in PROFILE_FIELDS if field not in data]
    summary_goal = data.get("career_goal") or "a clearer student growth direction"
    summary = (
        f"This student is a {skill} learner aiming for {summary_goal}. "
        f"They should follow a {pace_label} plan with practical checkpoints."
    )

    return {
        "completion_percent": completion,
        "readiness_score": readiness_score,
        "pace_label": pace_label,
        "student_archetype": archetype,
        "learning_strengths": strengths,
        "growth_risks": risks,
        "missing_fields": missing,
        "personalization_summary": summary,
    }
