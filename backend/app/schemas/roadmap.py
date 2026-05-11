from pydantic import BaseModel
from typing import List, Optional


class ResourceResponse(BaseModel):
    id: int
    title: str
    url: Optional[str]
    type: str
    difficulty: Optional[str]

    class Config:
        from_attributes = True


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
    resources: List[ResourceResponse] = []

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


class RoadmapUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


class MilestoneUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    estimated_days: Optional[int] = None


class MilestoneAdd(BaseModel):
    title: str
    description: Optional[str] = None
    estimated_days: int = 7
