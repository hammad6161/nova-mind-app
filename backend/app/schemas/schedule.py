from pydantic import BaseModel
from typing import Optional
from datetime import time, datetime

class ScheduleBase(BaseModel):
    title: str
    description: Optional[str] = None
    event_type: str = "study"
    day_of_week: str
    start_time: time
    duration_minutes: int = 60

class ScheduleCreate(ScheduleBase):
    course_id: Optional[int] = None

class ScheduleResponse(ScheduleBase):
    id: int
    user_id: int
    course_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
