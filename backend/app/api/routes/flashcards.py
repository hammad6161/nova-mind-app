from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta

from app.core.database import get_db
from app.api.routes.auth import get_current_user
from app.models.user import User
from app.models.flashcard import Flashcard
from app.schemas.flashcard import FlashcardCreate, FlashcardResponse, FlashcardReview

router = APIRouter()

@router.post("/", response_model=FlashcardResponse)
async def create_flashcard(
    flashcard: FlashcardCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_flashcard = Flashcard(**flashcard.dict(), user_id=current_user.id)
    db.add(db_flashcard)
    db.commit()
    db.refresh(db_flashcard)
    return db_flashcard

@router.get("/due", response_model=List[FlashcardResponse])
async def get_due_flashcards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    now = datetime.utcnow()
    return db.query(Flashcard).filter(
        Flashcard.user_id == current_user.id,
        (Flashcard.next_review <= now) | (Flashcard.next_review == None)
    ).all()

@router.get("/", response_model=List[FlashcardResponse])
async def get_flashcards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Flashcard).filter(Flashcard.user_id == current_user.id).all()

@router.post("/{flashcard_id}/review", response_model=FlashcardResponse)
async def review_flashcard(
    flashcard_id: int,
    review: FlashcardReview,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    flashcard = db.query(Flashcard).filter(
        Flashcard.id == flashcard_id,
        Flashcard.user_id == current_user.id
    ).first()
    if not flashcard:
        raise HTTPException(status_code=404, detail="Flashcard not found")

    rating_map = {"easy": 3, "ok": 2, "hard": 1}
    quality = rating_map.get(review.rating, 2)

    if quality >= 2:
        if flashcard.repetitions == 0:
            flashcard.interval_days = 1
        elif flashcard.repetitions == 1:
            flashcard.interval_days = 6
        else:
            flashcard.interval_days = int(flashcard.interval_days * flashcard.ease_factor)
        flashcard.repetitions += 1
    else:
        flashcard.repetitions = 0
        flashcard.interval_days = 1

    flashcard.ease_factor = max(1.3, flashcard.ease_factor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02)))
    flashcard.next_review = datetime.utcnow() + timedelta(days=flashcard.interval_days)
    flashcard.total_reviews += 1
    if quality >= 2:
        flashcard.correct_reviews += 1

    db.commit()
    db.refresh(flashcard)
    return flashcard
