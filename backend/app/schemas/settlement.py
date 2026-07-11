from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class SettlementRecordBase(BaseModel):
    settlement_prediction: Optional[str] = None
    recommended_amount: Optional[float] = None
    priority_level: Optional[str] = None

class SettlementRecordCreate(SettlementRecordBase):
    loan_id: int

class SettlementRecordResponse(SettlementRecordBase):
    settlement_id: int
    user_id: int
    loan_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class PrioritizedLoanResponse(BaseModel):
    loan_id: int
    loan_type: str
    lender_name: str
    outstanding_amount: float
    priority_score: float
    priority_level: str
    recommended_settlement_pct: float
    recommended_amount: float
    reason: str

    model_config = ConfigDict(from_attributes=True)

class SettlementAnalysisResponse(BaseModel):
    financial_health_score: float
    stress_level: str
    loans: list[PrioritizedLoanResponse]

class SettlementHistoryResponse(BaseModel):
    settlement_id: int
    loan_id: int
    lender_name: str
    outstanding_amount: float
    settlement_prediction: str
    recommended_amount: float
    priority_level: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

