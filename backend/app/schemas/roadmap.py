from pydantic import BaseModel
from typing import List, Optional


class MilestoneCreate(BaseModel):
    title: str
    description: Optional[str] = None
    estimated_days: int


class RoadmapCreate(BaseModel):
    title: str
    description: Optional[str] = None
    milestones: List[MilestoneCreate]