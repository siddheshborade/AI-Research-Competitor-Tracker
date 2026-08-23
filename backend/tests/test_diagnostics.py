import pytest
from fastapi.testclient import TestClient

from app.services.tracing_service import tracing_service
from app.services.diagnostic_service import diagnostic_service


def test_diagnose_healthy_trace(client: TestClient):
    """Verify root-cause diagnosis on a nominal trace returns HEALTHY status."""
    # Run normal investigation
    response = client.post(
        "/api/v1/agent/run",
        json={
            "message": "Investigate NVIDIA transformer model acceleration",
            "domain": "AI Hardware",
            "target_competitors": ["NVIDIA"],
            "max_steps": 3
        }
    )
    assert response.status_code == 200
    trace_id = response.json()["data"]["details"]["trace_id"]

    # Diagnose trace
    diag_resp = client.get(f"/api/v1/traces/{trace_id}/diagnosis")
    assert diag_resp.status_code == 200
    diag_data = diag_resp.json()["data"]
    assert diag_data["trace_id"] == trace_id
    assert diag_data["overall_health"] == "HEALTHY"
    assert diag_data["failed_spans_count"] == 0


def test_diagnose_timeout_trace(client: TestClient):
    """Verify root-cause diagnosis on a trace with injected timeout accurately flags the bottleneck and recommends circuit breaker."""
    # Run investigation with chaos mode
    response = client.post(
        "/api/v1/agent/run",
        json={
            "message": "Audit OmniHealth Labs diagnostic patent applications",
            "domain": "Healthcare AI",
            "target_competitors": ["OmniHealth Labs"],
            "chaos_mode": True,
            "max_steps": 4
        }
    )
    assert response.status_code == 200
    trace_id = response.json()["data"]["details"]["trace_id"]

    # Diagnose trace
    diag_resp = client.get(f"/api/v1/traces/{trace_id}/diagnosis")
    assert diag_resp.status_code == 200
    diag_data = diag_resp.json()["data"]
    assert diag_data["trace_id"] == trace_id
    assert diag_data["overall_health"] in ["RECOVERED_WITH_LATENCY_IMPACT", "DEGRADED"]
    assert diag_data["failed_spans_count"] >= 1
    assert len(diag_data["findings"]) >= 1

    finding = diag_data["findings"][0]
    assert "patent" in finding["component_affected"].lower()
    assert finding["recovery_status"] == "RECOVERED_VIA_FALLBACK"
    assert finding["action_type"] == "ADAPTIVE_CIRCUIT_BREAKER"
    assert "Circuit Breaker" in finding["recommended_action"]


def test_run_before_after_experiment_endpoint(client: TestClient):
    """Verify POST /api/v1/traces/experiment/run executes real baseline vs improved runs and computes real deltas."""
    response = client.post(
        "/api/v1/traces/experiment/run",
        json={
            "objective": "Investigate NVIDIA patent filings and AI compute",
            "domain": "Semiconductors",
            "competitors": ["NVIDIA"]
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    exp = data["data"]
    
    assert exp["status"] == "SUCCESS"
    assert exp["baseline_trace_id"].startswith("trc_")
    assert exp["improved_trace_id"].startswith("trc_")
    assert exp["baseline_latency_ms"] > 0
    assert exp["improved_latency_ms"] > 0
    assert exp["latency_reduction_percent"] >= 0.0
    assert exp["baseline_errors"] >= 1
    assert exp["improved_errors"] == 0
    assert exp["recommendation_applied"] == "ADAPTIVE_FAST_FALLBACK_CIRCUIT_BREAKER"
