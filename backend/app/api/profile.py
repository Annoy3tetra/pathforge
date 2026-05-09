from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

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


@router.get("/me", response_model=ProfileResponse)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = get_profile_by_user_id(db, current_user.id)

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Profile not found. Create one first."
        )

    return profile


@router.post("/", response_model=ProfileResponse)
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
