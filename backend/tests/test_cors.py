from fastapi.testclient import TestClient


def test_cors_headers_allowed_origin(client: TestClient):
    origin = "http://localhost:3000"
    response = client.get("/api/health", headers={"Origin": origin})
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == origin


def test_cors_preflight(client: TestClient):
    origin = "http://localhost:5173"
    response = client.options(
        "/api/research",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == origin
    assert "POST" in response.headers.get("access-control-allow-methods", "")
