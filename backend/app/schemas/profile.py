from pydantic import BaseModel, field_validator, HttpUrl
from typing import List, Optional


class ProfileCreate(BaseModel):
    display_name: Optional[str] = None
    bio: Optional[str] = None
    profile_image: Optional[str] = None

    education_level: Optional[str] = None
    college_name: Optional[str] = None
    field_of_study: Optional[str] = None
    current_year: Optional[int] = None

    skill_level: Optional[str] = None
    career_goal: Optional[str] = None
    interests: Optional[List[str]] = []
    hobbies: Optional[List[str]] = []
    weekly_study_hours: Optional[float] = None
    preferred_learning_style: Optional[str] = None

    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None

    @field_validator("current_year")
    @classmethod
    def validate_year(cls, v):
        if v is not None and (v < 1 or v > 8):
            raise ValueError("current_year must be between 1 and 8")
        return v

    @field_validator("weekly_study_hours")
    @classmethod
    def validate_hours(cls, v):
        if v is not None and (v < 0 or v > 168):
            raise ValueError("weekly_study_hours must be between 0 and 168")
        return v

    @field_validator("skill_level")
    @classmethod
    def validate_skill(cls, v):
        allowed = {"beginner", "intermediate", "advanced"}
        if v is not None and v.lower() not in allowed:
            raise ValueError(f"skill_level must be one of: {', '.join(allowed)}")
        return v.lower() if v else v

    @field_validator("preferred_learning_style")
    @classmethod
    def validate_style(cls, v):
        allowed = {"visual", "reading", "hands-on", "video", "mixed"}
        if v is not None and v.lower() not in allowed:
            raise ValueError(f"preferred_learning_style must be one of: {', '.join(allowed)}")
        return v.lower() if v else v

    @field_validator("github_url", "linkedin_url", "portfolio_url")
    @classmethod
    def validate_urls(cls, v):
        if v is not None and v.strip():
            if not v.startswith(("http://", "https://")):
                raise ValueError("URL must start with http:// or https://")
        return v


class ProfileUpdate(ProfileCreate):
    """Same fields, all optional — reuse validation."""
    pass


class ProfileResponse(BaseModel):
    id: int
    user_id: int

    display_name: Optional[str]
    bio: Optional[str]
    profile_image: Optional[str]

    education_level: Optional[str]
    college_name: Optional[str]
    field_of_study: Optional[str]
    current_year: Optional[int]

    skill_level: Optional[str]
    career_goal: Optional[str]
    interests: Optional[List[str]]
    hobbies: Optional[List[str]]
    weekly_study_hours: Optional[float]
    preferred_learning_style: Optional[str]

    github_url: Optional[str]
    linkedin_url: Optional[str]
    portfolio_url: Optional[str]

    class Config:
        from_attributes = True
