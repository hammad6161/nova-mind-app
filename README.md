# 🧠 Nova Mind

**AI-Powered Smart Study Planner** — Cross-platform mobile app for iOS & Android with a production-ready backend.

Built by **Ali · Amine · Adam**

---

## 📱 Features

- **AI Tutor** — 24/7 intelligent tutoring with OpenAI GPT-4 integration
- **Smart Scheduling** — AI-generated weekly study plans optimized for your courses
- **Spaced Repetition** — Flashcards with SM-2 algorithm for efficient memorization
- **Pomodoro Timer** — Focus sessions with progress tracking
- **Progress Analytics** — Study heatmaps, streak tracking, predicted GPA
- **Dark Mode** — Full dark theme support
- **Cross-Platform** — One codebase for iOS and Android via React Native + Expo

## 🏗️ Architecture

```
nova-mind/
├── frontend/           # React Native (Expo) — iOS & Android
│   ├── src/
│   │   ├── screens/    # App screens (Home, Tutor, Review, etc.)
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # React Context (Auth, Theme)
│   │   └── api/        # API client
│   ├── App.tsx         # Root component
│   └── package.json
├── backend/            # FastAPI (Python) — REST API
│   ├── app/
│   │   ├── api/routes/ # API endpoints
│   │   ├── core/       # Config, DB, Security
│   │   ├── models/     # SQLAlchemy models
│   │   ├── schemas/    # Pydantic schemas
│   │   └── services/   # Business logic
│   ├── main.py         # App entry point
│   └── requirements.txt
├── infra/              # Terraform — AWS infrastructure
│   └── terraform/
└── .github/workflows/  # CI/CD pipelines
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.12+
- Docker & Docker Compose
- AWS CLI (for deployment)

### Local Development

```bash
# Clone the repo
git clone https://github.com/yourusername/nova-mind.git
cd nova-mind

# Start backend & database
docker-compose up -d

# The backend will be available at http://localhost:8000
# API docs at http://localhost:8000/docs

# Start frontend (in another terminal)
cd frontend
npm install
npx expo start

# Scan QR code with Expo Go app on your phone
# Or press 'i' for iOS simulator, 'a' for Android emulator
```

### Environment Variables

Create `.env` files:

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://novamind:novamind_secret@localhost:5432/novamind
SECRET_KEY=your-super-secret-key
OPENAI_API_KEY=sk-your-openai-key
REDIS_URL=redis://localhost:6379/0
```

**Frontend** (`frontend/.env`):
```env
EXPO_PUBLIC_API_URL=http://localhost:8000
```

## 📦 Deployment

### Option 1: AWS (Production)

```bash
cd infra/terraform

# Initialize Terraform
terraform init

# Plan infrastructure
terraform plan -var="db_password=your_secure_password"

# Apply
terraform apply

# Push containers to ECR and deploy to ECS
# (Handled automatically by GitHub Actions on push to main)
```

**Required GitHub Secrets:**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `DB_PASSWORD`

### Option 2: Docker Compose (Self-hosted)

```bash
docker-compose up -d
```

### Option 3: Vercel + Railway (Alternative)

- **Frontend**: Deploy to Vercel from GitHub
- **Backend**: Deploy to Railway or Render
- **Database**: Use Supabase or Railway PostgreSQL

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Create account |
| `/auth/login` | POST | Sign in |
| `/auth/me` | GET | Get current user |
| `/courses/` | CRUD | Manage courses |
| `/schedules/` | CRUD | Study schedules |
| `/flashcards/due` | GET | Due flashcards |
| `/flashcards/{id}/review` | POST | Review flashcard |
| `/ai/chat` | POST | AI tutor chat |
| `/ai/generate-schedule` | POST | AI schedule generation |
| `/progress/stats` | GET | Progress statistics |

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest tests/ -v

# Frontend tests
cd frontend
npm test
```

## 🛣️ Roadmap

- [ ] Offline mode with SQLite sync
- [ ] Push notifications for study reminders
- [ ] Social features (study groups, leaderboards)
- [ ] Voice-enabled AI tutor
- [ ] Apple Watch / Wear OS companion app
- [ ] Desktop app (Electron/Tauri)

## 📄 License

MIT License — © 2025 Ali, Amine & Adam

---

<p align="center">
  <strong>Built with ❤️ for students everywhere</strong>
</p>
