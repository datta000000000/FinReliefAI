from pydantic import BaseModel, Field

class FinancialHealthResponse(BaseModel):
    total_monthly_emi: float = Field(..., description="Sum of EMIs across all active loans")
    total_outstanding_debt: float = Field(..., description="Sum of outstanding amounts across all active loans")
    monthly_surplus: float = Field(..., description="Monthly income minus monthly expenses and total EMI")
    emi_ratio: float = Field(..., description="Percentage of monthly income spent on EMIs")
    dti_ratio: float = Field(..., description="Debt-to-Income ratio based on annual income")
    financial_health_score: float = Field(..., description="Deterministic health score between 0 and 100")
    stress_level: str = Field(..., description="Stress level categorization (Low, Moderate, High, Critical)")
