from sqlalchemy.orm import Session
from app.models.user_profile import UserProfile


def get_profile_by_user_id(db: Session, user_id: int):
    """Get profile for a given user, or None."""
    return db.query(UserProfile).filter(
        UserProfile.user_id == user_id
    ).first()


def create_profile(db: Session, user_id: int, data: dict):
    """Create a new profile for a user."""
    profile = UserProfile(
        user_id=user_id,
        **data
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def update_profile(db: Session, profile: UserProfile, data: dict):
    """Update an existing profile with partial data."""
    for key, value in data.items():
        if value is not None:
            setattr(profile, key, value)
    db.commit()
    db.refresh(profile)
    return profile
