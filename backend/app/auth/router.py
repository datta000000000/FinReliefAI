from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.user import UserCreate, UserResponse, UserLogin, Token
from app.schemas.response import ApiResponse
from app.services.user_service import UserService
from app.auth.security import create_access_token
from typing import Any

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=ApiResponse[UserResponse])
def register(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    """Register a new user account."""
    user = UserService.create_user(db, user_in)
    return ApiResponse(
        success=True,
        message="User registered successfully",
        data=UserResponse.model_validate(user)
    )

@router.post("/login", response_model=ApiResponse[Token])
def login(login_in: UserLogin, db: Session = Depends(get_db)) -> Any:
    """Authenticate and login using JSON request payload."""
    user = UserService.authenticate_user(db, login_in.email, login_in.password)
    access_token = create_access_token(subject=user.email)
    token_data = Token(access_token=access_token, token_type="bearer")
    return ApiResponse(
        success=True,
        message="Login successful",
        data=token_data
    )

@router.post("/swagger-login", response_model=Token)
def swagger_login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)) -> Any:
    """OAuth2 compatible authentication endpoint for Swagger UI login form."""
    user = UserService.authenticate_user(db, form_data.username, form_data.password)
    access_token = create_access_token(subject=user.email)
    return Token(access_token=access_token, token_type="bearer")
