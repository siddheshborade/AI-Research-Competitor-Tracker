import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_evaluation_results():
    """Verify Task 6 Evaluation Results endpoint returns 14 categories and 6 benchmark scenarios."""
    response = client.get("/api/v1/evaluation/results")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    eval_data = data["data"]
    
    # Verify overall scores
    assert eval_data["overall_status"] == "PASS"
    assert eval_data["overall_score"] >= 80.0
    assert eval_data["scenarios_tested"] == 6
    assert eval_data["scenarios_passed"] == 6

    # Verify all 6 test scenarios exist
    scenarios = eval_data["scenarios"]
    scenario_types = {s["scenario"] for s in scenarios}
    expected_scenarios = {"NORMAL", "AMBIGUOUS", "ADVERSARIAL", "CONTRADICTORY", "INCOMPLETE", "TOOL_FAILURE"}
    assert expected_scenarios.issubset(scenario_types)

    # Verify all 14 evaluation categories exist
    categories = eval_data["categories"]
    assert len(categories) == 14
    for cat in categories:
        assert cat["status"] == "PASS"
        assert cat["score"] >= cat["benchmark_threshold"]


def test_trigger_evaluation_run():
    """Verify triggering an on-demand evaluation run returns fresh benchmark scores."""
    response = client.post("/api/v1/evaluation/run", json={"repeat_count": 1})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["scenarios_tested"] == 6


def test_get_baseline_comparison():
    """Verify baseline comparison returns comparison against single-step RAG pipeline."""
    response = client.get("/api/v1/evaluation/baseline")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    comparisons = data["data"]
    assert len(comparisons) >= 5
    metrics = [c["metric"] for c in comparisons]
    assert "Groundedness / Hallucination" in metrics
    assert "Tool Failure Recovery" in metrics
