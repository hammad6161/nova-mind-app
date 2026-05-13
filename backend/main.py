from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine
from app.models import user, course, flashcard, progress, schedule
from app.api.routes import auth, users, courses, flashcards, schedules, progress as progress_router, ai_tutor

user.Base.metadata.create_all(bind=engine)
course.Base.metadata.create_all(bind=engine)
flashcard.Base.metadata.create_all(bind=engine)
progress.Base.metadata.create_all(bind=engine)
schedule.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Nova Mind API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(courses.router, prefix="/courses", tags=["courses"])
app.include_router(flashcards.router, prefix="/flashcards", tags=["flashcards"])
app.include_router(schedules.router, prefix="/schedules", tags=["schedules"])
app.include_router(progress_router.router, prefix="/progress", tags=["progress"])
app.include_router(ai_tutor.router, prefix="/ai", tags=["ai"])

@app.get("/health")
def health():
    return {"status": "ok"}
