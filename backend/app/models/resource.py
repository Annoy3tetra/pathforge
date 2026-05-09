from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)
from sqlalchemy.orm import relationship

from app.db.database import Base


class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    url = Column(String, nullable=False)

    type = Column(
        String,
        nullable=False,
        default="article"
    )

    difficulty = Column(
        String,
        nullable=True
    )

    milestone_id = Column(
        Integer,
        ForeignKey("milestones.id")
    )

    milestone = relationship(
        "Milestone",
        back_populates="resources"
    )
