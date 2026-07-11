from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.schemas.settlement import SettlementAnalysisResponse, SettlementHistoryResponse
from app.schemas.response import ApiResponse
from app.services.settlement_service import SettlementService
from typing import List, Any

router = APIRouter(prefix="/settlement", tags=["Settlements & Priorities"])

@router.get("", response_model=ApiResponse[SettlementAnalysisResponse])
def get_settlement_analysis(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Generate prioritized loan listings and settlement recommendations for the authenticated user.
    """
    analysis = SettlementService.generate_analysis(db, current_user.user_id)
    return ApiResponse(
        success=True,
        message="Financial settlement analysis generated successfully",
        data=analysis
    )

@router.get("/history", response_model=ApiResponse[List[SettlementHistoryResponse]])
def get_settlement_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Retrieve stored past settlement recommendations for the authenticated user.
    """
    history = SettlementService.get_settlement_history(db, current_user.user_id)
    return ApiResponse(
        success=True,
        message="Settlement recommendation history fetched successfully",
        data=history
    )
