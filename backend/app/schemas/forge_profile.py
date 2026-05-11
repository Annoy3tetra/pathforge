from typing import Any, List, Optional

from pydantic import BaseModel, Field, field_validator


SKILL_LEVELS = {"beginner", "intermediate", "advanced"}
LEARNING_STYLES = {"visual", "reading", "hands-on", "video", "mixed"}
MOTIVATION_TYPES = {"career", "curiosity", "portfolio", "grades", "startup", "discipline"}
PROJECT_TYPES = {"web-app", "mobile-app", "ai-project", "data-project", "automation", "research", "open-source"}
RESOURCE_FORMATS = {"video", "article", "course", "docs", "project", "mixed"}
TIMELINES = {"1-month", "3-months", "6-months", "12-months", "flexible"}


class ForgeProfileBase(BaseModel):
    current_skill_level: Optional[str] = None
    career_goal: Optional[str] = None
    preferred_domains: Optional[List[str]] = Field(default_factory=list)
    weekly_study_hours: Optional[float] = None
    preferred_learning_style: Optional[str] = None
    biggest_learning_struggle: Optional[str] = None
    motivation_type: Optional[str] = None
    preferred_project_type: Optional[str] = None
    confidence_level: Optional[int] = None
    target_timeline: Optional[str] = None
    preferred_resource_format: Optional[str] = None
    interests: Optional[List[str]] = Field(default_factory=list)
    current_focus: Optional[str] = None

    @field_validator("current_skill_level")
    @classmethod
    def validate_skill_level(cls, value):
        return _validate_choice(value, SKILL_LEVELS, "current_skill_level")

    @field_validator("preferred_learning_style")
    @classmethod
    def validate_learning_style(cls, value):
        return _validate_choice(value, LEARNING_STYLES, "preferred_learning_style")

    @field_validator("motivation_type")
    @classmethod
    def validate_motivation_type(cls, value):
        return _validate_choice(value, MOTIVATION_TYPES, "motivation_type")

    @field_validator("preferred_project_type")
    @classmethod
    def validate_project_type(cls, value):
        return _validate_choice(value, PROJECT_TYPES, "preferred_project_type")

    @field_validator("preferred_resource_format")
    @classmethod
    def validate_resource_format(cls, value):
        return _validate_choice(value, RESOURCE_FORMATS, "preferred_resource_format")

    @field_validator("target_timeline")
    @classmethod
    def validate_timeline(cls, value):
        return _validate_choice(value, TIMELINES, "target_timeline")

    @field_validator("weekly_study_hours")
    @classmethod
    def validate_hours(cls, value):
        if value is not None and (value < 1 or value > 80):
            raise ValueError("weekly_study_hours must be between 1 and 80")
        return value

    @field_validator("confidence_level")
    @classmethod
    def validate_confidence(cls, value):
        if value is not None and (value < 1 or value > 10):
            raise ValueError("confidence_level must be between 1 and 10")
        return value

    @field_validator("preferred_domains", "interests")
    @classmethod
    def normalize_lists(cls, value):
        if not value:
            return []
        cleaned = []
        for item in value[:12]:
            text = str(item).strip()
            if text and text not in cleaned:
                cleaned.append(text)
        return cleaned


class ForgeProfileCreate(ForgeProfileBase):
    pass


class ForgeProfileUpdate(ForgeProfileBase):
    pass


class ForgeProfileResponse(ForgeProfileBase):
    id: int
    user_id: int
    completion_percent: int = 0

    class Config:
        from_attributes = True


class ForgeProfileAnalysis(BaseModel):
    completion_percent: int
    readiness_score: int
    pace_label: str
    student_archetype: str
    learning_strengths: List[str]
    growth_risks: List[str]
    missing_fields: List[str]
    personalization_summary: str


class ForgeRecommendations(BaseModel):
    analysis: ForgeProfileAnalysis
    roadmap_suggestions: List[str]
    skill_suggestions: List[str]
    project_suggestions: List[str]
    learning_tracks: List[str]
    recommended_next_steps: List[str]
    learning_pace_suggestions: List[str]
    suggested_domains: List[str]
    growth_insights: List[str]
    learning_strengths: List[str]
    source: str = "fallback"


def _validate_choice(value: Optional[str], allowed: set[str], field_name: str):
    if value is None or value == "":
        return None
    normalized = value.lower().strip()
    if normalized not in allowed:
        raise ValueError(f"{field_name} must be one of: {', '.join(sorted(allowed))}")
    return normalized
