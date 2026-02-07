# Cosmic Watch 🌌

> **Submission for Hackathon 2026** - Interstellar Asteroid Tracker & Risk Analyser

**Cosmic Watch** is a robust, full-stack platform that transforms complex NASA Near-Earth Object (NEO) data into an accessible, real-time monitoring dashboard for researchers and space enthusiasts.

![Cosmic Watch Banner](/home/demon/astroid_tracker_and_risk_analyzer/fronten/public/screenshot.png)
_(Note: Replace with actual screenshot path if available)_

---

## 🚀 Features & Capabilities

### Core Functionality (50 Points)

- **Real-Time Data Feed**: Integrates directly with **NASA NeoWs API** to fetch live asteroid data including velocity, diameter, and miss distance.
- **Risk Analysis Engine**: Automatically calculates a "Risk Score" based on hazardous status, proximity, and size.
- **User Authentication**: Secure JWT-based signup/login for researchers to save preferences.
- **Watchlist & Alerts**: Users can "watch" specific asteroids and set distance thresholds for alerts.
- **Advanced Filtering**: Filter by date, hazard status, diameter, and velocity.

### UI/UX Design (10 Points)

- **Space-Themed Interface**: Immersive dark mode with glassmorphism effects.
- **Responsive Layout**: Fully functional on desktop, tablet, and mobile devices.
- **Interactive Dashboard**: Dynamic charts and real-time updates.

### 🐳 Docker & Deployment (20 Points)

- **Containerized**: Fully Dockerized backend and frontend.
- **Orchestration**: Single `docker-compose.yml` for one-command startup.
- **Optimization**: Multi-stage builds for minimal image size.
- **Health Checks**: Robust `curl`-based health checks ensuring service reliability.

### 🧪 API Documentation (10 Points)

- **Postman Collection**: Complete API documentation included in `backend/postman_collection.json`.
- **Testing**: Pre-configured environments for easy testing of all endpoints.

### ✨ Bonus Features (10 Points)

- **3D Visualization (5 Pts)**: Interactive **Three.js** solar system showing accurate asteroid orbits, variable sizes, and hazard color-coding (Red/Yellow).
- **Real-Time Chat (5 Pts)**: **Socket.io** powered live discussion rooms for every asteroid. See who's online and discuss potential impacts!

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn/UI + Lucide Icons
- **3D Graphics**: Three.js + React Three Fiber
- **State Management**: TanStack Query (React Query)
- **Real-time**: Socket.io-client

### Backend

- **Framework**: FastAPI (Python 3.11)
- **Database**: SQLite (Dev) / PostgreSQL (Prod ready)
- **ORM**: SQLAlchemy + Pydantic
- **Real-time**: Python-SocketIO
- **Scheduling**: APScheduler (for background NASA sync)

---

## 📦 Installation & Setup

### Option 1: Docker (Recommended)

The easiest way to run the full stack.

```bash
# 1. Clone the repository
git clone <repository-url>
cd astroid_tracker_and_risk_analyzer

# 2. Start services (Frontend + Backend)
docker-compose up
```

- Frontend: `http://localhost:80`
- Backend: `http://localhost:8000`

### Option 2: Local Development

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd fronten
npm install
npm run dev
```

---

## 📝 API Documentation

A comprehensive Postman collection is available at:
`backend/postman_collection.json`

Import this file into Postman to test:

- User Auth (Register/Login)
- Asteroid Feed & Search
- Watchlist Management
- Alert System

---

## 🌍 Free Deployment

This project is optimized for free tier deployment:

- **Frontend**: Deploy `fronten/` to **Vercel**.
- **Backend**: Deploy `backend/` to **Render** (Docker).
- **Guide**: See [`DEPLOY.md`](DEPLOY.md) for step-by-step instructions.

---

## 📄 License & Team

Developed for Hackathon 2026.
Licensed under MIT.
