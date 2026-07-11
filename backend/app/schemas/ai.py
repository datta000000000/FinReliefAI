from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class AIStrategyResponse(BaseModel):
    strategy: str
    financial_advice: str
    generation_source: str

class AILetterResponse(BaseModel):
    settlement_letter: str
    generation_source: str

class AIHistoryResponse(BaseModel):
    history_id: int
    negotiation_strategy: Optional[str] = None
    settlement_letter: Optional[str] = None
    ai_response: Optional[str] = None
    prompt_type: Optional[str] = None
    generation_source: Optional[str] = None
    generated_at: datetime

    model_config = ConfigDict(from_attributes=True)
