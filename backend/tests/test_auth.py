import pytest
from fastapi.testclient import TestClient


def test_auth_login_valid_credentials(client: TestClient):
    payload = {
        "email": "analyst@nexus.ai",
        "password": "nexus_password_2026"
    }
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "token" in data["data"]
    assert data["data"]["user"]["email"] == "analyst@nexus.ai"
    token = data["data"]["token"]

    # Verify GET /api/auth/me
    me_resp = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    assert me_resp.json()["data"]["email"] == "analyst@nexus.ai"

    # Verify POST /api/auth/logout
    logout_resp = client.post("/api/auth/logout", headers={"Authorization": f"Bearer {token}"})
    assert logout_resp.status_code == 200
    assert logout_resp.json()["data"]["logged_out"] is True


def test_auth_login_invalid_payload(client: TestClient):
    # Invalid email format
    response = client.post("/api/auth/login", json={"email": "invalid-email", "password": "123"})
    assert response.status_code == 422


def test_auth_me_unauthorized(client: TestClient):
    response = client.get("/api/auth/me", headers={"Authorization": "Bearer invalid_token_xyz"})
    assert response.status_code == 401
