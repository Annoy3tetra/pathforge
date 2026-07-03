from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from fastapi.security import (
    OAuth2PasswordRequestForm
)

from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User

from app.schemas.user import (
    UserRegister,
    TokenResponse
)

from app.core.security import (
    hash_password,
    verify_password
)

from app.core.jwt_handler import (
    create_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register_user(
    user: UserRegister,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully"
    }


@router.post(
    "/login",
    response_model=TokenResponse
)
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    valid_password = verify_password(
        form_data.password,
        existing_user.password
    )

    if not valid_password:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={
            "sub": existing_user.email
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


from pydantic import BaseModel
from jose import JWTError, jwt
from datetime import datetime, timedelta
from app.core.config import settings

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

@router.post("/forgot-password")
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        # Avoid user enumeration by returning generic success message
        return {"message": "If this email is registered, a password reset link has been sent."}

    # Generate a 15-minute token
    expire = datetime.utcnow() + timedelta(minutes=15)
    payload = {
        "sub": user.email,
        "exp": expire,
        "type": "reset"
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    # Simulated email sending - printed to logs
    reset_url = f"https://pathforge-roan-tau.vercel.app/reset-password?token={token}"
    local_reset_url = f"http://localhost:5173/reset-password?token={token}"
    
    print("\n" + "="*80)
    print("PASSWORD RESET REQUEST")
    print(f"User: {user.email}")
    print(f"Production URL: {reset_url}")
    print(f"Local Dev URL:   {local_reset_url}")
    print("="*80 + "\n", flush=True)

    return {"message": "If this email is registered, a password reset link has been sent."}


@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(data.token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = payload.get("sub")
        token_type = payload.get("type")
        if not email or token_type != "reset":
            raise HTTPException(status_code=400, detail="Invalid token type or payload")
    except JWTError:
        raise HTTPException(status_code=400, detail="Token is invalid or has expired")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password = hash_password(data.new_password)
    db.commit()

    return {"message": "Password has been reset successfully."}


from app.api.deps import get_current_user

@router.delete("/account")
def delete_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db.delete(current_user)
    db.commit()
    return {"message": "Account deleted successfully."}