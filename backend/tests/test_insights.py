from fastapi.testclient import TestClient


def test_list_insights(client: TestClient, sample_data):
    response = client.get("/api/insights")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)
    assert len(data["data"]) >= 1


def test_list_insights_filtered(client: TestClient, sample_data):
    obj_id = sample_data["objective"].id
    # Test filtering by category and objective
    response = client.get(f"/api/insights?category=opportunity&objective_id={obj_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    for item in data["data"]:
        assert item["category"] == "opportunity"
        assert item["objective_id"] == obj_id


def test_get_insight_by_id_success(client: TestClient, sample_data):
    ins_id = sample_data["insight"].id
    response = client.get(f"/api/insights/{ins_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    insight_data = data["data"]
    assert insight_data["id"] == ins_id
    # Validate WHAT -> WHY -> SO WHAT
    assert "what_description" in insight_data
    assert "why_description" in insight_data
    assert "so_what_description" in insight_data
    assert len(insight_data["evidence_items"]) >= 1
    assert len(insight_data["verifications"]) >= 1


def test_get_insight_by_id_not_found(client: TestClient):
    response = client.get("/api/insights/ins_nonexistent_000")
    assert response.status_code == 404
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "NOT_FOUND"
