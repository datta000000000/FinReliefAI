from sqlalchemy.orm import Session, joinedload
from app.models.financial_profile import FinancialProfile
from app.models.loan import Loan
from app.models.settlement import SettlementRecord
from app.calculations.financial_health import (
    calculate_monthly_surplus,
    calculate_emi_ratio,
    calculate_dti_ratio,
    calculate_health_score,
    calculate_stress_level,
)
from app.calculations.loan_priority import (
    calculate_priority_score,
    classify_priority_level,
    generate_settlement_recommendation,
)
from app.schemas.settlement import (
    SettlementAnalysisResponse,
    PrioritizedLoanResponse,
    SettlementHistoryResponse,
)
from fastapi import HTTPException, status

class SettlementService:
    @staticmethod
    def generate_analysis(db: Session, user_id: int) -> SettlementAnalysisResponse:
        """
        Retrieves user financial data, calculates loan priorities and settlement
        recommendations, updates the database, and returns the sorted prioritized analysis.
        """
        # 1. Fetch financial profile
        profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Financial profile not found. Please create your financial profile first."
            )

        # 2. Fetch all user loans
        loans = db.query(Loan).filter(Loan.user_id == user_id).all()
        if not loans:
            # Return empty analysis if there are no loans
            return SettlementAnalysisResponse(
                financial_health_score=100.0,
                stress_level="Low",
                loans=[]
            )

        # 3. Calculate health metrics directly using calculation functions (loosely coupled)
        total_monthly_emi = sum(loan.emi for loan in loans)
        total_outstanding_debt = sum(loan.outstanding_amount for loan in loans)
        
        income = profile.monthly_income
        expenses = profile.monthly_expenses
        
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

        # 4. Generate recommendations for each loan and store/update in DB
        prioritized_loans = []
        for loan in loans:
            priority_score = calculate_priority_score(
                overdue_months=loan.overdue_months,
                interest_rate=loan.interest_rate,
                outstanding_amount=loan.outstanding_amount,
                emi=loan.emi
            )
            priority_level = classify_priority_level(priority_score)
            
            rec_pct, rec_amount, reason = generate_settlement_recommendation(
                outstanding_amount=loan.outstanding_amount,
                health_score=health_score,
                priority_score=priority_score,
                monthly_surplus=monthly_surplus
            )
            
            # Save or update in the database to prevent duplicates
            settlement_rec = db.query(SettlementRecord).filter(
                SettlementRecord.user_id == user_id,
                SettlementRecord.loan_id == loan.loan_id
            ).first()
            
            prediction_str = f"Recommended - {rec_pct}%"
            
            if settlement_rec:
                # Update existing record
                settlement_rec.settlement_prediction = prediction_str
                settlement_rec.recommended_amount = rec_amount
                settlement_rec.priority_level = priority_level
            else:
                # Create new record
                settlement_rec = SettlementRecord(
                    user_id=user_id,
                    loan_id=loan.loan_id,
                    settlement_prediction=prediction_str,
                    recommended_amount=rec_amount,
                    priority_level=priority_level
                )
                db.add(settlement_rec)
                
            prioritized_loans.append(
                PrioritizedLoanResponse(
                    loan_id=loan.loan_id,
                    loan_type=loan.loan_type,
                    lender_name=loan.lender_name,
                    outstanding_amount=loan.outstanding_amount,
                    priority_score=priority_score,
                    priority_level=priority_level,
                    recommended_settlement_pct=rec_pct,
                    recommended_amount=rec_amount,
                    reason=reason
                )
            )
            
        # Commit the updates/inserts to the DB
        db.commit()

        # Sort prioritized loans by priority score from highest to lowest
        prioritized_loans.sort(key=lambda x: x.priority_score, reverse=True)

        return SettlementAnalysisResponse(
            financial_health_score=health_score,
            stress_level=stress_level,
            loans=prioritized_loans
        )

    @staticmethod
    def get_settlement_history(db: Session, user_id: int) -> list[SettlementHistoryResponse]:
        """
        Fetches all previous settlement records saved for the user.
        """
        # Fetch past records joining with Loan to display lender name and outstanding amount
        records = db.query(SettlementRecord).filter(
            SettlementRecord.user_id == user_id
        ).options(joinedload(SettlementRecord.loan)).all()
        
        history = []
        for rec in records:
            history.append(
                SettlementHistoryResponse(
                    settlement_id=rec.settlement_id,
                    loan_id=rec.loan_id,
                    lender_name=rec.loan.lender_name if rec.loan else "Unknown",
                    outstanding_amount=rec.loan.outstanding_amount if rec.loan else 0.0,
                    settlement_prediction=rec.settlement_prediction or "No prediction",
                    recommended_amount=rec.recommended_amount or 0.0,
                    priority_level=rec.priority_level or "Low",
                    created_at=rec.created_at
                )
            )
        return history
