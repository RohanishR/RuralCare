from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: str = Field(default="patient") # patient, doctor, admin
    profile_image: Optional[str] = None

class UserCreate(UserBase):
    password: str

class GoogleUserCreate(UserBase):
    auth_provider: str = "google"
    provider_id: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleLogin(BaseModel):
    credential: str

class UserResponse(UserBase):
    id: str
    auth_provider: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
