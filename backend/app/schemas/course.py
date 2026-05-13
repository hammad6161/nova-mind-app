from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class CourseBase(BaseModel):
    name: str
    difficulty: str = "Medium"
    exam_date: Optional[date] = None
    weekly_hours: float = 0.0
    deadlines: Optional[str] = None
    notes: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    name: Optional[str] = None
    difficulty: Optional[str] = None
    exam_date: Optional[date] = None
    weekly_hours: Optional[float] = None
    deadlines: Optional[str] = None
    notes: Optional[str] = None
    progress: Optional[float] = None

class CourseResponse(CourseBase):
    id: int
    user_id: int
    progress: float
    color: str
    created_at: datetime

    class Config:
        from_attributes = True
