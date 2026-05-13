from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict
from datetime import datetime, timedelta

from app.core.database import get_db
from app.api.routes.auth import get_current_user
from app.models.user import User
from app.models.course import Course
from app.models.progress import StudySession
from app.models.flashcard import Flashcard

router = APIRouter()

@router.get("/stats")
async def get_progress_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get comprehensive progress statistics."""

    # Study hours this week
    week_ago = datetime.utcnow() - timedelta(days=7)
    weekly_sessions = db.query(StudySession).filter(
        StudySession.user_id == current_user.id,
        StudySession.session_date >= week_ago.date()
    ).all()
    weekly_hours = sum(s.duration_minutes for s in weekly_sessions) / 60

    # Total cards mastered
    cards_mastered = db.query(Flashcard).filter(
        Flashcard.user_id == current_user.id,
        Flashcard.repetitions >= 3
    ).count()

    # Course progress
    courses = db.query(Course).filter(Course.user_id == current_user.id).all()
    course_progress = [
        {
            "name": c.name,
            "progress": c.progress,
            "color": c.color,
            "exam_date": c.exam_date.isoformat() if c.exam_date else None
        }
        for c in courses
    ]

    # Study streak (simplified)
    streak = current_user.streak

    # Predicted GPA (simplified calculation)
    avg_progress = sum(c.progress for c in courses) / len(courses) if courses else 0
    predicted_gpa = min(4.0, 2.0 + (avg_progress / 100) * 2.0)

    return {
        "weekly_hours": round(weekly_hours, 1),
        "streak": streak,
        "cards_mastered": cards_mastered,
        "predicted_gpa": round(predicted_gpa, 1),
        "courses": course_progress,
        "total_courses": len(courses)
    }

@router.get("/heatmap")
async def get_study_heatmap(
    weeks: int = 14,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get study activity heatmap data."""

    end_date = datetime.utcnow().date()
    start_date = end_date - timedelta(weeks=weeks)

    sessions = db.query(StudySession).filter(
        StudySession.user_id == current_user.id,
        StudySession.session_date >= start_date,
        StudySession.session_date <= end_date
    ).all()

    # Group by day
    heatmap = {}
    for session in sessions:
        day_key = session.session_date.isoformat()
        if day_key not in heatmap:
            heatmap[day_key] = 0
        heatmap[day_key] += session.duration_minutes

    return {
        "heatmap": heatmap,
        "max_minutes": max(heatmap.values()) if heatmap else 0,
        "total_sessions": len(sessions)
    }

@router.post("/session")
async def log_study_session(
    course_id: int,
    duration_minutes: int,
    activity_type: str = "study",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Log a study session."""

    session = StudySession(
        user_id=current_user.id,
        course_id=course_id,
        duration_minutes=duration_minutes,
        session_date=datetime.utcnow().date(),
        activity_type=activity_type
    )
    db.add(session)

    # Update user stats
    current_user.total_study_hours += duration_minutes / 60

    # Update streak (simplified)
    today = datetime.utcnow().date()
    last_session = db.query(StudySession).filter(
        StudySession.user_id == current_user.id
    ).order_by(StudySession.session_date.desc()).first()

    if last_session and last_session.session_date == today - timedelta(days=1):
        current_user.streak += 1
    elif not last_session or last_session.session_date < today - timedelta(days=1):
        current_user.streak = 1

    db.commit()

    return {"message": "Study session logged", "streak": current_user.streak}
