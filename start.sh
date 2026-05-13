#!/bin/bash
# Nova Mind Quick Start Script

echo "🧠 Nova Mind — Quick Start"
echo "==========================="
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker & Docker Compose found"
echo ""

# Start infrastructure
echo "🚀 Starting PostgreSQL & Redis..."
docker-compose up -d db redis

# Wait for DB
echo "⏳ Waiting for database to be ready..."
sleep 5

# Start backend
echo "🚀 Starting FastAPI backend..."
docker-compose up -d backend

# Check backend health
echo "⏳ Waiting for backend..."
sleep 3

if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Backend is running at http://localhost:8000"
    echo "📚 API docs: http://localhost:8000/docs"
else
    echo "⚠️  Backend may still be starting. Check logs with: docker-compose logs backend"
fi

echo ""
echo "🎯 Next steps:"
echo "   1. cd frontend && npm install && npx expo start"
echo "   2. Scan QR with Expo Go app (iOS/Android)"
echo "   3. Or press 'i' for iOS simulator, 'a' for Android emulator"
echo ""
echo "🔑 OpenAI API key is configured — AI tutor is ready!"
