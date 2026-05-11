from sqlalchemy import Column, Float, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import relationship

from app.db.database import Base


class ForgeProfile(Base):
    __tablename__ = "forge_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    current_skill_level = Column(String, nullable=True)
    career_goal = Column(String, nullable=True)
    preferred_domains = Column(JSON, default=list)
    weekly_study_hours = Column(Float, nullable=True)
    preferred_learning_style = Column(String, nullable=True)
    biggest_learning_struggle = Column(String, nullable=True)
    motivation_type = Column(String, nullable=True)
    preferred_project_type = Column(String, nullable=True)
    confidence_level = Column(Integer, nullable=True)
    target_timeline = Column(String, nullable=True)
    preferred_resource_format = Column(String, nullable=True)
    interests = Column(JSON, default=list)
    current_focus = Column(String, nullable=True)

    user = relationship("User", back_populates="forge_profile")
