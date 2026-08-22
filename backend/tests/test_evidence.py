from fastapi.testclient import TestClient


def test_get_evidence_by_id_success(client: TestClient, sample_data):
    ev_id = sample_data["ev1"].id
    response = client.get(f"/api/evidence/{ev_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    ev_data = data["data"]
    assert ev_data["id"] == ev_id
    assert "content" in ev_data
    assert "source" in ev_data
    assert ev_data["source"]["title"] == "Acme Press Release August 2026"
    assert len(ev_data["outgoing_relationships"]) >= 1
    edge = ev_data["outgoing_relationships"][0]
    assert edge["relationship_type"] == "contradicts"


def test_get_evidence_by_id_not_found(client: TestClient):
    response = client.get("/api/evidence/ev_nonexistent_999")
    assert response.status_code == 404
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "NOT_FOUND"


def test_get_evidence_graph_overview(client: TestClient, sample_data):
    response = client.get("/api/evidence/graph/overview")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    graph = data["data"]
    assert "nodes" in graph
    assert "edges" in graph
    assert len(graph["nodes"]) >= 2
    assert len(graph["edges"]) >= 1
    assert graph["edges"][0]["relationship_type"] == "contradicts"
