from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session
from sqlalchemy.sql import func

from app.db.session import get_db

from app.models.user import User
from app.models.roadmap import Roadmap
from app.models.milestone import Milestone
from app.models.resource import Resource

from app.schemas.roadmap import (
    RoadmapCreate,
    RoadmapResponse,
    RoadmapUpdate,
    MilestoneUpdate,
    MilestoneAdd,
    MilestoneResponse
)

from app.api.deps import (
    get_current_user
)

from app.services.roadmap_service import (
    calculate_progress,
    roadmap_status
)

from app.schemas.roadmap import GoalInput
from app.services.ai_service import generate_roadmap, AIGenerationError
from app.services.feedback_service import evaluate_pace
from app.services.analytics_service import compute_analytics

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
    milestone.completed_at = func.now()

    db.commit()

    progress = calculate_progress(roadmap)

    status = roadmap_status(progress)

    return {
        "message": "Milestone completed",
        "progress": progress,
        "status": status
    }


@router.delete("/{roadmap_id}")
def delete_roadmap(
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

    db.delete(roadmap)
    db.commit()

    return {
        "message": "Roadmap deleted successfully"
    }


@router.put("/{roadmap_id}")
def update_roadmap(
    roadmap_id: int,
    updates: RoadmapUpdate,
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

    if updates.title is not None:
        roadmap.title = updates.title
    if updates.description is not None:
        roadmap.description = updates.description

    db.commit()
    db.refresh(roadmap)

    return {
        "message": "Roadmap updated successfully"
    }


@router.put("/milestones/{milestone_id}")
def update_milestone(
    milestone_id: int,
    updates: MilestoneUpdate,
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

    if updates.title is not None:
        milestone.title = updates.title
    if updates.description is not None:
        milestone.description = updates.description
    if updates.estimated_days is not None:
        milestone.estimated_days = updates.estimated_days

    db.commit()

    return {
        "message": "Milestone updated successfully"
    }


@router.delete("/milestones/{milestone_id}")
def delete_milestone(
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

    db.delete(milestone)
    db.commit()

    return {
        "message": "Milestone deleted successfully"
    }


@router.post("/{roadmap_id}/milestones", response_model=MilestoneResponse)
def add_milestone(
    roadmap_id: int,
    milestone_data: MilestoneAdd,
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

    new_milestone = Milestone(
        title=milestone_data.title,
        description=milestone_data.description,
        estimated_days=milestone_data.estimated_days,
        roadmap_id=roadmap_id
    )

    db.add(new_milestone)
    db.commit()
    db.refresh(new_milestone)

    return new_milestone

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

@router.get("/{roadmap_id}/feedback")
def get_roadmap_feedback(
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

    feedback = evaluate_pace(roadmap)

    return feedback

@router.get("/{roadmap_id}/analytics")
def get_roadmap_analytics(
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

    analytics = compute_analytics(roadmap)

    return analytics

@router.post("/generate")
def generate_ai_roadmap(
    goal_input: GoalInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        roadmap_data = generate_roadmap(
            goal_input.goal
        )
    except AIGenerationError as e:
        raise HTTPException(
            status_code=502,
            detail={
                "error": e.message,
                "detail": e.detail,
                "retryable": True
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "error": "An unexpected error occurred during generation",
                "detail": str(e),
                "retryable": True
            }
        )

    new_roadmap = Roadmap(
        title=roadmap_data["title"],
        description=roadmap_data["description"],
        owner_id=current_user.id
    )

    db.add(new_roadmap)
    db.commit()
    db.refresh(new_roadmap)

    for milestone in roadmap_data["milestones"]:
        new_milestone = Milestone(
            title=milestone["title"],
            description=milestone["description"],
            estimated_days=milestone["estimated_days"],
            roadmap_id=new_roadmap.id
        )

        db.add(new_milestone)
        db.commit()
        db.refresh(new_milestone)

        for res in milestone.get("resources", []):
            new_resource = Resource(
                title=res["title"],
                url=res["url"],
                type=res["type"],
                difficulty=res.get("difficulty"),
                milestone_id=new_milestone.id
            )
            db.add(new_resource)

    db.commit()

    return {
        "message": "AI roadmap generated",
        "roadmap_id": new_roadmap.id
    }