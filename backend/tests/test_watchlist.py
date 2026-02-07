"""
Watchlist API Tests

Tests for watchlist CRUD operations.
"""
import pytest


class TestGetWatchlist:
    """Tests for GET /api/v1/watchlist"""
    
    def test_get_watchlist_empty(self, client, test_user):
        """Test getting empty watchlist"""
        response = client.get(
            "/api/v1/watchlist",
            headers=test_user["headers"]
        )
        
        assert response.status_code == 200
        assert response.json() == []
    
    def test_get_watchlist_unauthorized(self, client):
        """Test getting watchlist without auth fails"""
        response = client.get("/api/v1/watchlist")
        
        assert response.status_code == 403


class TestAddToWatchlist:
    """Tests for POST /api/v1/watchlist"""
    
    def test_add_to_watchlist_success(self, client, test_user, sample_asteroid):
        """Test adding asteroid to watchlist"""
        response = client.post(
            "/api/v1/watchlist",
            json={"asteroid_id": sample_asteroid.id, "alert_distance_km": 500000},
            headers=test_user["headers"]
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["asteroid_id"] == sample_asteroid.id
        assert data["alert_distance_km"] == 500000
    
    def test_add_duplicate_fails(self, client, test_user, sample_asteroid):
        """Test adding same asteroid twice fails"""
        # First add
        client.post(
            "/api/v1/watchlist",
            json={"asteroid_id": sample_asteroid.id},
            headers=test_user["headers"]
        )
        
        # Second add
        response = client.post(
            "/api/v1/watchlist",
            json={"asteroid_id": sample_asteroid.id},
            headers=test_user["headers"]
        )
        
        assert response.status_code == 400
        assert "already" in response.json()["detail"].lower()
    
    def test_add_nonexistent_asteroid(self, client, test_user):
        """Test adding non-existent asteroid fails"""
        response = client.post(
            "/api/v1/watchlist",
            json={"asteroid_id": "nonexistent123"},
            headers=test_user["headers"]
        )
        
        assert response.status_code == 404


class TestUpdateWatchlist:
    """Tests for PUT /api/v1/watchlist/{asteroid_id}"""
    
    def test_update_alert_distance(self, client, test_user, sample_asteroid):
        """Test updating alert distance"""
        # Add first
        client.post(
            "/api/v1/watchlist",
            json={"asteroid_id": sample_asteroid.id, "alert_distance_km": 500000},
            headers=test_user["headers"]
        )
        
        # Update
        response = client.put(
            f"/api/v1/watchlist/{sample_asteroid.id}",
            json={"alert_distance_km": 1000000},
            headers=test_user["headers"]
        )
        
        assert response.status_code == 200
        assert response.json()["alert_distance_km"] == 1000000
    
    def test_update_nonexistent(self, client, test_user):
        """Test updating non-existent watchlist entry fails"""
        response = client.put(
            "/api/v1/watchlist/nonexistent123",
            json={"alert_distance_km": 1000000},
            headers=test_user["headers"]
        )
        
        assert response.status_code == 404


class TestRemoveFromWatchlist:
    """Tests for DELETE /api/v1/watchlist/{asteroid_id}"""
    
    def test_remove_success(self, client, test_user, sample_asteroid):
        """Test removing from watchlist"""
        # Add first
        client.post(
            "/api/v1/watchlist",
            json={"asteroid_id": sample_asteroid.id},
            headers=test_user["headers"]
        )
        
        # Remove
        response = client.delete(
            f"/api/v1/watchlist/{sample_asteroid.id}",
            headers=test_user["headers"]
        )
        
        assert response.status_code == 204
        
        # Verify removed
        watch_response = client.get(
            "/api/v1/watchlist",
            headers=test_user["headers"]
        )
        assert len(watch_response.json()) == 0
    
    def test_remove_nonexistent(self, client, test_user):
        """Test removing non-existent entry fails"""
        response = client.delete(
            "/api/v1/watchlist/nonexistent123",
            headers=test_user["headers"]
        )
        
        assert response.status_code == 404
