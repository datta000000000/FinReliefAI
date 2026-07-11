from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.schemas.financial_health import FinancialHealthResponse
from app.schemas.response import ApiResponse
from app.services.financial_health_service import FinancialHealthService
from typing import Any

router = APIRouter(prefix="/financial-health", tags=["Financial Health"])

@router.get("", response_model=ApiResponse[FinancialHealthResponse])
def get_financial_health(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Retrieve deterministic financial health analysis for the authenticated user.
    """
    health_data = FinancialHealthService.get_financial_health(db, current_user.user_id)
    return ApiResponse(
        success=True,
        message="Financial health analysis generated successfully",
        data=health_data
    )
