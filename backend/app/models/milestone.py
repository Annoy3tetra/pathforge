from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    DateTime
)
from sqlalchemy.orm import relationship

from app.db.database import Base


class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    description = Column(String, nullable=True)

    estimated_days = Column(Integer)

    completed = Column(
        Boolean,
        default=False
    )

    completed_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    roadmap_id = Column(
        Integer,
        ForeignKey("roadmaps.id")
    )

    roadmap = relationship(
        "Roadmap",
        back_populates="milestones"
    )

    resources = relationship(
        "Resource",
        back_populates="milestone",
        cascade="all, delete"
    )