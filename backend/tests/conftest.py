"""
Pytest Configuration and Fixtures

Provides test database and client fixtures for API testing.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base
from app.api.deps import get_db


# Test database - in-memory SQLite
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    """
    Create a fresh database for each test function.
    """
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
    
    # Drop tables after test
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    """
    Create a test client with overridden database dependency.
    """
    def override_get_db():
        try:
            yield db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(client):
    """
    Create and return a test user with auth token.
    """
    user_data = {
        "email": "test@example.com",
        "password": "testpass123"
    }
    
    # Register user
    response = client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 201
    
    token = response.json()["access_token"]
    
    return {
        "email": user_data["email"],
        "password": user_data["password"],
        "token": token,
        "headers": {"Authorization": f"Bearer {token}"}
    }


@pytest.fixture
def sample_asteroid(db):
    """
    Create a sample asteroid for testing.
    """
    from app.models.asteroid import Asteroid
    from app.models.close_approach import CloseApproach
    from datetime import date, datetime
    
    asteroid = Asteroid(
        id="2024001",
        name="(2024 Test)",
        absolute_magnitude=25.5,
        is_hazardous=True,
        estimated_diameter_min=0.1,
        estimated_diameter_max=0.2,
        nasa_jpl_url="https://ssd.jpl.nasa.gov/sbdb.cgi?sstr=2024001"
    )
    db.add(asteroid)
    db.commit()
    
    # Add close approach
    approach = CloseApproach(
        asteroid_id="2024001",
        approach_date=date.today(),
        approach_date_full=datetime.now(),
        velocity_kmh=50000,
        miss_distance_km=5000000,
        miss_distance_lunar=13.0,
        orbiting_body="Earth"
    )
    db.add(approach)
    db.commit()
    
    db.refresh(asteroid)
    return asteroid
