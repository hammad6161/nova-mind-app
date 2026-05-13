from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FlashcardBase(BaseModel):
    question: str
    answer: str
    hint: Optional[str] = None
    course_id: Optional[int] = None

class FlashcardCreate(FlashcardBase):
    pass

class FlashcardResponse(FlashcardBase):
    id: int
    user_id: int
    ease_factor: float
    interval_days: int
    repetitions: int
    next_review: Optional[datetime] = None
    total_reviews: int
    correct_reviews: int
    created_at: datetime

    class Config:
        from_attributes = True

class FlashcardReview(BaseModel):
    rating: str  # easy, ok, hard
