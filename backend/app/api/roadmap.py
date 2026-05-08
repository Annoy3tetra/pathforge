from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.db.session import get_db

from app.models.user import User
from app.models.roadmap import Roadmap
from app.models.milestone import Milestone

from app.schemas.roadmap import (
    RoadmapCreate,
    RoadmapResponse
)

from app.api.deps import (
    get_current_user
)

from app.services.roadmap_service import (
    calculate_progress,
    roadmap_status
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


@router.get(
    "/",
    response_model=list[RoadmapResponse]
)
def get_user_roadmaps(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    roadmaps = db.query(Roadmap).filter(
        Roadmap.owner_id == current_user.id
    ).all()

    return roadmaps


@router.put("/milestones/{milestone_id}/complete")
def complete_milestone(
    milestone_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    milestone = db.query(Milestone).filter(
        Milestone.id == milestone_id
    ).first()

    if not milestone:
        raise HTTPException(
            status_code=404,
            detail="Milestone not found"
        )

    roadmap = db.query(Roadmap).filter(
        Roadmap.id == milestone.roadmap_id
    ).first()

    if roadmap.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Unauthorized"
        )

    milestone.completed = True

    db.commit()

    progress = calculate_progress(roadmap)

    status = roadmap_status(progress)

    return {
        "message": "Milestone completed",
        "progress": progress,
        "status": status
    }


@router.get("/{roadmap_id}/dashboard")
def roadmap_dashboard(
    roadmap_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    roadmap = db.query(Roadmap).filter(
        Roadmap.id == roadmap_id,
        Roadmap.owner_id == current_user.id
    ).first()

    if not roadmap:
        raise HTTPException(
            status_code=404,
            detail="Roadmap not found"
        )

    progress = calculate_progress(roadmap)

    status = roadmap_status(progress)

    completed_count = sum(
        milestone.completed
        for milestone in roadmap.milestones
    )

    return {
        "roadmap": roadmap.title,
        "progress": progress,
        "status": status,
        "completed_milestones": completed_count,
        "total_milestones": len(roadmap.milestones)
    }