# 🚀 Cosmic Watch Backend

A FastAPI-based REST API for tracking Near-Earth Objects (NEOs) with real-time NASA data integration.

## 🎯 Features

- **JWT Authentication** - Secure user registration and login
- **Real-Time NASA Data** - Integration with NASA NeoWs API
- **Risk Analysis Engine** - Categorizes asteroids by hazard level
- **Watchlist System** - Track specific asteroids with custom alerts
- **Alert Notifications** - Get notified about close approaches
- **Background Scheduler** - Automatic NASA data sync

## 🏗️ Tech Stack

- **Framework**: FastAPI 0.109+
- **Database**: SQLite with SQLAlchemy 2.0+
- **Auth**: JWT with python-jose, bcrypt password hashing
- **HTTP Client**: httpx for async NASA API calls
- **Scheduler**: APScheduler for background tasks
- **Validation**: Pydantic 2.0+

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- pip

### Local Development

```bash
# Clone and navigate
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your settings

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Docker Deployment

```bash
# Build and run
docker-compose up -d --build

# View logs
docker-compose logs -f backend

# Stop
docker-compose down
```

## 📚 API Documentation

Once running, access:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### API Endpoints

| Endpoint                   | Method     | Description                    |
| -------------------------- | ---------- | ------------------------------ |
| `/api/v1/auth/register`    | POST       | Register new user              |
| `/api/v1/auth/login`       | POST       | Login and get JWT              |
| `/api/v1/auth/me`          | GET        | Get current user profile       |
| `/api/v1/asteroids/feed`   | GET        | Get asteroid feed with filters |
| `/api/v1/asteroids/search` | GET        | Search asteroids by name/ID    |
| `/api/v1/asteroids/{id}`   | GET        | Get asteroid details           |
| `/api/v1/asteroids/sync`   | POST       | Trigger NASA data sync         |
| `/api/v1/watchlist`        | GET/POST   | Manage watchlist               |
| `/api/v1/watchlist/{id}`   | PUT/DELETE | Update/remove from watchlist   |
| `/api/v1/alerts`           | GET        | Get user alerts                |
| `/api/v1/alerts/{id}/read` | PUT        | Mark alert as read             |

## 🔧 Configuration

Environment variables in `.env`:

```bash
SECRET_KEY=your-secret-key-min-32-chars
NASA_API_KEY=DEMO_KEY  # Get free key at https://api.nasa.gov
FRONTEND_URL=http://localhost:5173
DATABASE_URL=sqlite:///./data/cosmic_watch.db
DEBUG=true
ENABLE_SCHEDULER=true
```

## 🧪 Testing

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ -v --cov=app --cov-report=html
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/v1/          # API endpoints
│   ├── core/            # Security, exceptions
│   ├── crud/            # Database operations
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic schemas
│   ├── services/        # Business logic
│   ├── utils/           # Helpers, scheduler
│   ├── config.py        # Settings
│   ├── database.py      # DB setup
│   └── main.py          # FastAPI app
├── tests/               # Test suite
├── data/                # SQLite database
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

## 🛡️ Security

- Password hashing with bcrypt
- JWT token authentication
- CORS middleware configured
- Non-root Docker user

## 📊 Risk Score System

Asteroids are categorized by risk:

| Score | Category | Description                        |
| ----- | -------- | ---------------------------------- |
| 70+   | EXTREME  | Hazardous with very close approach |
| 50-69 | HIGH     | Hazardous or significant approach  |
| 30-49 | MODERATE | Worth monitoring                   |
| 0-29  | LOW      | Routine, safe distance             |

## 📝 License

MIT License

---

Built for Cosmic Watch Hackathon 🌟
