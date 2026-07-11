from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.schemas.loan import LoanCreate, LoanUpdate, LoanResponse
from app.schemas.response import ApiResponse
from app.services.loan_service import LoanService
from typing import List, Any

router = APIRouter(prefix="/loans", tags=["Loans"])

@router.post("", response_model=ApiResponse[LoanResponse], status_code=status.HTTP_201_CREATED)
def create_loan(
    loan_in: LoanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Create a new loan record for the authenticated user."""
    loan = LoanService.create_loan(db, loan_in, current_user.user_id)
    return ApiResponse(
        success=True,
        message="Loan record created successfully",
        data=LoanResponse.model_validate(loan)
    )

@router.get("", response_model=ApiResponse[List[LoanResponse]])
def get_loans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Retrieve all loan records for the authenticated user."""
    loans = LoanService.get_loans_by_user(db, current_user.user_id)
    return ApiResponse(
        success=True,
        message="Loan records fetched successfully",
        data=[LoanResponse.model_validate(l) for l in loans]
    )

@router.get("/{loan_id}", response_model=ApiResponse[LoanResponse])
def get_loan(
    loan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Retrieve details of a specific loan record."""
    loan = LoanService.get_loan_by_id(db, loan_id, current_user.user_id)
    return ApiResponse(
        success=True,
        message="Loan record details fetched successfully",
        data=LoanResponse.model_validate(loan)
    )

@router.put("/{loan_id}", response_model=ApiResponse[LoanResponse])
def update_loan(
    loan_id: int,
    loan_in: LoanUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Update a specific loan record."""
    loan = LoanService.update_loan(db, loan_id, loan_in, current_user.user_id)
    return ApiResponse(
        success=True,
        message="Loan record updated successfully",
        data=LoanResponse.model_validate(loan)
    )

@router.delete("/{loan_id}", response_model=ApiResponse[None])
def delete_loan(
    loan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Delete a specific loan record."""
    LoanService.delete_loan(db, loan_id, current_user.user_id)
    return ApiResponse(
        success=True,
        message="Loan record deleted successfully",
        data=None
    )
