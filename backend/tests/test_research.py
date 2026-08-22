from fastapi.testclient import TestClient


def test_create_research_success(client: TestClient):
    payload = {
        "title": "Analyze NextGen Competitor AI Strategy",
        "description": "Examine patent filings, product roadmap, and executive changes for NextGen AI.",
        "domain": "Enterprise AI",
        "target_competitors": ["NextGen AI", "Cognitive Systems"],
        "depth": "deep"
    }
    response = client.post("/api/research", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert "data" in data
    assert data["data"]["objective"]["title"] == payload["title"]
    assert data["data"]["latest_run"]["status"] in ["planning", "completed"]
    assert data["data"]["latest_run"]["depth"] == "deep"
    assert "agent_plan" in data["data"]["latest_run"]


def test_create_research_validation_failure(client: TestClient):
    # Missing required title and description
    payload = {
        "domain": "Enterprise AI"
    }
    response = client.post("/api/research", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "VALIDATION_ERROR"
    assert "details" in data["error"]


def test_get_research_by_id_success(client: TestClient, sample_data):
    obj_id = sample_data["objective"].id
    response = client.get(f"/api/research/{obj_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["objective"]["id"] == obj_id
    assert data["data"]["objective"]["title"] == "Analyze Acme Corp Agent Expansion"
    assert data["data"]["latest_run"]["id"] == sample_data["run"].id
    assert data["data"]["insights_count"] >= 1


def test_get_research_by_id_not_found(client: TestClient):
    response = client.get("/api/research/obj_nonexistent_999")
    assert response.status_code == 404
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "NOT_FOUND"
