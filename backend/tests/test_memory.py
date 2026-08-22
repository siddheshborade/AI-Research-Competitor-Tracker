import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.engine.memory import memory_engine, ShortTermWorkingMemory, PreviousContext
from app.models.agent import AgentRun, ToolCallRecord, Claim


def test_short_term_memory_recording():
    wm = memory_engine.get_or_create_working_memory(
        investigation_id="test_run_123",
        objective="Investigate NVIDIA AI hardware strategy",
        domain="Edge Compute",
        competitors=["NVIDIA"]
    )

    # Step 1: Orchestrator
    wm.record_step(
        step=1,
        agent="Orchestrator Agent",
        action="Deconstruct objective",
        tool="Planner",
        observation="Formulated plan",
        findings=["Target: NVIDIA"]
    )

    # Step 2: Research Agent (Academic tools)
    wm.record_step(
        step=2,
        agent="Research Agent",
        action="Query arXiv preprints",
        tool="research_papers",
        observation="Retrieved 4 research papers",
        findings=["Paper 1: High bandwidth memory interconnects", "Paper 2: 1-bit quantization"]
    )

    # Step 3: Competitor Agent (Handover from Research Agent)
    assert len(wm.intermediate_findings) >= 3
    assert "Research Agent" in wm.agents_used

    wm.record_step(
        step=3,
        agent="Competitor Agent",
        action="Query market disclosures",
        tool="web_search",
        observation="Found commercial announcements",
        findings=["NVIDIA partner announcement on edge hardware"]
    )

    assert "Competitor Agent" in wm.agents_used
    assert "research_papers" in wm.tools_used
    assert "web_search" in wm.tools_used
    assert wm.current_step == 3


def test_long_term_memory_retrieval_and_filtering(db_session: Session):
    # Seed a past investigation into NVIDIA
    past_run = AgentRun(
        id="run_nvidia_past_001",
        objective="Investigate NVIDIA AI hardware advancements",
        status="completed",
        domain="Edge Compute",
        meta_json={
            "answer": {
                "what": "NVIDIA disclosed high throughput tensor architectures.",
                "why": "Defending against lower power alternative chips.",
                "so_what": "Evaluate our vision model compatibility."
            },
            "metrics": {"evidence_count": 5}
        }
    )
    db_session.add(past_run)
    db_session.commit()

    # Query matching entity NVIDIA -> should find previous memory
    match = memory_engine.retrieve_relevant_long_term_memory(
        db=db_session,
        objective="What changed in NVIDIA AI hardware since my last investigation?",
        competitors=["NVIDIA"]
    )
    assert match is not None
    assert match.target_entity == "NVIDIA"
    assert "NVIDIA" in match.previous_what

    # Query non-matching entity Microsoft -> should NOT match the NVIDIA run
    match_msft = memory_engine.retrieve_relevant_long_term_memory(
        db=db_session,
        objective="Analyze Microsoft cybersecurity developments",
        competitors=["Microsoft"]
    )
    if match_msft:
        assert match_msft.target_entity == "MICROSOFT"


def test_memory_api_endpoints(client: TestClient):
    # Test GET /api/memory/current
    resp_curr = client.get("/api/memory/current")
    assert resp_curr.status_code == 200
    assert resp_curr.json()["success"] is True

    # Test GET /api/memory/history
    resp_hist = client.get("/api/memory/history")
    assert resp_hist.status_code == 200
    assert resp_hist.json()["success"] is True
    assert "investigations" in resp_hist.json()["data"]

    # Test POST /api/memory/search
    resp_search = client.post("/api/memory/search", json={"query": "NVIDIA hardware"})
    assert resp_search.status_code == 200
    assert resp_search.json()["success"] is True
