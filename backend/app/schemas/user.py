from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    avatar: Optional[str] = None
    dark_mode: Optional[bool] = None
    notifications_enabled: Optional[bool] = None
    daily_reminder_time: Optional[str] = None
    language: Optional[str] = None

class UserResponse(UserBase):
    id: int
    avatar: Optional[str] = None
    streak: int
    total_study_hours: float
    cards_mastered: int
    predicted_gpa: float
    plan: str
    dark_mode: bool
    notifications_enabled: bool
    daily_reminder_time: str
    language: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
