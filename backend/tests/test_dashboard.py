from fastapi.testclient import TestClient


def test_get_dashboard_summary(client: TestClient, sample_data):
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    dashboard_data = data["data"]
    
    # Check stats
    stats = dashboard_data["stats"]
    assert stats["total_objectives"] >= 1
    assert stats["total_competitors_tracked"] >= 1
    assert stats["total_evidence_nodes"] >= 2
    assert stats["total_insights"] >= 1
    
    # Check breakdown
    breakdown = dashboard_data["breakdown"]
    assert "opportunities" in breakdown
    assert "threats" in breakdown
    assert "weak_signals" in breakdown
    assert "contradictions" in breakdown
    
    # Check collections
    assert isinstance(dashboard_data["recent_insights"], list)
    assert isinstance(dashboard_data["tracked_competitors"], list)
    assert "meta" in dashboard_data
