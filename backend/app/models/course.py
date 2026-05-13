from sqlalchemy import Column, Integer, String, Float, Date, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    difficulty = Column(String, default="Medium")  # Easy, Medium, Hard, Very Hard
    exam_date = Column(Date, nullable=True)
    weekly_hours = Column(Float, default=0.0)
    deadlines = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    progress = Column(Float, default=0.0)
    color = Column(String, default="#6366f1")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
