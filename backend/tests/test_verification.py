from fastapi.testclient import TestClient


def test_create_verification_for_insight(client: TestClient, sample_data):
    ins_id = sample_data["insight"].id
    payload = {
        "insight_id": ins_id,
        "reviewer_name": "Alex Mercer",
        "reviewer_role": "VP Intelligence",
        "status": "verified",
        "notes": "Verified against executive interview notes.",
        "confidence_adjustment": 0.05
    }
    response = client.post("/api/verification", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["data"]["reviewer_name"] == "Alex Mercer"
    assert data["data"]["status"] == "verified"
    
    # Check that the insight's status was updated to 'approved'
    ins_response = client.get(f"/api/insights/{ins_id}")
    assert ins_response.status_code == 200
    assert ins_response.json()["data"]["status"] == "approved"


def test_create_verification_invalid_request(client: TestClient):
    # Missing both insight_id and evidence_id
    payload = {
        "reviewer_name": "Alex Mercer",
        "reviewer_role": "Analyst",
        "status": "verified",
        "notes": "No target specified."
    }
    response = client.post("/api/verification", json=payload)
    assert response.status_code == 400
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_REQUEST"


def test_get_verification_by_id(client: TestClient, sample_data):
    ver_id = sample_data["verification"].id
    response = client.get(f"/api/verification/{ver_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["id"] == ver_id
    assert data["data"]["reviewer_name"] == "Jane Doe"


def test_get_verification_by_id_not_found(client: TestClient):
    response = client.get("/api/verification/ver_nonexistent_888")
    assert response.status_code == 404
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "NOT_FOUND"
