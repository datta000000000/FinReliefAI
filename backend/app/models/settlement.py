from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database.session import Base

class SettlementRecord(Base):
    __tablename__ = "settlement_records"

    settlement_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    loan_id = Column(Integer, ForeignKey("loans.loan_id", ondelete="CASCADE"), nullable=False)
    settlement_prediction = Column(String, nullable=True)
    recommended_amount = Column(Float, nullable=True)
    priority_level = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    # Relationships
    user = relationship("User", back_populates="settlement_records")
    loan = relationship("Loan", back_populates="settlement_records")
