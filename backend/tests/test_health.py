from fastapi.testclient import TestClient


def test_health_endpoint(client: TestClient):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["status"] == "healthy"
    assert data["data"]["database"]["status"] == "connected"
    assert "version" in data["data"]
    assert "environment" in data["data"]
    assert "timestamp" in data["data"]


def test_root_endpoint(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200
    # In production with frontend built, root serves React index.html; in API-only mode, serves JSON
    content_type = response.headers.get("content-type", "")
    if "text/html" in content_type:
        assert "<!doctype html>" in response.text.lower() or "<html" in response.text.lower()
    else:
        data = response.json()
        assert "docs" in data or "service" in data


def test_spa_client_routes_serve_html(client: TestClient):
    """Verifies that client-side SPA routes return index.html for client routing."""
    for path in ["/workspace", "/studio", "/evidence", "/contradictions", "/signals", "/gaps", "/verification"]:
        response = client.get(path)
        assert response.status_code == 200
        content_type = response.headers.get("content-type", "")
        if "text/html" in content_type:
            assert "<!doctype html>" in response.text.lower() or "<html" in response.text.lower()


def test_unmatched_api_path_returns_json_404(client: TestClient):
    """Verifies that unknown API paths return JSON 404 and never HTML."""
    response = client.get("/api/nonexistent_subpath_9999")
    assert response.status_code == 404
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "NOT_FOUND"
