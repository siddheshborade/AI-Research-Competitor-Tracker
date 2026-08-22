import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.engine.memory import memory_engine, ShortTermWorkingMemory, PreviousContext
from app.engine.agent_loop import agent_loop_controller, AgentRunResult
from app.models.agent import AgentRun, ToolCallRecord, Claim
from app.models.insight import Insight
from app.models.user import User


def test_task4_test_1_short_term_memory_creation():
    """TEST 1: Start an investigation. Verify short-term memory is created."""
    run_id = f"test_run_{uuid.uuid4().hex[:8]}"
    obj = "Investigate NVIDIA Blackwell tensor architecture developments"
    
    wm = memory_engine.get_or_create_working_memory(
        investigation_id=run_id,
        objective=obj,
        domain="AI Hardware",
        competitors=["NVIDIA"]
    )

    assert wm is not None
    assert wm.investigation_id == run_id
    assert wm.objective == obj
    assert wm.domain == "AI Hardware"
    assert "NVIDIA" in wm.target_competitors
    assert wm.status in ["Running", "Initialized"]
    assert wm.current_step >= 1
    assert len(wm.timeline_events) >= 0


def test_task4_test_2_research_agent_findings_memory_update():
    """TEST 2: Research Agent produces findings. Verify memory is updated."""
    run_id = f"test_run_{uuid.uuid4().hex[:8]}"
    wm = memory_engine.get_or_create_working_memory(
        investigation_id=run_id,
        objective="Analyze low-power edge vision transformer models",
        domain="Edge Compute",
        competitors=["OmniHealth Labs"]
    )

    initial_findings_count = len(wm.intermediate_findings)
    
    # Simulate Research Agent producing findings
    research_findings = [
        "Preprint arXiv:2408.1234: 4-bit quantized attention reduces latency by 45%",
        "Unified memory interconnect benchmarks demonstrate 2.4x bandwidth increase"
    ]
    
    wm.record_step(
        step=1,
        agent="Research Agent",
        action="Execute research_papers",
        tool="research_papers",
        observation="Retrieved 4 verified research papers from ArXiv API.",
        findings=research_findings,
        sources=[{"title": "Paper 1", "publisher": "arXiv.org", "url": "https://arxiv.org/abs/2408.1234"}],
        evidence=[{"id": "ev_001", "title": "Paper 1", "type": "paper"}]
    )

    assert len(wm.intermediate_findings) == initial_findings_count + len(research_findings)
    assert wm.sources_count >= 1
    assert wm.evidence_count >= 1
    assert "Research Agent" in wm.agents_used
    assert "research_papers" in wm.tools_used
    assert wm.current_step == 1
    assert wm.steps_history[-1].agent == "Research Agent"


def test_task4_test_3_next_agent_receives_relevant_context(db_session: Session):
    """TEST 3: Run the next agent. Verify it receives relevant context from the previous agent."""
    result: AgentRunResult = agent_loop_controller.run(
        objective="Investigate NVIDIA AI edge inference strategy and market partnerships",
        domain="Edge Compute",
        competitors=["NVIDIA"],
        max_steps=3,
        db=db_session
    )

    assert result.status == "completed"
    assert len(result.tool_activity) >= 2

    # Step 1 was Research Agent, Step 2 was Competitor Agent
    step1_activity = result.tool_activity[0]
    step2_activity = result.tool_activity[1]

    assert step1_activity.agent == "Research Agent"
    assert step2_activity.agent == "Competitor Agent"
    
    # Check that memory timeline recorded context handover
    timeline_events = result.memory["short_term"]["timeline_events"]
    context_passed_events = [e for e in timeline_events if e["event_type"] == "CONTEXT_PASSED"]
    assert len(context_passed_events) >= 1
    assert "Competitor Agent" in context_passed_events[0]["description"] or "Synthesizer" in context_passed_events[0]["description"]


def test_task4_test_4_refresh_browser_memory_persistence(client: TestClient):
    """TEST 4: Refresh the browser. Verify investigation memory remains available."""
    # 1. Trigger agent run
    resp_run = client.post("/api/agent/run", json={
        "message": "Investigate Microsoft edge cloud integration roadmap",
        "domain": "Cloud & Edge",
        "target_competitors": ["Microsoft"],
        "max_steps": 2
    })
    assert resp_run.status_code == 200
    run_id = resp_run.json()["data"]["run_id"]

    # 2. Simulate browser page refresh / new session poll to GET /api/memory/current
    resp_curr = client.get("/api/memory/current")
    assert resp_curr.status_code == 200
    curr_data = resp_curr.json()
    assert curr_data["success"] is True
    assert curr_data["data"]["has_active_context"] is True
    assert curr_data["data"]["working_memory"] is not None
    assert curr_data["data"]["working_memory"]["investigation_id"] == run_id


def test_task4_test_5_backend_restart_database_persistence(db_session: Session):
    """TEST 5: Restart the backend. Verify completed investigation remains in the database."""
    run_id = f"test_run_persist_{uuid.uuid4().hex[:8]}"
    
    # 1. Create and persist working memory directly to database
    wm = ShortTermWorkingMemory(
        investigation_id=run_id,
        objective="Analyze Apple Neural Engine edge patent portfolio",
        domain="Edge AI",
        target_competitors=["Apple"],
        status="Completed"
    )
    
    memory_engine.persist_completed_investigation(
        db=db_session,
        working_memory=wm,
        what="Apple published patents on sparse matrix multiplication on Neural Engine.",
        why="Increasing on-device LLM inference speed without battery penalty.",
        so_what="Benchmark our localized edge SDK against CoreML 8 throughput.",
        classification="THREAT",
        confidence_score=0.94,
        impact_level="high"
    )

    # 2. Simulate complete restart by clearing in-memory caches
    memory_engine._active_working_memories.clear()
    assert len(memory_engine._active_working_memories) == 0

    # 3. Query directly from database
    persisted_run = db_session.query(AgentRun).filter(AgentRun.id == run_id).first()
    assert persisted_run is not None
    assert persisted_run.objective == "Analyze Apple Neural Engine edge patent portfolio"
    assert persisted_run.meta_json["answer"]["what"] == "Apple published patents on sparse matrix multiplication on Neural Engine."
    assert persisted_run.meta_json["answer"]["classification"] == "THREAT"


def test_task4_test_6_second_investigation_same_competitor_recalls_memory(db_session: Session):
    """TEST 6: Start a second investigation about the same competitor/topic. Verify relevant previous memory is retrieved."""
    # 1. Seed past investigation for NVIDIA
    past_run = AgentRun(
        id=f"run_nvidia_seed_{uuid.uuid4().hex[:6]}",
        objective="Investigate NVIDIA Blackwell tensor architecture developments",
        status="completed",
        domain="AI Hardware",
        meta_json={
            "answer": {
                "what": "Prior baseline: NVIDIA announced high-throughput Blackwell clusters.",
                "why": "Preserve data center GPU margin dominance.",
                "so_what": "Evaluate multi-GPU model parallelization."
            },
            "metrics": {"evidence_count": 6}
        }
    )
    db_session.add(past_run)
    db_session.commit()

    # 2. Start second investigation for NVIDIA
    recalled_context = memory_engine.retrieve_relevant_long_term_memory(
        db=db_session,
        objective="What are the newest updates on NVIDIA Blackwell AI accelerators?",
        competitors=["NVIDIA"]
    )

    assert recalled_context is not None
    assert recalled_context.target_entity == "NVIDIA"
    assert "Blackwell" in recalled_context.previous_what or "NVIDIA" in recalled_context.previous_what
    assert recalled_context.relevance_score >= 0.90


def test_task4_test_7_unrelated_investigation_does_not_inject_memory(db_session: Session):
    """TEST 7: Start an investigation about an unrelated topic. Verify unrelated memory is not injected."""
    # Database has NVIDIA run from prior tests.
    # Query unrelated entity/topic "Fintech fraud detection" without NVIDIA
    recalled = memory_engine.retrieve_relevant_long_term_memory(
        db=db_session,
        objective="Analyze algorithmic fraud detection in European banking transactions",
        competitors=["Stripe", "Adyen"]
    )

    # Should not match NVIDIA memory
    if recalled is not None:
        assert recalled.target_entity != "NVIDIA"


def test_task4_test_8_compare_previous_and_current_investigation():
    """TEST 8: Compare previous and current investigation. Verify changes can be displayed."""
    prev_context = PreviousContext(
        previous_run_id="run_past_01",
        previous_objective="Investigate NVIDIA AI hardware advancements",
        target_entity="NVIDIA",
        previous_what="Prior baseline showed high throughput tensor hardware.",
        previous_why="Defending market share against TPU alternatives.",
        previous_so_what="Benchmark our computer vision pipeline against competitor throughput.",
        investigated_at="Aug 20, 2026",
        research_activity="Medium",
        threat_level="Medium",
        sources_count=4,
        signals_count=3
    )

    metrics = memory_engine.compute_comparison_metrics(
        previous_context=prev_context,
        current_sources_count=8,
        current_evidence_count=10,
        current_threat_level="High",
        current_opps_count=2
    )

    assert len(metrics) >= 4
    metric_names = [m.metric_name for m in metrics]
    assert "Research Activity" in metric_names
    assert "Competitor Signals" in metric_names
    assert "Threat Level" in metric_names
    
    # Verify delta changes
    threat_metric = next(m for m in metrics if m.metric_name == "Threat Level")
    assert threat_metric.previous_value == "Medium"
    assert threat_metric.current_value == "High"
    assert threat_metric.delta_status == "INCREASED"

    # Verify temporal delta string
    delta_str = memory_engine.compute_temporal_delta(
        previous_context=prev_context,
        current_what="Accelerated rollout across commercial edge vision deployments.",
        current_evidence_count=8
    )
    assert delta_str is not None
    assert "Compared to previous investigation" in delta_str
    assert "NVIDIA" in delta_str


def test_task4_test_9_what_why_so_what_uses_previous_and_current_context(db_session: Session):
    """TEST 9: Verify WHAT → WHY → SO WHAT can use previous and current context."""
    result: AgentRunResult = agent_loop_controller.run(
        objective="Evaluate NVIDIA AI hardware roadmap changes",
        domain="AI Hardware",
        competitors=["NVIDIA"],
        max_steps=2,
        db=db_session
    )

    assert result.status == "completed"
    assert "what" in result.answer
    assert "why" in result.answer
    assert "so_what" in result.answer
    assert len(result.answer["what"]) > 10
    assert len(result.answer["why"]) > 10
    assert len(result.answer["so_what"]) > 10
    
    # Check that changes_detected / temporal delta is formulated in the answer
    assert "changes_detected" in result.answer
    if result.memory and result.memory.get("has_recalled_memory"):
        assert result.answer["changes_detected"] is not None


def test_task4_test_10_user_isolation_memory_access(db_session: Session):
    """TEST 10: Verify one authenticated user cannot access another user's memory."""
    user_a_id = f"usr_alpha_{uuid.uuid4().hex[:6]}"
    user_b_id = f"usr_beta_{uuid.uuid4().hex[:6]}"

    # User A runs and stores an investigation
    wm_user_a = ShortTermWorkingMemory(
        investigation_id=f"run_usra_{uuid.uuid4().hex[:6]}",
        user_id=user_a_id,
        objective="Investigate DeepSeek proprietary mixture-of-experts architecture",
        domain="LLM Architecture",
        competitors=["DeepSeek"],
        status="Completed"
    )
    
    memory_engine.persist_completed_investigation(
        db=db_session,
        working_memory=wm_user_a,
        what="DeepSeek disclosed dense routing optimizations.",
        why="Minimizing communication overhead across GPU clusters.",
        so_what="Implement similar MoE kernel in our serving engine.",
        classification="OPPORTUNITY"
    )

    # User B queries long-term memory for DeepSeek
    # User B must NOT retrieve User A's memory because of user_id filtering
    recalled_for_user_b = memory_engine.retrieve_relevant_long_term_memory(
        db=db_session,
        objective="DeepSeek proprietary architecture",
        user_id=user_b_id,
        competitors=["DeepSeek"]
    )

    # Verify User B cannot access User A's private investigation record
    assert recalled_for_user_b is None
