import pytest
import datetime
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.services.tracing_service import tracing_service, sanitize_metadata
from app.models.trace import Trace, TraceSpan
from app.engine.agent_loop import agent_loop_controller


def test_sanitize_metadata_removes_secrets():
    """Verify metadata sanitizer recursively redacts sensitive API keys, passwords, and tokens."""
    dirty_data = {
        "api_key": "secret_live_key_12345",
        "nested": {
            "password": "super_secret_password",
            "token": "bearer_jwt_token",
            "safe_field": "NVIDIA Blackwell B200"
        },
        "query": "Investigate AI patents"
    }
    cleaned = sanitize_metadata(dirty_data)
    assert cleaned["api_key"] == "[REDACTED_SECRET]"
    assert cleaned["nested"]["password"] == "[REDACTED_SECRET]"
    assert cleaned["nested"]["token"] == "[REDACTED_SECRET]"
    assert cleaned["nested"]["safe_field"] == "NVIDIA Blackwell B200"
    assert cleaned["query"] == "Investigate AI patents"


def test_start_and_end_trace_lifecycle(db_session: Session):
    """Verify trace lifecycle from start to end with child spans and DB persistence."""
    trace_id = tracing_service.start_trace(
        investigation_id="test_inv_001",
        name="Test Investigation Trace",
        user_id="user_test",
        meta={"domain": "AI Compute"}
    )
    assert trace_id.startswith("trc_")

    # Start Agent Span
    ag_span = tracing_service.start_span(
        trace_id=trace_id,
        operation="execute_research_agent",
        span_type="AGENT",
        agent_name="Research Agent"
    )
    assert ag_span.startswith("span_")

    # Start Tool Span under Agent
    tool_span = tracing_service.start_span(
        trace_id=trace_id,
        operation="query_arxiv_preprints",
        span_type="TOOL",
        parent_span_id=ag_span,
        agent_name="Research Agent",
        tool_name="research_papers",
        meta={"query": "diffusion models"}
    )
    tracing_service.end_span(trace_id=trace_id, span_id=tool_span, status="SUCCESS", duration_ms=150)
    tracing_service.end_span(trace_id=trace_id, span_id=ag_span, status="SUCCESS", duration_ms=180)

    # End Root Trace with persistence
    trace_ctx = tracing_service.end_trace(trace_id=trace_id, db=db_session)
    assert trace_ctx is not None
    assert trace_ctx.status == "SUCCESS"
    assert trace_ctx.success is True
    assert len(trace_ctx.spans) == 2

    # Verify query
    retrieved = tracing_service.get_trace(trace_id=trace_id, db=db_session)
    assert retrieved is not None
    assert retrieved["trace_id"] == trace_id
    assert len(retrieved["spans"]) == 2


def test_decision_span_recording(db_session: Session):
    """Verify recording structured decision spans with reason codes without chain-of-thought."""
    trace_id = tracing_service.start_trace(
        investigation_id="test_inv_decision",
        name="Decision Test Trace"
    )

    dec_span_id = tracing_service.record_decision_span(
        trace_id=trace_id,
        agent_name="Planner Agent",
        decision="DYNAMIC_PLAN_GENERATED",
        reason_code="INSUFFICIENT_PATENT_EVIDENCE",
        confidence=0.89,
        next_action="Patent Agent",
        duration_ms=20
    )
    assert dec_span_id.startswith("span_")

    trace_ctx = tracing_service.end_trace(trace_id=trace_id, db=db_session)
    assert len(trace_ctx.spans) == 1
    span = trace_ctx.spans[0]
    assert span.span_type == "DECISION"
    assert span.decision_data["reason_code"] == "INSUFFICIENT_PATENT_EVIDENCE"
    assert span.decision_data["confidence"] == 0.89


def test_llm_span_token_handling(db_session: Session):
    """Verify LLM prompt metadata recording without fabricated tokens."""
    trace_id = tracing_service.start_trace(
        investigation_id="test_inv_llm",
        name="LLM Test Trace"
    )

    llm_span_id = tracing_service.record_llm_span(
        trace_id=trace_id,
        model="gemini-1.5-pro",
        prompt_type="strategic_intelligence_synthesis",
        template_id="what_why_so_what_v2",
        duration_ms=420,
        input_tokens=None,
        output_tokens=None,
        total_tokens=None,
        status="SUCCESS"
    )

    trace_ctx = tracing_service.end_trace(trace_id=trace_id, db=db_session)
    span = trace_ctx.spans[0]
    assert span.span_type == "LLM"
    assert span.llm_metadata["model"] == "gemini-1.5-pro"
    assert span.total_tokens is None  # Never fabricated


def test_agent_run_produces_persisted_trace(client: TestClient):
    """Verify that running an agent investigation automatically generates and persists a trace in DB."""
    response = client.post(
        "/api/v1/agent/run",
        json={
            "message": "Investigate NVIDIA AI research and patent applications",
            "domain": "AI Compute",
            "target_competitors": ["NVIDIA"],
            "max_steps": 4
        }
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert "details" in data
    trace_id = data["details"].get("trace_id")
    assert trace_id is not None
    assert trace_id.startswith("trc_")

    # Fetch trace details via API
    trace_resp = client.get(f"/api/v1/traces/{trace_id}")
    assert trace_resp.status_code == 200
    trace_obj = trace_resp.json()["data"]
    assert trace_obj["trace_id"] == trace_id
    assert trace_obj["status"] in ["SUCCESS", "RECOVERED"]
    assert len(trace_obj["spans"]) >= 4

    # Verify spans endpoint
    spans_resp = client.get(f"/api/v1/traces/{trace_id}/spans")
    assert spans_resp.status_code == 200
    spans = spans_resp.json()["data"]
    assert len(spans) >= 4
    span_types = {s["span_type"] for s in spans}
    assert "AGENT" in span_types
    assert "TOOL" in span_types


def test_controlled_failure_injection_trace(client: TestClient):
    """Verify controlled failure injection (patent_timeout) creates error span and fallback span."""
    response = client.post(
        "/api/v1/agent/run",
        json={
            "message": "Audit OmniHealth Labs autonomous diagnostic models",
            "domain": "Healthcare AI",
            "target_competitors": ["OmniHealth Labs"],
            "chaos_mode": True,
            "max_steps": 4
        }
    )
    assert response.status_code == 200
    data = response.json()["data"]
    trace_id = data["details"]["trace_id"]

    trace_resp = client.get(f"/api/v1/traces/{trace_id}")
    assert trace_resp.status_code == 200
    trace_obj = trace_resp.json()["data"]
    assert trace_obj["failure_injected"] == "patent_timeout"

    spans = trace_obj["spans"]
    error_spans = [s for s in spans if s["status"] == "ERROR"]
    fallback_spans = [s for s in spans if s["fallback_used"] or s["status"] == "FALLBACK_RECOVERED"]

    assert len(error_spans) >= 1
    assert "UpstreamTimeoutException" in error_spans[0]["error_type"]
    assert len(fallback_spans) >= 1


def test_trace_summary_metrics_endpoint(client: TestClient):
    """Verify global observability metrics endpoint."""
    response = client.get("/api/v1/traces/summary/metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    metrics = data["data"]
    assert "total_traces" in metrics
    assert "success_rate" in metrics
    assert "average_duration_ms" in metrics
    assert "total_spans" in metrics
    assert "agent_distribution" in metrics
    assert "tool_distribution" in metrics


def test_list_traces_endpoint(client: TestClient):
    """Verify GET /api/v1/traces returns list of recent traces."""
    response = client.get("/api/v1/traces?limit=10")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    traces = data["data"]
    assert isinstance(traces, list)
    if traces:
        assert "trace_id" in traces[0]
        assert "duration_ms" in traces[0]
