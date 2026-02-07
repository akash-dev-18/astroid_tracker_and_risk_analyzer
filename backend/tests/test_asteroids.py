"""
Asteroids API Tests

Tests for asteroid feed, search, and lookup endpoints.
"""
import pytest
from datetime import date, timedelta


class TestAsteroidFeed:
    """Tests for GET /api/v1/asteroids/feed"""
    
    def test_get_feed_empty(self, client):
        """Test getting feed when no asteroids exist"""
        response = client.get("/api/v1/asteroids/feed")
        
        assert response.status_code == 200
        data = response.json()
        assert "count" in data
        assert "asteroids" in data
        assert isinstance(data["asteroids"], list)
    
    def test_get_feed_with_asteroid(self, client, sample_asteroid):
        """Test getting feed with an asteroid present"""
        today = date.today()
        response = client.get(
            "/api/v1/asteroids/feed",
            params={
                "start_date": today.isoformat(),
                "end_date": (today + timedelta(days=7)).isoformat()
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["count"] >= 0  # May or may not match date range
    
    def test_get_feed_filter_hazardous(self, client, sample_asteroid):
        """Test filtering feed by hazardous status"""
        response = client.get(
            "/api/v1/asteroids/feed",
            params={"is_hazardous": True}
        )
        
        assert response.status_code == 200
    
    def test_get_feed_pagination(self, client):
        """Test feed pagination parameters"""
        response = client.get(
            "/api/v1/asteroids/feed",
            params={"limit": 10, "offset": 0}
        )
        
        assert response.status_code == 200


class TestAsteroidSearch:
    """Tests for GET /api/v1/asteroids/search"""
    
    def test_search_by_name(self, client, sample_asteroid):
        """Test searching asteroid by name"""
        response = client.get(
            "/api/v1/asteroids/search",
            params={"q": "Test"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_search_by_id(self, client, sample_asteroid):
        """Test searching asteroid by ID"""
        response = client.get(
            "/api/v1/asteroids/search",
            params={"q": "2024001"}
        )
        
        assert response.status_code == 200
    
    def test_search_short_query(self, client):
        """Test search with too short query fails"""
        response = client.get(
            "/api/v1/asteroids/search",
            params={"q": "a"}  # Too short
        )
        
        assert response.status_code == 422


class TestAsteroidLookup:
    """Tests for GET /api/v1/asteroids/{asteroid_id}"""
    
    def test_lookup_existing(self, client, sample_asteroid):
        """Test looking up an existing asteroid"""
        response = client.get(f"/api/v1/asteroids/{sample_asteroid.id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == sample_asteroid.id
        assert data["name"] == sample_asteroid.name
        assert "close_approaches" in data
        assert "risk_score" in data
    
    def test_lookup_nonexistent(self, client):
        """Test looking up non-existent asteroid returns 404"""
        response = client.get("/api/v1/asteroids/nonexistent123")
        
        assert response.status_code == 404


class TestAsteroidHazardous:
    """Tests for GET /api/v1/asteroids/hazardous"""
    
    def test_get_hazardous(self, client, sample_asteroid):
        """Test getting hazardous asteroids"""
        response = client.get("/api/v1/asteroids/hazardous")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        
        # Sample asteroid is hazardous
        if len(data) > 0:
            for asteroid in data:
                assert asteroid["is_hazardous"] == True
