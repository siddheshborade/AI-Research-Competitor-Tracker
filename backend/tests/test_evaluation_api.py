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


def test_human_evaluation_feedback_lifecycle():
    """Verify submitting and retrieving human evaluation feedback."""
    # 1. Submit review
    post_res = client.post(
        "/api/v1/evaluation/feedback",
        json={
            "rating": "CORRECT",
            "notes": "Verified grounded citations for NVIDIA Blackwell architecture against USPTO.",
            "reviewer": "Lead Analyst",
            "investigation_id": "inv_test_eval_101"
        }
    )
    assert post_res.status_code == 200
    post_data = post_res.json()
    assert post_data["success"] is True
    review = post_data["data"]
    assert review["rating"] == "CORRECT"
    assert review["status"] == "RECORDED"
    assert "feedback_id" in review

    # 2. Get reviews list
    get_res = client.get("/api/v1/evaluation/feedback")
    assert get_res.status_code == 200
    get_data = get_res.json()
    assert get_data["success"] is True
    reviews = get_data["data"]
    assert len(reviews) >= 1
    assert any(r["feedback_id"] == review["feedback_id"] for r in reviews)


def test_live_evaluation_scenario_empirical_properties():
    """Verify live scenario execution produces actual empirical latencies, tool calls, and recovery."""
    response = client.post("/api/v1/evaluation/run", json={"repeat_count": 1})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    eval_data = data["data"]
    
    scenarios = {s["scenario"]: s for s in eval_data["scenarios"]}
    
    # Check Tool Failure recovery
    tool_fail_scen = scenarios["TOOL_FAILURE"]
    assert tool_fail_scen["status"] == "PASS"
    assert tool_fail_scen["recovery_success"] is True
    assert tool_fail_scen["latency_ms"] > 0
    assert tool_fail_scen["tool_calls"] >= 1

    # Check Contradiction handling
    contra_scen = scenarios["CONTRADICTORY"]
    assert contra_scen["status"] == "PASS"
    assert contra_scen["uncertainty_calibrated"] is True
    assert contra_scen["conflicts_resolved"] >= 0

    # Check Incomplete evidence / uncertainty
    incomp_scen = scenarios["INCOMPLETE"]
    assert incomp_scen["status"] == "PASS"
    assert incomp_scen["uncertainty_calibrated"] is True

