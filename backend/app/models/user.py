from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    avatar = Column(String, nullable=True)

    # Study stats
    streak = Column(Integer, default=0)
    total_study_hours = Column(Float, default=0.0)
    cards_mastered = Column(Integer, default=0)
    predicted_gpa = Column(Float, default=0.0)

    # Plan
    plan = Column(String, default="free")  # free, pro

    # Settings
    dark_mode = Column(Boolean, default=False)
    notifications_enabled = Column(Boolean, default=True)
    daily_reminder_time = Column(String, default="09:00")
    language = Column(String, default="en")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
