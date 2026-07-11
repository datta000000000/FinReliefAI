import json
from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.financial_profile import FinancialProfile
from app.models.loan import Loan
from app.models.user import User
from app.models.ai_history import AIHistory
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
from app.ai import (
    GeminiClient,
    build_negotiation_strategy_prompt,
    build_settlement_letter_prompt,
    generate_fallback_strategy,
    generate_fallback_letter,
)
from app.schemas.ai import AIStrategyResponse, AILetterResponse, AIHistoryResponse

class AIService:
    @staticmethod
    def _build_ai_context(db: Session, user_id: int) -> Dict[str, Any]:
        """
        AI Context Builder.
        Retrieves user records, financial profile, and active loans, then runs 
        deterministic calculations to package all metrics as a read-only dictionary context.
        """
        # Fetch profile
        profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Financial profile not found. Please create your financial profile first."
            )
        
        loans = db.query(Loan).filter(Loan.user_id == user_id).all()
        user_record = db.query(User).filter(User.user_id == user_id).first()
        
        # Calculate health metrics deterministically
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
        
        # Calculate prioritization metrics for each loan
        loans_context = []
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
            
            loans_context.append({
                "loan_id": loan.loan_id,
                "loan_type": loan.loan_type,
                "lender_name": loan.lender_name,
                "outstanding_amount": loan.outstanding_amount,
                "emi": loan.emi,
                "overdue_months": loan.overdue_months,
                "interest_rate": loan.interest_rate,
                "priority_score": priority_score,
                "priority_level": priority_level,
                "recommended_settlement_pct": rec_pct,
                "recommended_amount": rec_amount,
                "reason": reason
            })
            
        return {
            "user_name": user_record.name if user_record else "Valued Client",
            "user_email": user_record.email if user_record else "client@example.com",
            "monthly_income": income,
            "monthly_expenses": expenses,
            "monthly_surplus": monthly_surplus,
            "health_score": health_score,
            "stress_level": stress_level,
            "dti_ratio": dti_ratio,
            "emi_ratio": emi_ratio,
            "loans": loans_context
        }

    @staticmethod
    def _clean_json_response(text: str) -> str:
        """Utility to strip markdown code blocks formatting from response string."""
        text = text.strip()
        if text.startswith("```"):
            lines = text.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines[-1].startswith("```"):
                lines = lines[:-1]
            text = "\n".join(lines).strip()
        return text

    @staticmethod
    def generate_strategy(db: Session, user_id: int) -> AIStrategyResponse:
        """
        Generates negotiation strategy and financial advice.
        Falls back to deterministic calculations output if Gemini client fails.
        Logs interaction inside database.
        """
        # Build shared context object
        context = AIService._build_ai_context(db, user_id)
        prompt = build_negotiation_strategy_prompt(context)
        
        strategy = ""
        advice = ""
        source = "gemini"
        raw_response = ""
        
        try:
            # Query Gemini
            raw_response = GeminiClient.generate_text(prompt)
            clean_text = AIService._clean_json_response(raw_response)
            
            # Parse JSON schema structure
            data = json.loads(clean_text)
            strategy = data.get("strategy", "")
            advice = data.get("financial_advice", "")
            
            if not strategy or not advice:
                raise ValueError("JSON missing required fields.")
                
        except Exception as e:
            print(f"Gemini AI generation failed, triggering Fallback: {e}")
            # Trigger fallback
            strategy, advice = generate_fallback_strategy(context)
            source = "fallback"
            raw_response = f"Fallback Mode. Error: {str(e)}"
            
        # Log interaction in database
        ai_history = AIHistory(
            user_id=user_id,
            negotiation_strategy=strategy,
            ai_response=raw_response,
            prompt_type="strategy",
            generation_source=source,
            generated_at=datetime.utcnow()
        )
        db.add(ai_history)
        db.commit()
        
        return AIStrategyResponse(
            strategy=strategy,
            financial_advice=advice,
            generation_source=source
        )

    @staticmethod
    def generate_letter(db: Session, user_id: int, lender_name: str = None) -> AILetterResponse:
        """
        Generates formal settlement offer letter.
        Falls back to deterministic local template if Gemini client fails.
        Logs interaction inside database.
        """
        # Build shared context object
        context = AIService._build_ai_context(db, user_id)
        prompt = build_settlement_letter_prompt(context, lender_name)
        
        letter = ""
        source = "gemini"
        raw_response = ""
        
        try:
            # Query Gemini
            raw_response = GeminiClient.generate_text(prompt)
            letter = raw_response.strip()
        except Exception as e:
            print(f"Gemini AI letter generation failed, triggering Fallback: {e}")
            # Trigger fallback
            letter = generate_fallback_letter(context, lender_name)
            source = "fallback"
            raw_response = f"Fallback Mode. Error: {str(e)}"
            
        # Log interaction in database
        ai_history = AIHistory(
            user_id=user_id,
            settlement_letter=letter,
            ai_response=raw_response,
            prompt_type="letter",
            generation_source=source,
            generated_at=datetime.utcnow()
        )
        db.add(ai_history)
        db.commit()
        
        return AILetterResponse(
            settlement_letter=letter,
            generation_source=source
        )

    @staticmethod
    def get_history(db: Session, user_id: int) -> List[AIHistoryResponse]:
        """Retrieves user's AI interaction history from database."""
        records = db.query(AIHistory).filter(
            AIHistory.user_id == user_id
        ).order_by(AIHistory.generated_at.desc()).all()
        
        return [AIHistoryResponse.model_validate(r) for r in records]
