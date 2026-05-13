from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api.routes.auth import get_current_user
from app.models.user import User
from app.models.schedule import Schedule
from app.schemas.schedule import ScheduleCreate, ScheduleResponse

router = APIRouter()

@router.post("/", response_model=ScheduleResponse)
async def create_schedule(
    schedule: ScheduleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_schedule = Schedule(**schedule.dict(), user_id=current_user.id)
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

@router.get("/", response_model=List[ScheduleResponse])
async def get_schedules(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Schedule).filter(Schedule.user_id == current_user.id).all()

@router.get("/week/{week_offset}", response_model=List[ScheduleResponse])
async def get_week_schedule(
    week_offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Schedule).filter(Schedule.user_id == current_user.id).all()
