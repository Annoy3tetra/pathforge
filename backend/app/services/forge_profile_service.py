from sqlalchemy.orm import Session

from app.models.forge_profile import ForgeProfile


def get_forge_profile_by_user_id(db: Session, user_id: int):
    return db.query(ForgeProfile).filter(ForgeProfile.user_id == user_id).first()


def create_forge_profile(db: Session, user_id: int, data: dict):
    profile = ForgeProfile(user_id=user_id, **data)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


def update_forge_profile(db: Session, profile: ForgeProfile, data: dict):
    for key, value in data.items():
        setattr(profile, key, value)
    db.commit()
    db.refresh(profile)
    return profile
