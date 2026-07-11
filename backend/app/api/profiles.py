from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.schemas.financial_profile import FinancialProfileCreate, FinancialProfileUpdate, FinancialProfileResponse
from app.schemas.response import ApiResponse
from app.services.profile_service import ProfileService
from typing import Any

router = APIRouter(prefix="/profiles", tags=["Financial Profiles"])

@router.post("", response_model=ApiResponse[FinancialProfileResponse], status_code=status.HTTP_201_CREATED)
def create_profile(
    profile_in: FinancialProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Create a financial profile for the current user."""
    profile = ProfileService.create_profile(db, profile_in, current_user.user_id)
    return ApiResponse(
        success=True,
        message="Financial profile created successfully",
        data=FinancialProfileResponse.model_validate(profile)
    )

@router.get("", response_model=ApiResponse[FinancialProfileResponse])
def get_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Retrieve the financial profile for the current user."""
    profile = ProfileService.get_profile_by_user(db, current_user.user_id)
    return ApiResponse(
        success=True,
        message="Financial profile fetched successfully",
        data=FinancialProfileResponse.model_validate(profile)
    )

@router.put("", response_model=ApiResponse[FinancialProfileResponse])
def update_profile(
    profile_in: FinancialProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Update the financial profile for the current user."""
    profile = ProfileService.update_profile(db, profile_in, current_user.user_id)
    return ApiResponse(
        success=True,
        message="Financial profile updated successfully",
        data=FinancialProfileResponse.model_validate(profile)
    )

@router.delete("", response_model=ApiResponse[None])
def delete_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Delete the financial profile for the current user."""
    ProfileService.delete_profile(db, current_user.user_id)
    return ApiResponse(
        success=True,
        message="Financial profile deleted successfully",
        data=None
    )
