from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.database.session import Base

class Loan(Base):
    __tablename__ = "loans"

    loan_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    loan_type = Column(String, nullable=False)
    lender_name = Column(String, nullable=False)
    loan_amount = Column(Float, nullable=False)
    outstanding_amount = Column(Float, nullable=False)
    interest_rate = Column(Float, nullable=False)
    emi = Column(Float, nullable=False)
    overdue_months = Column(Integer, default=0, nullable=False)
    due_date = Column(Date, nullable=True)

    # Relationships
    user = relationship("User", back_populates="loans")
    settlement_records = relationship("SettlementRecord", back_populates="loan", cascade="all, delete-orphan")
