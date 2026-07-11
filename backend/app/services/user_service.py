from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.auth.security import get_password_hash, verify_password
from fastapi import HTTPException, status

class UserService:
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> User:
        """Fetch a user by their unique user_id."""
        return db.query(User).filter(User.user_id == user_id).first()

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> User:
        """Fetch a user by their email address."""
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def create_user(db: Session, user_in: UserCreate) -> User:
        """Register a new user, checking if the email is already in use."""
        db_user = UserService.get_user_by_email(db, email=user_in.email)
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
            
        hashed_pw = get_password_hash(user_in.password)
        new_user = User(
            name=user_in.name,
            email=user_in.email,
            hashed_password=hashed_pw,
            mobile_number=user_in.mobile_number,
            profile_image=user_in.profile_image,
            is_mobile_verified=False
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    @staticmethod
    def update_user(db: Session, user: User, user_in: UserUpdate) -> User:
        """Update existing user properties."""
        if user_in.email and user_in.email != user.email:
            existing_user = UserService.get_user_by_email(db, user_in.email)
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already in use"
                )
            user.email = user_in.email
        if user_in.name:
            user.name = user_in.name
        if user_in.password:
            user.hashed_password = get_password_hash(user_in.password)
        if user_in.mobile_number is not None:
            user.mobile_number = user_in.mobile_number
        if user_in.profile_image is not None:
            user.profile_image = user_in.profile_image
        if user_in.country is not None:
            user.country = user_in.country
        if user_in.occupation is not None:
            user.occupation = user_in.occupation
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def delete_user(db: Session, user_id: int) -> bool:
        """Delete a user from the database."""
        user = UserService.get_user_by_id(db, user_id)
        if not user:
            return False
        db.delete(user)
        db.commit()
        return True

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> User:
        """Authenticate user credentials."""
        user = UserService.get_user_by_email(db, email)
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user
