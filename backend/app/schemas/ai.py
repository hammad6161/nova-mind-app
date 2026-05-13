from pydantic import BaseModel
from typing import Optional, List

class AIRequest(BaseModel):
    message: str
    context: Optional[str] = None
    course_id: Optional[int] = None
    tab: Optional[str] = "chat"  # chat, practice, summary, quiz

class AIResponse(BaseModel):
    response: str
    suggestions: Optional[List[str]] = None
    confidence: Optional[float] = None
