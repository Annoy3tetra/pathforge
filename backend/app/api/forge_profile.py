from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.forge_profile import (
    ForgeProfileAnalysis,
    ForgeProfileCreate,
    ForgeProfileResponse,
    ForgeProfileUpdate,
    ForgeRecommendations,
)
from app.services.forge_profile_service import (
    create_forge_profile,
    get_forge_profile_by_user_id,
    update_forge_profile,
)
from app.services.profile_analysis_service import analyze_forge_profile, calculate_completion
from app.services.recommendation_service import get_personalized_recommendations

router = APIRouter(prefix="/forge-profile", tags=["ForgeProfile"])
recommendation_router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("/me", response_model=ForgeProfileResponse | None)
def get_my_forge_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = get_forge_profile_by_user_id(db, current_user.id)
    if profile:
        profile.completion_percent = calculate_completion(profile)
    return profile


@router.post("", response_model=ForgeProfileResponse)
def create_my_forge_profile(
    data: ForgeProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = get_forge_profile_by_user_id(db, current_user.id)
    if existing:
        raise HTTPException(status_code=409, detail="ForgeProfile already exists. Use PUT to update.")

    profile = create_forge_profile(db, current_user.id, data.model_dump(exclude_unset=True))
    profile.completion_percent = calculate_completion(profile)
    return profile


@router.put("/me", response_model=ForgeProfileResponse)
def update_my_forge_profile(
    data: ForgeProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = get_forge_profile_by_user_id(db, current_user.id)
    payload = data.model_dump(exclude_unset=True)

    if not profile:
        profile = create_forge_profile(db, current_user.id, payload)
    else:
        profile = update_forge_profile(db, profile, payload)

    profile.completion_percent = calculate_completion(profile)
    return profile


@router.get("/analysis", response_model=ForgeProfileAnalysis)
def analyze_my_forge_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = get_forge_profile_by_user_id(db, current_user.id)
    return analyze_forge_profile(profile)


@recommendation_router.get("/me", response_model=ForgeRecommendations)
def get_my_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = get_forge_profile_by_user_id(db, current_user.id)
    return get_personalized_recommendations(profile)
