from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class FinancialProfileBase(BaseModel):
    monthly_income: float = Field(..., gt=0, description="Monthly income must be positive")
    monthly_expenses: float = Field(..., ge=0, description="Monthly expenses must be non-negative")
    existing_debts: float = Field(..., ge=0, description="Existing debts must be non-negative")

class FinancialProfileCreate(FinancialProfileBase):
    pass

class FinancialProfileUpdate(BaseModel):
    monthly_income: Optional[float] = Field(None, gt=0)
    monthly_expenses: Optional[float] = Field(None, ge=0)
    existing_debts: Optional[float] = Field(None, ge=0)

class FinancialProfileResponse(FinancialProfileBase):
    profile_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
