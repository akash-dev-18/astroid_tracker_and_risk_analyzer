"""
Authentication API Tests

Tests for user registration, login, and profile endpoints.
"""
import pytest


class TestAuthRegister:
    """Tests for POST /api/v1/auth/register"""
    
    def test_register_success(self, client):
        """Test successful user registration"""
        response = client.post(
            "/api/v1/auth/register",
            json={"email": "newuser@example.com", "password": "securepass123"}
        )
        
        assert response.status_code == 201
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    def test_register_duplicate_email(self, client):
        """Test registration with existing email fails"""
        user_data = {"email": "duplicate@example.com", "password": "testpass123"}
        
        # First registration
        client.post("/api/v1/auth/register", json=user_data)
        
        # Second registration with same email
        response = client.post("/api/v1/auth/register", json=user_data)
        
        assert response.status_code == 400
        assert "already registered" in response.json()["detail"].lower()
    
    def test_register_invalid_email(self, client):
        """Test registration with invalid email fails"""
        response = client.post(
            "/api/v1/auth/register",
            json={"email": "not-an-email", "password": "testpass123"}
        )
        
        assert response.status_code == 422  # Validation error
    
    def test_register_short_password(self, client):
        """Test registration with short password fails"""
        response = client.post(
            "/api/v1/auth/register",
            json={"email": "test@example.com", "password": "short"}
        )
        
        assert response.status_code == 422  # Validation error


class TestAuthLogin:
    """Tests for POST /api/v1/auth/login"""
    
    def test_login_success(self, client):
        """Test successful login"""
        # Register first
        client.post(
            "/api/v1/auth/register",
            json={"email": "login@example.com", "password": "testpass123"}
        )
        
        # Then login
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "login@example.com", "password": "testpass123"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    def test_login_wrong_password(self, client):
        """Test login with wrong password fails"""
        # Register
        client.post(
            "/api/v1/auth/register",
            json={"email": "wrongpass@example.com", "password": "correctpass"}
        )
        
        # Login with wrong password
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "wrongpass@example.com", "password": "wrongpass"}
        )
        
        assert response.status_code == 401
        assert "incorrect" in response.json()["detail"].lower()
    
    def test_login_nonexistent_user(self, client):
        """Test login with non-existent email fails"""
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "nonexistent@example.com", "password": "anypass123"}
        )
        
        assert response.status_code == 401


class TestAuthMe:
    """Tests for GET /api/v1/auth/me"""
    
    def test_get_profile_success(self, client, test_user):
        """Test getting current user profile"""
        response = client.get(
            "/api/v1/auth/me",
            headers=test_user["headers"]
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == test_user["email"]
        assert data["is_active"] == True
        assert "id" in data
        assert "created_at" in data
        assert "password" not in data  # Password should not be exposed
    
    def test_get_profile_no_token(self, client):
        """Test getting profile without token fails"""
        response = client.get("/api/v1/auth/me")
        
        assert response.status_code == 403  # No credentials provided
    
    def test_get_profile_invalid_token(self, client):
        """Test getting profile with invalid token fails"""
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": "Bearer invalid-token-here"}
        )
        
        assert response.status_code == 401
