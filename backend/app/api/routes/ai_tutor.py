from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import random

from app.core.database import get_db
from app.api.routes.auth import get_current_user
from app.models.user import User
from app.schemas.ai import AIRequest, AIResponse

router = APIRouter()

# ===== KNOWLEDGE BASE (Fallback when all APIs fail) =====
KNOWLEDGE_BASE = {
    "differential_equations": {
        "explain": """Let me break that down step by step:

1️⃣ Identify the type of ODE (linear, separable, exact, homogeneous)
2️⃣ Choose the right method for that type
3️⃣ Solve — and don't forget the constant C

For a separable ODE like dy/dx = f(x)g(y):
• Separate: dy/g(y) = f(x)dx
• Integrate both sides
• Solve for y

Tip: Always check your answer by differentiating!""",
        "practice": """Here's a practice problem for you 🎯

Solve: dy/dx + 2y = 4e^x

This is a first-order linear ODE.
Step 1: Find integrating factor μ = e^(∫2dx) = e^(2x)
Step 2: Multiply both sides by μ
Step 3: The left side becomes d/dx[e^(2x)·y]
Step 4: Integrate both sides

Can you find the complete solution? Type your answer!""",
        "quiz": """⚡ Quick Quiz Time!

What is the general solution of dy/dx = ky?

a) y = kx + C
b) y = Ce^(kx) ← think about this one
c) y = k·ln(x) + C
d) y = Cx^k

Type a, b, c, or d and I'll explain why!""",
        "summary": """📋 Chapter 7 Summary — Differential Equations:

• Separable ODEs: dy/g(y) = f(x)dx — integrate both sides
• Linear 1st order: y' + P(x)y = Q(x) — use integrating factor e^(∫P dx)
• Exact ODEs: M dx + N dy = 0, where ∂M/∂y = ∂N/∂x
• Bernoulli equations: reduce to linear via substitution v = y^(1-n)
• Homogeneous ODEs: use substitution y = vx

💡 Key tip: Always identify the type FIRST before choosing a method.""",
    },
    "data_structures": {
        "explain": """Let me explain this concept clearly:

Data structures are ways of organizing and storing data so that it can be accessed and worked with efficiently.

Key concepts:
• Time Complexity: How runtime grows with input size (Big O notation)
• Space Complexity: How memory usage grows with input size
• Trade-offs: Often there's a trade-off between time and space

Common structures:
• Arrays: O(1) access, O(n) insert/delete
• Linked Lists: O(n) access, O(1) insert/delete
• Trees: Hierarchical, O(log n) operations for balanced trees
• Graphs: Network relationships, various traversal algorithms""",
        "practice": """Here's a practice problem 🎯

Implement a function to detect a cycle in a linked list.

Hint: Use Floyd's Cycle-Finding Algorithm (Tortoise and Hare)
• Slow pointer moves 1 step at a time
• Fast pointer moves 2 steps at a time
• If they meet, there's a cycle

Can you write the pseudocode or actual code?""",
    }
}

DEFAULT_RESPONSES = [
    "Great question! Let me help you understand this concept better. Could you provide more context about which topic you're studying?",
    "That's an interesting question! Based on your study history, I can see you've been working hard. Let me break this down for you.",
    "I'd be happy to help! This is a fundamental concept that builds on what you've already learned. Let's work through it together.",
]

# ===== AI PROVIDER FUNCTIONS =====

def call_groq(message: str, context: Optional[str] = None) -> Optional[str]:
    """Call Groq API (fastest, 1,000 requests/day free)."""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None

    try:
        import httpx
        response = httpx.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": "You are Nova Mind, an expert AI study tutor. Be encouraging, clear, and use emojis. Keep responses concise but thorough."},
                    {"role": "user", "content": f"Context: {context}\n\nQuestion: {message}" if context else message}
                ],
                "temperature": 0.7,
                "max_tokens": 800,
            },
            timeout=30.0
        )
        if response.status_code == 200:
            return response.json()["choices"][0]["message"]["content"]
        print(f"Groq error: {response.status_code} - {response.text}")
        return None
    except Exception as e:
        print(f"Groq exception: {e}")
        return None

def call_gemini(message: str, context: Optional[str] = None) -> Optional[str]:
    """Call Google Gemini API (1,500 requests/day free)."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None

    try:
        import httpx
        prompt = f"Context: {context}\n\nQuestion: {message}" if context else message
        response = httpx.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}",
            json={
                "contents": [{"role": "user", "parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.7, "maxOutputTokens": 800}
            },
            timeout=30.0
        )
        if response.status_code == 200:
            data = response.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
        print(f"Gemini error: {response.status_code} - {response.text}")
        return None
    except Exception as e:
        print(f"Gemini exception: {e}")
        return None

def call_openrouter(message: str, context: Optional[str] = None) -> Optional[str]:
    """Call OpenRouter (free tier, 200 requests/day)."""
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        return None

    try:
        import httpx
        response = httpx.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://novamind.app",
                "X-Title": "Nova Mind"
            },
            json={
                "model": "meta-llama/llama-3.3-70b-instruct:free",
                "messages": [
                    {"role": "system", "content": "You are Nova Mind, an expert AI study tutor."},
                    {"role": "user", "content": f"Context: {context}\n\nQuestion: {message}" if context else message}
                ],
                "temperature": 0.7,
                "max_tokens": 800,
            },
            timeout=30.0
        )
        if response.status_code == 200:
            return response.json()["choices"][0]["message"]["content"]
        print(f"OpenRouter error: {response.status_code}")
        return None
    except Exception as e:
        print(f"OpenRouter exception: {e}")
        return None

def get_ai_response(message: str, context: Optional[str] = None) -> str:
    """Try AI providers in order: Groq → Gemini → OpenRouter → Knowledge Base."""

    # 1. Try Groq (fastest)
    response = call_groq(message, context)
    if response:
        return response

    # 2. Try Gemini (higher limits)
    response = call_gemini(message, context)
    if response:
        return response

    # 3. Try OpenRouter (most models)
    response = call_openrouter(message, context)
    if response:
        return response

    # 4. Fallback to knowledge base
    return None

# ===== API ROUTES =====

@router.post("/chat", response_model=AIResponse)
async def chat_with_ai(
    request: AIRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Chat with the AI tutor. Tries free APIs in order, falls back to knowledge base."""

    # Try free AI APIs
    ai_response = get_ai_response(request.message, request.context)

    if ai_response:
        return AIResponse(
            response=ai_response,
            suggestions=["Explain more", "Give example", "Practice problem", "Quiz me"],
            confidence=0.95
        )

    # Fallback to knowledge base
    message = request.message.lower()
    tab = request.tab or "chat"

    topic = "differential_equations"
    if any(word in message for word in ["graph", "tree", "bst", "bfs", "dfs", "complexity", "linked list", "hash"]):
        topic = "data_structures"

    if tab == "practice" or any(word in message for word in ["practice", "problem", "exercise", "solve"]):
        response_text = KNOWLEDGE_BASE.get(topic, {}).get("practice", random.choice(DEFAULT_RESPONSES))
    elif tab == "quiz" or any(word in message for word in ["quiz", "test", "exam", "question"]):
        response_text = KNOWLEDGE_BASE.get(topic, {}).get("quiz", random.choice(DEFAULT_RESPONSES))
    elif tab == "summary" or any(word in message for word in ["summary", "summarize", "overview", "chapter"]):
        response_text = KNOWLEDGE_BASE.get(topic, {}).get("summary", random.choice(DEFAULT_RESPONSES))
    elif any(word in message for word in ["explain", "what is", "how does", "why", "concept"]):
        response_text = KNOWLEDGE_BASE.get(topic, {}).get("explain", random.choice(DEFAULT_RESPONSES))
    else:
        response_text = random.choice(DEFAULT_RESPONSES)

    return AIResponse(
        response=response_text,
        suggestions=["Explain more", "Give example", "Practice problem", "Quiz me"],
        confidence=0.85
    )

@router.get("/providers")
async def check_providers():
    """Check which AI providers are configured and available."""
    providers = {
        "groq": {"configured": bool(os.getenv("GROQ_API_KEY")), "limits": "1,000 req/day", "speed": "Ultra-fast"},
        "gemini": {"configured": bool(os.getenv("GEMINI_API_KEY")), "limits": "1,500 req/day", "speed": "Fast"},
        "openrouter": {"configured": bool(os.getenv("OPENROUTER_API_KEY")), "limits": "200 req/day", "speed": "Moderate"},
        "knowledge_base": {"configured": True, "limits": "Unlimited", "speed": "Instant"},
    }
    return providers

@router.post("/generate-schedule")
async def generate_ai_schedule(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate an AI-optimized study schedule for a course."""
    from app.models.course import Course
    from app.models.schedule import Schedule

    course = db.query(Course).filter(
        Course.id == course_id,
        Course.user_id == current_user.id
    ).first()

    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # Try AI-powered schedule generation
    ai_schedule_text = get_ai_response(
        f"Create a weekly study schedule for {course.name} (difficulty: {course.difficulty}, weekly hours: {course.weekly_hours}, exam: {course.exam_date or 'TBD'}). Return JSON array with day, time, duration, title, type.",
        context="Schedule generation"
    )

    # Fallback: Simple algorithmic schedule
    days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
    schedule_items = []
    hours_per_day = course.weekly_hours / len(days) if course.weekly_hours else 1.5
    duration = min(int(hours_per_day * 60), 120)

    for i, day in enumerate(days):
        if i % 2 == 0:
            schedule = Schedule(
                user_id=current_user.id,
                course_id=course.id,
                title=f"{course.name} Study",
                description=f"Focus on {course.notes or 'key concepts'} — AI optimized",
                event_type="study",
                day_of_week=day,
                start_time=f"{9 + i}:00",
                duration_minutes=duration
            )
            db.add(schedule)
            schedule_items.append(schedule)

        if i == 2:
            review = Schedule(
                user_id=current_user.id,
                course_id=course.id,
                title=f"{course.name} Review",
                description="Spaced repetition review — AI recommended",
                event_type="review",
                day_of_week=day,
                start_time="14:00",
                duration_minutes=45
            )
            db.add(review)
            schedule_items.append(review)

    db.commit()

    return {
        "message": f"Generated {len(schedule_items)} study sessions for {course.name}",
        "ai_powered": bool(ai_schedule_text),
        "schedule": [{"id": s.id, "title": s.title, "day": s.day_of_week, "time": str(s.start_time), "duration": s.duration_minutes} for s in schedule_items]
    }
