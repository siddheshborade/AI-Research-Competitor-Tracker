from fastapi.testclient import TestClient


def test_404_route_not_found(client: TestClient):
    response = client.get("/api/nonexistent_route_12345")
    assert response.status_code == 404
    data = response.json()
    assert data["success"] is False
    assert "error" in data
    assert data["error"]["code"] == "NOT_FOUND"


def test_405_method_not_allowed(client: TestClient):
    # GET is allowed on /api/health, POST is not
    response = client.post("/api/health")
    assert response.status_code == 405
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "METHOD_NOT_ALLOWED"


def test_422_validation_error_format(client: TestClient):
    # Send empty body where required fields are expected
    response = client.post("/api/research", json={})
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "VALIDATION_ERROR"
    assert "details" in data["error"]
    # Check details is a list of field error dicts
    assert isinstance(data["error"]["details"], list)
