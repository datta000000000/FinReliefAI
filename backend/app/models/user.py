from sqlalchemy import Column, Integer, String, DateTime, Boolean, func
from sqlalchemy.orm import relationship
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    
    # Extended profile columns
    mobile_number = Column(String, nullable=True)
    profile_image = Column(String, nullable=True)  # Store base64 data url
    country = Column(String, nullable=True)
    occupation = Column(String, nullable=True)
    is_mobile_verified = Column(Boolean, default=False, nullable=False)

    # Relationships
    loans = relationship("Loan", back_populates="user", cascade="all, delete-orphan")
    financial_profile = relationship("FinancialProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    settlement_records = relationship("SettlementRecord", back_populates="user", cascade="all, delete-orphan")
    ai_histories = relationship("AIHistory", back_populates="user", cascade="all, delete-orphan")
