from fastapi import (
    APIRouter,
    Depends
)
from sqlalchemy.orm import Session

from app.db.session import get_db

from app.models.user import User
from app.models.roadmap import Roadmap
from app.models.milestone import Milestone

from app.schemas.roadmap import (
    RoadmapCreate
)

from app.api.deps import (
    get_current_user
)

router = APIRouter(
    prefix="/roadmaps",
    tags=["Roadmaps"]
)


@router.post("/")
def create_roadmap(
    roadmap: RoadmapCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_roadmap = Roadmap(
        title=roadmap.title,
        description=roadmap.description,
        owner_id=current_user.id
    )

    db.add(new_roadmap)
    db.commit()
    db.refresh(new_roadmap)

    for milestone in roadmap.milestones:
        new_milestone = Milestone(
            title=milestone.title,
            description=milestone.description,
            estimated_days=milestone.estimated_days,
            roadmap_id=new_roadmap.id
        )

        db.add(new_milestone)

    db.commit()

    return {
        "message": "Roadmap created successfully"
    }


@router.get("/")
def get_user_roadmaps(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    roadmaps = db.query(Roadmap).filter(
        Roadmap.owner_id == current_user.id
    ).all()

    return roadmaps