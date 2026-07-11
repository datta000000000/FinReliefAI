from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict

class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters long")
    mobile_number: Optional[str] = Field(None, max_length=20)
    profile_image: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8)
    mobile_number: Optional[str] = Field(None, max_length=20)
    profile_image: Optional[str] = None
    country: Optional[str] = Field(None, max_length=100)
    occupation: Optional[str] = Field(None, max_length=100)

class UserResponse(UserBase):
    user_id: int
    created_at: datetime
    mobile_number: Optional[str] = None
    profile_image: Optional[str] = None
    country: Optional[str] = None
    occupation: Optional[str] = None
    is_mobile_verified: bool = False

    model_config = ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
