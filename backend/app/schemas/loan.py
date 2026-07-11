from datetime import date
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class LoanBase(BaseModel):
    loan_type: str = Field(..., min_length=1, max_length=50)
    lender_name: str = Field(..., min_length=1, max_length=100)
    loan_amount: float = Field(..., gt=0, description="Loan amount must be positive")
    outstanding_amount: float = Field(..., ge=0, description="Outstanding amount must be non-negative")
    interest_rate: float = Field(..., ge=0, description="Interest rate must be non-negative")
    emi: float = Field(..., ge=0, description="EMI must be non-negative")
    overdue_months: int = Field(0, ge=0, description="Overdue months must be non-negative")
    due_date: Optional[date] = None

class LoanCreate(LoanBase):
    pass

class LoanUpdate(BaseModel):
    loan_type: Optional[str] = Field(None, min_length=1, max_length=50)
    lender_name: Optional[str] = Field(None, min_length=1, max_length=100)
    loan_amount: Optional[float] = Field(None, gt=0)
    outstanding_amount: Optional[float] = Field(None, ge=0)
    interest_rate: Optional[float] = Field(None, ge=0)
    emi: Optional[float] = Field(None, ge=0)
    overdue_months: Optional[int] = Field(None, ge=0)
    due_date: Optional[date] = None

class LoanResponse(LoanBase):
    loan_id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)
