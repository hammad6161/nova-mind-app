from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.core.database import Base

class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    hint = Column(Text, nullable=True)

    # Spaced repetition
    ease_factor = Column(Float, default=2.5)
    interval_days = Column(Integer, default=0)
    repetitions = Column(Integer, default=0)
    next_review = Column(DateTime(timezone=True), nullable=True)

    # Stats
    total_reviews = Column(Integer, default=0)
    correct_reviews = Column(Integer, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
