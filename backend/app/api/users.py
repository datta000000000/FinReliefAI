from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.schemas.response import ApiResponse
from app.services.user_service import UserService
from typing import Any

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=ApiResponse[UserResponse])
def get_me(current_user: User = Depends(get_current_user)) -> Any:
    """Retrieve details of the currently authenticated user."""
    return ApiResponse(
        success=True,
        message="Current user profile fetched successfully",
        data=UserResponse.model_validate(current_user)
    )

@router.put("/me", response_model=ApiResponse[UserResponse])
def update_me(
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Update profile details of the currently authenticated user."""
    updated_user = UserService.update_user(db, current_user, user_in)
    return ApiResponse(
        success=True,
        message="Profile updated successfully",
        data=UserResponse.model_validate(updated_user)
    )

@router.delete("/me", response_model=ApiResponse[None])
def delete_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Delete the account of the currently authenticated user."""
    UserService.delete_user(db, current_user.user_id)
    return ApiResponse(
        success=True,
        message="User account deleted successfully",
        data=None
    )
