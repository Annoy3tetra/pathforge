from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    ForeignKey,
    ARRAY
)
from sqlalchemy.orm import relationship

from app.db.database import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    # Personal
    display_name = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    profile_image = Column(String, nullable=True)
    banner_image = Column(String, nullable=True)

    # Education
    education_level = Column(String, nullable=True)
    college_name = Column(String, nullable=True)
    field_of_study = Column(String, nullable=True)
    current_year = Column(Integer, nullable=True)

    # Learning
    skill_level = Column(String, nullable=True)
    career_goal = Column(String, nullable=True)
    interests = Column(ARRAY(String), default=[])
    hobbies = Column(ARRAY(String), default=[])
    weekly_study_hours = Column(Float, nullable=True)
    preferred_learning_style = Column(String, nullable=True)

    # Social Links
    github_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)

    # Relationship
    user = relationship(
        "User",
        back_populates="profile"
    )
