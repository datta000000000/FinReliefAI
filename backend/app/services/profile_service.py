from sqlalchemy.orm import Session
from app.models.financial_profile import FinancialProfile
from app.schemas.financial_profile import FinancialProfileCreate, FinancialProfileUpdate
from fastapi import HTTPException, status

class ProfileService:
    @staticmethod
    def get_profile_by_user(db: Session, user_id: int) -> FinancialProfile:
        """Fetch the financial profile for the user."""
        profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Financial profile not found"
            )
        return profile

    @staticmethod
    def create_profile(db: Session, profile_in: FinancialProfileCreate, user_id: int) -> FinancialProfile:
        """Create a new financial profile. Only one is allowed per user."""
        existing = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Financial profile already exists. Use PUT to update it."
            )
        
        new_profile = FinancialProfile(
            user_id=user_id,
            monthly_income=profile_in.monthly_income,
            monthly_expenses=profile_in.monthly_expenses,
            existing_debts=profile_in.existing_debts
        )
        db.add(new_profile)
        db.commit()
        db.refresh(new_profile)
        return new_profile

    @staticmethod
    def update_profile(db: Session, profile_in: FinancialProfileUpdate, user_id: int) -> FinancialProfile:
        """Update the user's financial profile details."""
        profile = ProfileService.get_profile_by_user(db, user_id)
        
        update_data = profile_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(profile, key, value)
            
        db.commit()
        db.refresh(profile)
        return profile

    @staticmethod
    def delete_profile(db: Session, user_id: int) -> bool:
        """Delete the financial profile for the user."""
        profile = ProfileService.get_profile_by_user(db, user_id)
        db.delete(profile)
        db.commit()
        return True
