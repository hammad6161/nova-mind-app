from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Date
from sqlalchemy.sql import func
from app.core.database import Base

class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    duration_minutes = Column(Integer, default=0)
    session_date = Column(Date, nullable=False)
    activity_type = Column(String, default="study")  # study, review, practice

    created_at = Column(DateTime(timezone=True), server_default=func.now())
