from sqlalchemy.orm import Session
from app.models.financial_profile import FinancialProfile
from app.models.loan import Loan
from app.calculations.financial_health import (
    calculate_monthly_surplus,
    calculate_emi_ratio,
    calculate_dti_ratio,
    calculate_health_score,
    calculate_stress_level,
)
from app.schemas.financial_health import FinancialHealthResponse
from fastapi import HTTPException, status

class FinancialHealthService:
    @staticmethod
    def get_financial_health(db: Session, user_id: int) -> FinancialHealthResponse:
        """
        Calculates all financial health metrics for a user.
        Raises HTTP 404 if the user's financial profile is missing.
        """
        # Fetch the financial profile
        profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Financial profile not found. Please create your financial profile first."
            )
            
        # Fetch all user loans
        loans = db.query(Loan).filter(Loan.user_id == user_id).all()
        
        # Calculate aggregates
        total_monthly_emi = sum(loan.emi for loan in loans)
        total_outstanding_debt = sum(loan.outstanding_amount for loan in loans)
        
        income = profile.monthly_income
        expenses = profile.monthly_expenses
        
        # Perform core health engine calculations
        monthly_surplus = calculate_monthly_surplus(income, expenses, total_monthly_emi)
        emi_ratio = calculate_emi_ratio(total_monthly_emi, income)
        dti_ratio = calculate_dti_ratio(total_outstanding_debt, income)
        
        health_score = calculate_health_score(
            emi_ratio=emi_ratio,
            dti_ratio=dti_ratio,
            monthly_surplus=monthly_surplus,
            total_outstanding_debt=total_outstanding_debt,
            income=income
        )
        
        stress_level = calculate_stress_level(health_score)
        
        return FinancialHealthResponse(
            total_monthly_emi=round(total_monthly_emi, 2),
            total_outstanding_debt=round(total_outstanding_debt, 2),
            monthly_surplus=round(monthly_surplus, 2),
            emi_ratio=round(emi_ratio, 2),
            dti_ratio=round(dti_ratio, 2),
            financial_health_score=health_score,
            stress_level=stress_level
        )
