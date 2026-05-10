from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
import os
import uuid

from app.db.session import get_db
from app.models.user import User
from app.api.deps import get_current_user

from app.schemas.profile import (
    ProfileCreate,
    ProfileUpdate,
    ProfileResponse
)

from app.services.profile_service import (
    get_profile_by_user_id,
    create_profile,
    update_profile
)

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


@router.post("/image")
async def upload_profile_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validate file type
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, and WebP images are allowed.")
    
    # Read file content for size validation
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:  # 5MB
        raise HTTPException(status_code=400, detail="Image must be smaller than 5MB.")
    
    # Generate unique filename
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"{uuid.uuid4().hex}.{ext}"
    file_path = os.path.join("uploads", "profile_images", filename)
    
    # Save file
    with open(file_path, "wb") as f:
        f.write(content)
        
    url_path = f"/uploads/profile_images/{filename}"
    
    # Update profile if it exists (so they can upload straight from the dashboard if they want later)
    profile = get_profile_by_user_id(db, current_user.id)
    if profile:
        # We could delete the old image here, but for simplicity we'll just update the URL.
        profile.profile_image = url_path
        db.commit()
        
    return {"url": url_path}

@router.get("/me")
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = get_profile_by_user_id(db, current_user.id)
    return profile


@router.post("", response_model=ProfileResponse)
def create_my_profile(
    data: ProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = get_profile_by_user_id(db, current_user.id)

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Profile already exists. Use PUT to update."
        )

    profile = create_profile(
        db,
        current_user.id,
        data.model_dump(exclude_unset=True)
    )

    return profile


@router.put("/me", response_model=ProfileResponse)
def update_my_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = get_profile_by_user_id(db, current_user.id)

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found. Create one first."
        )

    updated = update_profile(
        db,
        profile,
        data.model_dump(exclude_unset=True)
    )
    return updated

from app.models.roadmap import Roadmap
from app.services.insights_service import generate_insights

@router.get("/insights")
def get_my_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile_model = get_profile_by_user_id(db, current_user.id)
    profile_dict = None
    if profile_model:
        profile_dict = {
            k: v for k, v in profile_model.__dict__.items()
            if not k.startswith("_") and v is not None
        }

    roadmaps = db.query(Roadmap).filter(
        Roadmap.owner_id == current_user.id
    ).all()

    insights = generate_insights(roadmaps, profile_dict)
    return insights
