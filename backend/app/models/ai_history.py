from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, String, func
from sqlalchemy.orm import relationship
from app.database.session import Base

class AIHistory(Base):
    __tablename__ = "ai_histories"

    history_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    negotiation_strategy = Column(Text, nullable=True)
    settlement_letter = Column(Text, nullable=True)
    ai_response = Column(Text, nullable=True)
    prompt_type = Column(String, nullable=True)
    generation_source = Column(String, nullable=True)
    generated_at = Column(DateTime, server_default=func.now(), nullable=False)


    # Relationships
    user = relationship("User", back_populates="ai_histories")
