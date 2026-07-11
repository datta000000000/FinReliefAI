from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class AIHistoryBase(BaseModel):
    negotiation_strategy: Optional[str] = None
    settlement_letter: Optional[str] = None
    ai_response: Optional[str] = None

class AIHistoryCreate(AIHistoryBase):
    pass

class AIHistoryResponse(AIHistoryBase):
    history_id: int
    user_id: int
    generated_at: datetime

    model_config = ConfigDict(from_attributes=True)
