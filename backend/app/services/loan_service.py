from typing import List
from sqlalchemy.orm import Session
from app.models.loan import Loan
from app.schemas.loan import LoanCreate, LoanUpdate
from fastapi import HTTPException, status

class LoanService:
    @staticmethod
    def get_loans_by_user(db: Session, user_id: int) -> List[Loan]:
        """Fetch all loans for a specific user."""
        return db.query(Loan).filter(Loan.user_id == user_id).all()

    @staticmethod
    def get_loan_by_id(db: Session, loan_id: int, user_id: int) -> Loan:
        """Fetch a specific loan by ID, ensuring ownership."""
        loan = db.query(Loan).filter(Loan.loan_id == loan_id, Loan.user_id == user_id).first()
        if not loan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Loan not found"
            )
        return loan

    @staticmethod
    def create_loan(db: Session, loan_in: LoanCreate, user_id: int) -> Loan:
        """Create a new loan linked to the authenticated user."""
        new_loan = Loan(
            user_id=user_id,
            loan_type=loan_in.loan_type,
            lender_name=loan_in.lender_name,
            loan_amount=loan_in.loan_amount,
            outstanding_amount=loan_in.outstanding_amount,
            interest_rate=loan_in.interest_rate,
            emi=loan_in.emi,
            overdue_months=loan_in.overdue_months,
            due_date=loan_in.due_date
        )
        db.add(new_loan)
        db.commit()
        db.refresh(new_loan)
        return new_loan

    @staticmethod
    def update_loan(db: Session, loan_id: int, loan_in: LoanUpdate, user_id: int) -> Loan:
        """Update a user's loan properties."""
        loan = LoanService.get_loan_by_id(db, loan_id, user_id)
        
        update_data = loan_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(loan, key, value)
            
        db.commit()
        db.refresh(loan)
        return loan

    @staticmethod
    def delete_loan(db: Session, loan_id: int, user_id: int) -> bool:
        """Delete a user's loan record."""
        loan = LoanService.get_loan_by_id(db, loan_id, user_id)
        db.delete(loan)
        db.commit()
        return True
