from fastapi.testclient import TestClient


def test_list_competitors(client: TestClient, sample_data):
    response = client.get("/api/competitors")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)
    assert len(data["data"]) >= 1
    comp = data["data"][0]
    assert "name" in comp
    assert "threat_level" in comp
    assert "insights_count" in comp


def test_get_competitor_by_id_success(client: TestClient, sample_data):
    comp_id = sample_data["competitor"].id
    response = client.get(f"/api/competitors/{comp_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    comp_detail = data["data"]
    assert comp_detail["id"] == comp_id
    assert comp_detail["name"] == "Acme Corp"
    assert "top_threats" in comp_detail
    assert "top_opportunities" in comp_detail


def test_get_competitor_by_id_not_found(client: TestClient):
    response = client.get("/api/competitors/comp_invalid_999")
    assert response.status_code == 404
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "NOT_FOUND"
