from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.schemas.ai import AIStrategyResponse, AILetterResponse, AIHistoryResponse
from app.schemas.response import ApiResponse
from app.services.ai_service import AIService
from pydantic import BaseModel
from typing import Optional, List, Any

router = APIRouter(prefix="/ai", tags=["Gemini AI Integration"])

class LetterRequest(BaseModel):
    lender_name: Optional[str] = None

@router.post("/strategy", response_model=ApiResponse[AIStrategyResponse])
def generate_strategy(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Generate debt negotiation strategy and financial advice for the current user.
    """
    result = AIService.generate_strategy(db, current_user.user_id)
    return ApiResponse(
        success=True,
        message="Negotiation strategy and financial advice generated successfully",
        data=result
    )

@router.post("/letter", response_model=ApiResponse[AILetterResponse])
def generate_letter(
    request: LetterRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Draft a formal debt settlement offer letter for a specific lender or general lenders.
    """
    result = AIService.generate_letter(db, current_user.user_id, request.lender_name)
    return ApiResponse(
        success=True,
        message="Settlement offer letter drafted successfully",
        data=result
    )

@router.get("/history", response_model=ApiResponse[List[AIHistoryResponse]])
def get_ai_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Fetch the AI interaction history for the authenticated user.
    """
    history = AIService.get_history(db, current_user.user_id)
    return ApiResponse(
        success=True,
        message="AI interaction history fetched successfully",
        data=history
    )
