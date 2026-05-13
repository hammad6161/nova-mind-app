from sqlalchemy import Column, Integer, String, DateTime, Time, ForeignKey, Text
from sqlalchemy.sql import func
from app.core.database import Base

class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    event_type = Column(String, default="study")  # study, review, break, deadline, practice
    day_of_week = Column(String, nullable=False)  # Mon, Tue, etc.
    start_time = Column(Time, nullable=False)
    duration_minutes = Column(Integer, default=60)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
