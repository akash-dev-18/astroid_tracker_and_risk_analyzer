# Cosmic Watch - Backend Design Document

## 🎯 Overview

A FastAPI-based REST API with JWT authentication, SQLite database, and NASA API integration for real-time asteroid tracking.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    FastAPI Application                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │  Auth    │  │ Asteroids│  │Watchlist │  │ Alerts  ││
│  │ Routes   │  │  Routes  │  │  Routes  │  │ Routes  ││
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘│
│       │             │              │              │     │
│  ┌────┴─────────────┴──────────────┴──────────────┴───┐│
│  │              Middleware Layer                      ││
│  │  - CORS  - JWT Auth  - Error Handler              ││
│  └────┬───────────────────────────────────────────────┘│
│       │                                                 │
│  ┌────┴──────────────────────────────────────────────┐ │
│  │              Service Layer                        │ │
│  │  - NASA Service  - Alert Service  - Auth Service │ │
│  └────┬──────────────────────────────────────────────┘ │
│       │                                                 │
│  ┌────┴──────────────────────────────────────────────┐ │
│  │              Database Layer (SQLAlchemy)          │ │
│  │  - Models  - CRUD Operations  - Relationships    │ │
│  └────┬──────────────────────────────────────────────┘ │
│       │                                                 │
└───────┼─────────────────────────────────────────────────┘
        │
   ┌────┴────┐
   │ SQLite  │
   │   DB    │
   └─────────┘

External Services:
┌─────────────────┐
│  NASA NeoWs API │ ← Fetched by Background Scheduler
└─────────────────┘
```

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   │
│   ├── main.py                    # FastAPI app entry point
│   ├── config.py                  # Settings & environment variables
│   ├── database.py                # SQLAlchemy setup
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py               # User model
│   │   ├── asteroid.py           # Asteroid model
│   │   ├── close_approach.py     # CloseApproach model
│   │   ├── watchlist.py          # Watchlist model
│   │   └── alert.py              # Alert model
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user.py               # Pydantic schemas for User
│   │   ├── asteroid.py           # Pydantic schemas for Asteroid
│   │   ├── watchlist.py          # Pydantic schemas for Watchlist
│   │   ├── alert.py              # Pydantic schemas for Alert
│   │   └── auth.py               # Login/Register schemas
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py               # Dependencies (get_db, get_current_user)
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── auth.py           # Auth endpoints
│   │       ├── asteroids.py      # Asteroid endpoints
│   │       ├── watchlist.py      # Watchlist endpoints
│   │       └── alerts.py         # Alert endpoints
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── nasa_service.py       # NASA API client
│   │   ├── auth_service.py       # Password hashing, JWT
│   │   ├── alert_service.py      # Alert generation logic
│   │   └── risk_service.py       # Risk score calculation
│   │
│   ├── crud/
│   │   ├── __init__.py
│   │   ├── user.py               # User CRUD operations
│   │   ├── asteroid.py           # Asteroid CRUD operations
│   │   ├── watchlist.py          # Watchlist CRUD operations
│   │   └── alert.py              # Alert CRUD operations
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── security.py           # JWT creation/verification
│   │   └── exceptions.py         # Custom exceptions
│   │
│   └── utils/
│       ├── __init__.py
│       ├── scheduler.py          # APScheduler setup
│       └── helpers.py            # Utility functions
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py               # Pytest fixtures
│   ├── test_auth.py
│   ├── test_asteroids.py
│   └── test_watchlist.py
│
│
├── data/
│   └── cosmic_watch.db           # SQLite database file
│
├── .env.example
├── .env
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🗄️ Database Models (SQLAlchemy)

### **models/user.py**

```python
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    watchlist = relationship("Watchlist", back_populates="user", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="user", cascade="all, delete-orphan")
```

### **models/asteroid.py**

```python
from sqlalchemy import Column, String, Float, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Asteroid(Base):
    __tablename__ = "asteroids"

    id = Column(String, primary_key=True)  # NASA NEO ID (e.g., "2024001")
    name = Column(String, nullable=False, index=True)
    absolute_magnitude = Column(Float)
    is_hazardous = Column(Boolean, default=False, index=True)
    estimated_diameter_min = Column(Float)  # km
    estimated_diameter_max = Column(Float)  # km
    nasa_jpl_url = Column(Text)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    close_approaches = relationship("CloseApproach", back_populates="asteroid", cascade="all, delete-orphan")
    watchlist_entries = relationship("Watchlist", back_populates="asteroid", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="asteroid", cascade="all, delete-orphan")
```

### **models/close_approach.py**

```python
from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class CloseApproach(Base):
    __tablename__ = "close_approaches"

    id = Column(Integer, primary_key=True, index=True)
    asteroid_id = Column(String, ForeignKey("asteroids.id", ondelete="CASCADE"), nullable=False)
    approach_date = Column(Date, nullable=False, index=True)
    approach_date_full = Column(DateTime(timezone=True))
    velocity_kmh = Column(Float)  # km/h
    miss_distance_km = Column(Float)  # kilometers
    miss_distance_lunar = Column(Float)  # lunar distances
    orbiting_body = Column(String, default="Earth")

    # Relationships
    asteroid = relationship("Asteroid", back_populates="close_approaches")
```

### **models/watchlist.py**

```python
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Watchlist(Base):
    __tablename__ = "watchlist"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    asteroid_id = Column(String, ForeignKey("asteroids.id", ondelete="CASCADE"), nullable=False)
    alert_distance_km = Column(Float, default=1000000)  # Default: 1M km
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Ensure user can't watch same asteroid twice
    __table_args__ = (UniqueConstraint('user_id', 'asteroid_id', name='_user_asteroid_uc'),)

    # Relationships
    user = relationship("User", back_populates="watchlist")
    asteroid = relationship("Asteroid", back_populates="watchlist_entries")
```

### **models/alert.py**

```python
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    asteroid_id = Column(String, ForeignKey("asteroids.id", ondelete="CASCADE"), nullable=False)
    message = Column(Text, nullable=False)
    alert_type = Column(String, default="close_approach")  # close_approach, new_hazard
    is_read = Column(Boolean, default=False, index=True)
    approach_date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="alerts")
    asteroid = relationship("Asteroid", back_populates="alerts")
```

---

## 📝 Pydantic Schemas

### **schemas/user.py**

```python
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str  # Min 8 chars validated in endpoint

class UserLogin(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[int] = None
    email: Optional[str] = None
```

### **schemas/asteroid.py**

```python
from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from datetime import datetime, date

class CloseApproachBase(BaseModel):
    approach_date: date
    approach_date_full: datetime
    velocity_kmh: float
    miss_distance_km: float
    miss_distance_lunar: float
    orbiting_body: str = "Earth"

class CloseApproachResponse(CloseApproachBase):
    id: int
    asteroid_id: str

    class Config:
        from_attributes = True

class AsteroidBase(BaseModel):
    id: str
    name: str
    absolute_magnitude: Optional[float]
    is_hazardous: bool
    estimated_diameter_min: Optional[float]
    estimated_diameter_max: Optional[float]
    nasa_jpl_url: Optional[str]

class AsteroidResponse(AsteroidBase):
    last_updated: datetime
    close_approaches: List[CloseApproachResponse] = []
    risk_score: Optional[str] = None  # Computed field

    class Config:
        from_attributes = True

class AsteroidFeedResponse(BaseModel):
    count: int
    asteroids: List[AsteroidResponse]
```

### **schemas/watchlist.py**

```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from .asteroid import AsteroidResponse

class WatchlistCreate(BaseModel):
    asteroid_id: str
    alert_distance_km: Optional[float] = 1000000

class WatchlistUpdate(BaseModel):
    alert_distance_km: float

class WatchlistResponse(BaseModel):
    id: int
    user_id: int
    asteroid_id: str
    alert_distance_km: float
    created_at: datetime
    asteroid: Optional[AsteroidResponse] = None

    class Config:
        from_attributes = True
```

### **schemas/alert.py**

```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AlertResponse(BaseModel):
    id: int
    user_id: int
    asteroid_id: str
    message: str
    alert_type: str
    is_read: bool
    approach_date: Optional[datetime]
    created_at: datetime
    asteroid_name: Optional[str] = None  # Joined field

    class Config:
        from_attributes = True

class AlertUpdate(BaseModel):
    is_read: bool
```

---

## 🔌 API Endpoints (Detailed)

### **api/v1/auth.py**

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.services import auth_service
from app.api.deps import get_db, get_current_user
from app import crud

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user

    - **email**: Valid email address
    - **password**: Minimum 8 characters
    """
    # Check if user exists
    existing_user = crud.user.get_by_email(db, email=user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Validate password length
    if len(user_data.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters"
        )

    # Create user
    user = crud.user.create(db, obj_in=user_data)

    # Generate JWT token
    access_token = auth_service.create_access_token(data={"sub": str(user.id), "email": user.email})

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Login with email and password

    Returns JWT access token
    """
    # Authenticate user
    user = crud.user.authenticate(db, email=credentials.email, password=credentials.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )

    # Generate token
    access_token = auth_service.create_access_token(data={"sub": str(user.id), "email": user.email})

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_user)):
    """
    Get current authenticated user's profile
    """
    return current_user
```

### **api/v1/asteroids.py**

```python
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import date, datetime, timedelta
from app.schemas.asteroid import AsteroidResponse, AsteroidFeedResponse
from app.api.deps import get_db
from app import crud
from app.services.risk_service import calculate_risk_score

router = APIRouter(prefix="/asteroids", tags=["Asteroids"])

@router.get("/feed", response_model=AsteroidFeedResponse)
async def get_asteroid_feed(
    start_date: Optional[date] = Query(None, description="Start date (default: today)"),
    end_date: Optional[date] = Query(None, description="End date (default: today + 7 days)"),
    is_hazardous: Optional[bool] = Query(None, description="Filter by hazardous status"),
    min_diameter: Optional[float] = Query(None, description="Minimum diameter in km"),
    max_diameter: Optional[float] = Query(None, description="Maximum diameter in km"),
    sort_by: Optional[str] = Query("approach_date", description="Sort by: approach_date, diameter, velocity"),
    limit: int = Query(50, le=100, description="Maximum results"),
    offset: int = Query(0, description="Pagination offset"),
    db: Session = Depends(get_db)
):
    """
    Get asteroid feed with optional filters

    Returns list of asteroids with their close approach data
    """
    # Default dates
    if not start_date:
        start_date = date.today()
    if not end_date:
        end_date = start_date + timedelta(days=7)

    # Fetch from database
    asteroids = crud.asteroid.get_feed(
        db,
        start_date=start_date,
        end_date=end_date,
        is_hazardous=is_hazardous,
        min_diameter=min_diameter,
        max_diameter=max_diameter,
        sort_by=sort_by,
        limit=limit,
        offset=offset
    )

    # Calculate risk scores
    for asteroid in asteroids:
        if asteroid.close_approaches:
            asteroid.risk_score = calculate_risk_score(asteroid, asteroid.close_approaches[0])

    return {
        "count": len(asteroids),
        "asteroids": asteroids
    }


@router.get("/search", response_model=List[AsteroidResponse])
async def search_asteroids(
    q: str = Query(..., min_length=2, description="Search query (name or ID)"),
    db: Session = Depends(get_db)
):
    """
    Search asteroids by name or ID
    """
    asteroids = crud.asteroid.search(db, query=q)
    return asteroids


@router.get("/{asteroid_id}", response_model=AsteroidResponse)
async def get_asteroid_by_id(
    asteroid_id: str,
    db: Session = Depends(get_db)
):
    """
    Get detailed information about a specific asteroid
    """
    asteroid = crud.asteroid.get(db, id=asteroid_id)

    if not asteroid:
        raise HTTPException(
            status_code=404,
            detail=f"Asteroid with ID {asteroid_id} not found"
        )

    # Calculate risk score for the next approach
    if asteroid.close_approaches:
        next_approach = min(asteroid.close_approaches, key=lambda x: x.approach_date)
        asteroid.risk_score = calculate_risk_score(asteroid, next_approach)

    return asteroid
```

### **api/v1/watchlist.py**

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas.watchlist import WatchlistCreate, WatchlistUpdate, WatchlistResponse
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app import crud

router = APIRouter(prefix="/watchlist", tags=["Watchlist"])

@router.get("", response_model=List[WatchlistResponse])
async def get_user_watchlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current user's watchlist with asteroid details
    """
    watchlist = crud.watchlist.get_by_user(db, user_id=current_user.id)
    return watchlist


@router.post("", response_model=WatchlistResponse, status_code=status.HTTP_201_CREATED)
async def add_to_watchlist(
    watchlist_data: WatchlistCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add asteroid to user's watchlist

    - **asteroid_id**: NASA NEO ID
    - **alert_distance_km**: Trigger alert when closer than this (default: 1M km)
    """
    # Check if asteroid exists
    asteroid = crud.asteroid.get(db, id=watchlist_data.asteroid_id)
    if not asteroid:
        raise HTTPException(
            status_code=404,
            detail=f"Asteroid {watchlist_data.asteroid_id} not found"
        )

    # Check if already in watchlist
    existing = crud.watchlist.get_by_user_and_asteroid(
        db,
        user_id=current_user.id,
        asteroid_id=watchlist_data.asteroid_id
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Asteroid already in your watchlist"
        )

    # Create watchlist entry
    watchlist_entry = crud.watchlist.create(
        db,
        user_id=current_user.id,
        asteroid_id=watchlist_data.asteroid_id,
        alert_distance_km=watchlist_data.alert_distance_km
    )

    return watchlist_entry


@router.put("/{asteroid_id}", response_model=WatchlistResponse)
async def update_watchlist_entry(
    asteroid_id: str,
    update_data: WatchlistUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update alert threshold for a watched asteroid
    """
    entry = crud.watchlist.get_by_user_and_asteroid(
        db,
        user_id=current_user.id,
        asteroid_id=asteroid_id
    )

    if not entry:
        raise HTTPException(status_code=404, detail="Watchlist entry not found")

    updated_entry = crud.watchlist.update(db, db_obj=entry, obj_in=update_data)
    return updated_entry


@router.delete("/{asteroid_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_watchlist(
    asteroid_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Remove asteroid from watchlist
    """
    entry = crud.watchlist.get_by_user_and_asteroid(
        db,
        user_id=current_user.id,
        asteroid_id=asteroid_id
    )

    if not entry:
        raise HTTPException(status_code=404, detail="Watchlist entry not found")

    crud.watchlist.remove(db, id=entry.id)
    return None
```

### **api/v1/alerts.py**

```python
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.schemas.alert import AlertResponse, AlertUpdate
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app import crud

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("", response_model=List[AlertResponse])
async def get_user_alerts(
    unread_only: bool = Query(False, description="Show only unread alerts"),
    limit: int = Query(50, le=100),
    offset: int = Query(0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get user's alerts/notifications
    """
    alerts = crud.alert.get_by_user(
        db,
        user_id=current_user.id,
        unread_only=unread_only,
        limit=limit,
        offset=offset
    )
    return alerts


@router.put("/{alert_id}/read", response_model=AlertResponse)
async def mark_alert_as_read(
    alert_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark an alert as read
    """
    alert = crud.alert.get(db, id=alert_id)

    if not alert or alert.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Alert not found")

    updated_alert = crud.alert.update(db, db_obj=alert, obj_in={"is_read": True})
    return updated_alert


@router.delete("/{alert_id}", status_code=204)
async def delete_alert(
    alert_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete an alert
    """
    alert = crud.alert.get(db, id=alert_id)

    if not alert or alert.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Alert not found")

    crud.alert.remove(db, id=alert_id)
    return None
```

---

## 🔐 Security Implementation

### **core/security.py**

```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import settings

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create JWT access token

    Args:
        data: Payload to encode (should contain 'sub' with user_id)
        expires_delta: Token expiration time (default: 7 days)
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=7)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """
    Decode and verify JWT token

    Returns payload if valid, None if invalid
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
```

### **api/deps.py**

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.core.security import decode_access_token
from app import crud

# Security scheme
security = HTTPBearer()

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Dependency to get current authenticated user

    Extracts JWT from Authorization header and validates it
    """
    token = credentials.credentials

    # Decode token
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id: int = int(payload.get("sub"))

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Get user from database
    user = crud.user.get(db, id=user_id)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    return user
```

---

## 🛠️ Services

### **services/nasa_service.py**

```python
import httpx
from typing import Dict, List
from datetime import date, timedelta
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class NASAService:
    """Client for NASA NeoWs API"""

    BASE_URL = "https://api.nasa.gov/neo/rest/v1"

    def __init__(self):
        self.api_key = settings.NASA_API_KEY

    async def fetch_feed(self, start_date: date, end_date: date) -> Dict:
        """
        Fetch asteroid feed from NASA API

        Args:
            start_date: Start date for feed
            end_date: End date for feed (max 7 days from start)

        Returns:
            Parsed JSON response
        """
        # NASA API allows max 7 days
        if (end_date - start_date).days > 7:
            end_date = start_date + timedelta(days=7)

        url = f"{self.BASE_URL}/feed"
        params = {
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "api_key": self.api_key
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            logger.error(f"NASA API error: {e}")
            raise

    async def lookup_asteroid(self, asteroid_id: str) -> Dict:
        """
        Lookup specific asteroid by ID

        Args:
            asteroid_id: NASA NEO ID

        Returns:
            Asteroid data
        """
        url = f"{self.BASE_URL}/neo/{asteroid_id}"
        params = {"api_key": self.api_key}

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            logger.error(f"NASA API lookup error: {e}")
            raise

    def parse_feed_response(self, response: Dict) -> List[Dict]:
        """
        Parse NASA feed response into structured data

        Returns list of asteroids with close approaches
        """
        asteroids = []

        near_earth_objects = response.get("near_earth_objects", {})

        for date_str, neos in near_earth_objects.items():
            for neo in neos:
                asteroid_data = {
                    "id": neo["id"],
                    "name": neo["name"],
                    "absolute_magnitude": neo.get("absolute_magnitude_h"),
                    "is_hazardous": neo.get("is_potentially_hazardous_asteroid", False),
                    "estimated_diameter_min": neo["estimated_diameter"]["kilometers"]["estimated_diameter_min"],
                    "estimated_diameter_max": neo["estimated_diameter"]["kilometers"]["estimated_diameter_max"],
                    "nasa_jpl_url": neo.get("nasa_jpl_url"),
                    "close_approaches": []
                }

                # Parse close approach data
                for approach in neo.get("close_approach_data", []):
                    approach_data = {
                        "approach_date": approach["close_approach_date"],
                        "approach_date_full": approach["close_approach_date_full"],
                        "velocity_kmh": float(approach["relative_velocity"]["kilometers_per_hour"]),
                        "miss_distance_km": float(approach["miss_distance"]["kilometers"]),
                        "miss_distance_lunar": float(approach["miss_distance"]["lunar"]),
                        "orbiting_body": approach["orbiting_body"]
                    }
                    asteroid_data["close_approaches"].append(approach_data)

                asteroids.append(asteroid_data)

        return asteroids

# Singleton instance
nasa_service = NASAService()
```

### **services/risk_service.py**

```python
from app.models.asteroid import Asteroid
from app.models.close_approach import CloseApproach

def calculate_risk_score(asteroid: Asteroid, approach: CloseApproach) -> str:
    """
    Calculate risk score for an asteroid based on multiple factors

    Returns: "EXTREME", "HIGH", "MODERATE", or "LOW"
    """
    score = 0

    # Factor 1: Hazardous status (0-50 points)
    if asteroid.is_hazardous:
        score += 50

    # Factor 2: Size (0-30 points)
    diameter = asteroid.estimated_diameter_max or 0
    if diameter > 1.0:  # > 1 km
        score += 30
    elif diameter > 0.5:  # 0.5 - 1 km
        score += 20
    elif diameter > 0.1:  # 0.1 - 0.5 km
        score += 10

    # Factor 3: Miss distance (0-20 points)
    lunar_distance = approach.miss_distance_lunar
    if lunar_distance < 1:  # Closer than Moon
        score += 20
    elif lunar_distance < 5:
        score += 15
    elif lunar_distance < 10:
        score += 10
    elif lunar_distance < 20:
        score += 5

    # Categorize
    if score >= 70:
        return "EXTREME"
    elif score >= 50:
        return "HIGH"
    elif score >= 30:
        return "MODERATE"
    else:
        return "LOW"
```

### **services/alert_service.py**

```python
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app import crud
from app.models.alert import Alert
import logging

logger = logging.getLogger(__name__)

class AlertService:
    """Service for generating and managing alerts"""

    def generate_alerts_for_approaches(self, db: Session):
        """
        Check all watchlist entries and generate alerts for upcoming close approaches

        Called by background scheduler
        """
        # Get all watchlist entries
        all_watchlist = crud.watchlist.get_all(db)

        alerts_created = 0

        for entry in all_watchlist:
            asteroid = entry.asteroid

            # Check upcoming approaches (next 30 days)
            upcoming_approaches = [
                app for app in asteroid.close_approaches
                if app.approach_date >= datetime.now().date()
                and app.approach_date <= (datetime.now() + timedelta(days=30)).date()
            ]

            for approach in upcoming_approaches:
                # Check if approach is closer than user's threshold
                if approach.miss_distance_km <= entry.alert_distance_km:

                    # Check if alert already exists
                    existing_alert = crud.alert.get_by_user_asteroid_date(
                        db,
                        user_id=entry.user_id,
                        asteroid_id=asteroid.id,
                        approach_date=approach.approach_date_full
                    )

                    if not existing_alert:
                        # Create alert
                        message = (
                            f"🚨 Close Approach Alert: {asteroid.name} will pass within "
                            f"{approach.miss_distance_lunar:.2f} lunar distances "
                            f"on {approach.approach_date.strftime('%B %d, %Y')}"
                        )

                        crud.alert.create(
                            db,
                            user_id=entry.user_id,
                            asteroid_id=asteroid.id,
                            message=message,
                            alert_type="close_approach",
                            approach_date=approach.approach_date_full
                        )

                        alerts_created += 1

        logger.info(f"Generated {alerts_created} new alerts")
        return alerts_created

# Singleton
alert_service = AlertService()
```

---

## ⏰ Background Scheduler

### **utils/scheduler.py**

```python
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy.orm import Session
from datetime import date, timedelta
from app.database import SessionLocal
from app.services.nasa_service import nasa_service
from app.services.alert_service import alert_service
from app import crud
import logging

logger = logging.getLogger(__name__)

class AsteroidScheduler:
    """Background scheduler for periodic tasks"""

    def __init__(self):
        self.scheduler = BackgroundScheduler()

    def start(self):
        """Start all scheduled jobs"""

        # Job 1: Fetch NASA data every 6 hours
        self.scheduler.add_job(
            func=self.fetch_nasa_data,
            trigger=CronTrigger(hour="*/6"),  # Every 6 hours
            id="fetch_nasa_data",
            name="Fetch NASA asteroid data",
            replace_existing=True
        )

        # Job 2: Generate alerts daily at 8 AM
        self.scheduler.add_job(
            func=self.generate_alerts,
            trigger=CronTrigger(hour=8, minute=0),  # Daily at 8 AM
            id="generate_alerts",
            name="Generate user alerts",
            replace_existing=True
        )

        # Start scheduler
        self.scheduler.start()
        logger.info("Background scheduler started")

    def shutdown(self):
        """Gracefully shutdown scheduler"""
        self.scheduler.shutdown()
        logger.info("Background scheduler stopped")

    async def fetch_nasa_data(self):
        """
        Fetch latest asteroid data from NASA and update database
        """
        db = SessionLocal()

        try:
            logger.info("Starting NASA data fetch...")

            # Fetch next 7 days
            start_date = date.today()
            end_date = start_date + timedelta(days=7)

            # Get data from NASA
            response = await nasa_service.fetch_feed(start_date, end_date)
            asteroids_data = nasa_service.parse_feed_response(response)

            # Upsert to database
            for asteroid_data in asteroids_data:
                # Upsert asteroid
                asteroid = crud.asteroid.upsert(db, asteroid_data=asteroid_data)

                # Upsert close approaches
                for approach_data in asteroid_data["close_approaches"]:
                    crud.close_approach.upsert(
                        db,
                        asteroid_id=asteroid.id,
                        approach_data=approach_data
                    )

            db.commit()
            logger.info(f"Successfully updated {len(asteroids_data)} asteroids")

        except Exception as e:
            logger.error(f"Error fetching NASA data: {e}")
            db.rollback()
        finally:
            db.close()

    def generate_alerts(self):
        """
        Generate alerts for users based on watchlist
        """
        db = SessionLocal()

        try:
            logger.info("Generating alerts...")
            alerts_created = alert_service.generate_alerts_for_approaches(db)
            db.commit()
            logger.info(f"Generated {alerts_created} alerts")
        except Exception as e:
            logger.error(f"Error generating alerts: {e}")
            db.rollback()
        finally:
            db.close()

# Singleton
asteroid_scheduler = AsteroidScheduler()
```

---

## ⚙️ Configuration

### **config.py**

```python
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # App
    APP_NAME: str = "Cosmic Watch API"
    VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Security
    SECRET_KEY: str  # Must be set in .env
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7

    # Database
    DATABASE_URL: str = "sqlite:///./data/cosmic_watch.db"

    # NASA API
    NASA_API_KEY: str = "DEMO_KEY"  # Get real key from https://api.nasa.gov

    # CORS
    FRONTEND_URL: str = "http://localhost:5173"
    ALLOWED_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]

    # Scheduler
    ENABLE_SCHEDULER: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

### **.env.example**

```bash
# Security
SECRET_KEY=your-super-secret-key-change-this-in-production

# NASA API (Get free key at https://api.nasa.gov)
NASA_API_KEY=DEMO_KEY

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Database
DATABASE_URL=sqlite:///./data/cosmic_watch.db

# Debug mode
DEBUG=False
```

---

## 🚀 Main Application

### **main.py**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.database import engine, Base
from app.api.v1 import auth, asteroids, watchlist, alerts
from app.utils.scheduler import asteroid_scheduler

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Lifespan context manager for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Cosmic Watch API...")

    # Create database tables
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")

    # Start background scheduler
    if settings.ENABLE_SCHEDULER:
        asteroid_scheduler.start()

    yield

    # Shutdown
    logger.info("Shutting down Cosmic Watch API...")
    if settings.ENABLE_SCHEDULER:
        asteroid_scheduler.shutdown()

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(asteroids.router, prefix="/api/v1")
app.include_router(watchlist.router, prefix="/api/v1")
app.include_router(alerts.router, prefix="/api/v1")

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Cosmic Watch API",
        "version": settings.VERSION,
        "docs": "/docs"
    }

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

---

## 🐳 Docker Configuration

### **Dockerfile**

```dockerfile
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY ./app ./app

# Create data directory for SQLite
RUN mkdir -p /app/data

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### **docker-compose.yml**

```yaml
version: "3.8"

services:
  backend:
    build: .
    ports:
      - "8000:8000"
    volumes:
      - ./data:/app/data # Persist SQLite database
    environment:
      - SECRET_KEY=${SECRET_KEY}
      - NASA_API_KEY=${NASA_API_KEY}
      - FRONTEND_URL=${FRONTEND_URL}
      - DATABASE_URL=sqlite:///./data/cosmic_watch.db
    env_file:
      - .env
    restart: unless-stopped
```

---

## 📋 Requirements

### **requirements.txt**

```txt
# FastAPI
fastapi==0.109.0
uvicorn[standard]==0.27.0
python-multipart==0.0.6

# Database
sqlalchemy==2.0.25
alembic==1.13.1

# Security
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6

# HTTP Client
httpx==0.26.0

# Scheduler
apscheduler==3.10.4

# Settings
pydantic-settings==2.1.0

# Date handling
python-dateutil==2.8.2

# Testing
pytest==7.4.4
pytest-asyncio==0.23.3
httpx==0.26.0
```

---

## 🧪 Testing

### **tests/conftest.py**

```python
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base
from app.api.deps import get_db

# Test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()
```

### **tests/test_auth.py**

```python
def test_register_user(client):
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "testpass123"}
    )
    assert response.status_code == 201
    assert "access_token" in response.json()

def test_login_user(client):
    # Register first
    client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "testpass123"}
    )

    # Then login
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "testpass123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_invalid_credentials(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "wrong@example.com", "password": "wrongpass"}
    )
    assert response.status_code == 401
```

---

## ✅ Development Checklist

### Phase 1: Setup (3 hours)

- [ ] Initialize FastAPI project
- [ ] Setup SQLAlchemy + SQLite
- [ ] Configure environment variables
- [ ] Create database models
- [ ] Create Pydantic schemas
- [ ] Setup CORS middleware

### Phase 2: Authentication (3 hours)

- [ ] Implement password hashing
- [ ] Implement JWT creation/verification
- [ ] Build auth endpoints (register, login, me)
- [ ] Create auth dependencies (get_current_user)
- [ ] Write auth tests

### Phase 3: NASA Integration (4 hours)

- [ ] Create NASA service client
- [ ] Implement feed fetching
- [ ] Implement data parsing
- [ ] Setup background scheduler
- [ ] Test API integration

### Phase 4: Core Endpoints (6 hours)

- [ ] Asteroid feed endpoint with filters
- [ ] Asteroid detail endpoint
- [ ] Search endpoint
- [ ] Watchlist CRUD endpoints
- [ ] Alerts CRUD endpoints

### Phase 5: Business Logic (3 hours)

- [ ] Risk score calculation
- [ ] Alert generation service
- [ ] Database CRUD operations
- [ ] Data validation

### Phase 6: Testing & Deployment (3 hours)

- [ ] Unit tests for services
- [ ] Integration tests for endpoints
- [ ] Create Dockerfile
- [ ] Create docker-compose.yml
- [ ] Generate Postman collection
- [ ] Documentation

---

## 🎯 API Testing with Postman

### Collection Structure

```
Cosmic Watch API
├── Auth
│   ├── Register
│   ├── Login
│   └── Get Profile
├── Asteroids
│   ├── Get Feed (Today)
│   ├── Get Feed (Date Range)
│   ├── Get Feed (Hazardous Only)
│   ├── Search by Name
│   └── Get by ID
├── Watchlist (Protected)
│   ├── Get My Watchlist
│   ├── Add to Watchlist
│   ├── Update Alert Threshold
│   └── Remove from Watchlist
└── Alerts (Protected)
    ├── Get All Alerts
    ├── Get Unread Alerts
    ├── Mark as Read
    └── Delete Alert
```

### Environment Variables

```json
{
  "base_url": "http://localhost:8000/api/v1",
  "token": "{{access_token}}"
}
```

---

This is your **complete backend blueprint**! 🎯 Everything is production-ready and deployment-friendly!
