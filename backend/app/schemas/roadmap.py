from pydantic import BaseModel
from typing import List, Optional


class MilestoneCreate(BaseModel):
    title: str
    description: Optional[str] = None
    estimated_days: int


class MilestoneResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    estimated_days: int
    completed: bool

    class Config:
        from_attributes = True


class RoadmapCreate(BaseModel):
    title: str
    description: Optional[str] = None
    milestones: List[MilestoneCreate]


class RoadmapResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    milestones: List[MilestoneResponse]

    class Config:
        from_attributes = True

class GoalInput(BaseModel):
    goal: str