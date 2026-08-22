import pytest
import uuid
from typing import Dict, Any
from sqlalchemy.orm import Session

from app.engine.state import AgentGraphState
from app.engine.langgraph_orchestrator import langgraph_orchestrator, LangGraphOrchestrator
from app.engine.agent_loop import agent_loop_controller, AgentRunResult
from app.engine.memory import memory_engine, ShortTermWorkingMemory, PreviousContext
from app.engine.tools.registry import tool_registry
from app.models.agent import AgentRun


def test_task5_01_dynamic_planning():
    """TEST 1: Dynamic planning - Planner produces hypothesis and tailored subtasks."""
    orchestrator = LangGraphOrchestrator()
    state: AgentGraphState = {
        "investigation_id": "test_inv_01",
        "user_goal": "Investigate whether NVIDIA is entering custom silicon edge vision",
        "domain": "Computer Vision",
        "target_competitors": ["NVIDIA"],
        "resource_budget": {"max_steps": 6, "max_tools": 6, "used_steps": 0, "used_tools": 0}
    }

    result = orchestrator.planner_node(state)
    assert "hypothesis" in result
    assert len(result["hypothesis"]) > 10
    assert result["hypothesis_status"] == "UNRESOLVED"
    assert len(result["tasks"]) >= 3
    assert all("agent" in t and "tool" in t and "priority" in t for t in result["tasks"])


def test_task5_02_adaptive_task_decomposition():
    """TEST 2: Adaptive task decomposition - Different goals produce differentiated plans."""
    orchestrator = LangGraphOrchestrator()
    
    # Patent-focused query
    state_a: AgentGraphState = {
        "investigation_id": "test_inv_02a",
        "user_goal": "Analyze patent claims for low-power edge tensor accelerators",
        "domain": "AI Hardware",
        "target_competitors": ["Apple"],
        "resource_budget": {"max_steps": 6, "max_tools": 6, "used_steps": 0, "used_tools": 0}
    }
    plan_a = orchestrator.planner_node(state_a)
    patent_task_a = next(t for t in plan_a["tasks"] if t["agent"] == "Patent Agent")
    assert patent_task_a["priority"] == "high"

    # News-focused query
    state_b: AgentGraphState = {
        "investigation_id": "test_inv_02b",
        "user_goal": "Evaluate latest industry press announcements and pricing tiers for OpenAI",
        "domain": "Cloud AI",
        "target_competitors": ["OpenAI"],
        "resource_budget": {"max_steps": 6, "max_tools": 6, "used_steps": 0, "used_tools": 0}
    }
    plan_b = orchestrator.planner_node(state_b)
    comp_task_b = next(t for t in plan_b["tasks"] if t["agent"] == "Competitor Agent")
    assert comp_task_b["priority"] == "high"


def test_task5_03_multiple_agents_execution():
    """TEST 3: Multiple agents - Specialized agents contribute observations."""
    orchestrator = LangGraphOrchestrator()
    state: AgentGraphState = {
        "investigation_id": "test_inv_03",
        "user_goal": "Investigate Google TPU v6 infrastructure roadmap",
        "domain": "Hardware",
        "target_competitors": ["Google"],
        "pending_tasks": [
            {"id": "t1", "agent": "Research Agent", "tool": "research_papers", "question": "Google TPU architecture papers"},
            {"id": "t2", "agent": "News Agent", "tool": "industry_news", "question": "Google Cloud TPU announcements"}
        ],
        "tasks": [
            {"id": "t1", "agent": "Research Agent", "tool": "research_papers", "question": "Google TPU architecture papers"},
            {"id": "t2", "agent": "News Agent", "tool": "industry_news", "question": "Google Cloud TPU announcements"}
        ],
        "resource_budget": {"max_steps": 6, "max_tools": 6, "used_steps": 0, "used_tools": 0}
    }

    result = orchestrator.parallel_dispatch_node(state)
    assert len(result["tool_history"]) >= 2
    agents_used = {th["agent"] for th in result["tool_history"]}
    assert "Research Agent" in agents_used
    assert "News Agent" in agents_used


def test_task5_04_conditional_routing():
    """TEST 4: Conditional routing - Dynamic branching based on state."""
    orchestrator = LangGraphOrchestrator()

    # Route after planner
    state_empty: AgentGraphState = {"pending_tasks": []}
    state_active: AgentGraphState = {"pending_tasks": [{"id": "t1"}]}
    assert orchestrator.route_after_planner(state_empty) == "synthesis"
    assert orchestrator.route_after_planner(state_active) == "parallel_dispatch"

    # Route after conflict detector
    state_conflict: AgentGraphState = {"contradictions": [{"id": "c1"}]}
    state_clean: AgentGraphState = {"contradictions": []}
    assert orchestrator.route_after_conflict_check(state_conflict) == "verification_agent"
    assert orchestrator.route_after_conflict_check(state_clean) == "hypothesis_evaluator"

    # Route after self-evaluation
    state_replan: AgentGraphState = {"self_evaluation": {"needs_replanning": True}}
    state_ready: AgentGraphState = {"self_evaluation": {"needs_replanning": False}}
    assert orchestrator.route_after_self_evaluation(state_replan) == "replanner"
    assert orchestrator.route_after_self_evaluation(state_ready) == "red_team"


def test_task5_05_parallel_execution():
    """TEST 5: Parallel execution - Concurrent execution of independent tasks."""
    orchestrator = LangGraphOrchestrator()
    tasks = [
        {"id": f"t_{i}", "agent": "Research Agent", "tool": "web_search", "question": f"Query benchmark {i}"}
        for i in range(4)
    ]
    state: AgentGraphState = {
        "investigation_id": "test_inv_05",
        "user_goal": "Concurrent query testing",
        "pending_tasks": tasks,
        "tasks": tasks,
        "resource_budget": {"max_steps": 6, "max_tools": 6, "used_steps": 0, "used_tools": 0}
    }

    result = orchestrator.parallel_dispatch_node(state)
    assert len(result["completed_tasks"]) == 4
    assert len(result["tool_history"]) == 4


def test_task5_06_shared_state_integrity():
    """TEST 6: Shared state - Comprehensive state retained across execution."""
    result = agent_loop_controller.run(
        objective="Investigate Microsoft AI agent copilot developments",
        domain="AI Software",
        competitors=["Microsoft"],
        max_steps=2
    )

    assert result.status in ["completed", "COMPLETED"]
    assert len(result.evidence) >= 1
    assert len(result.sources) >= 1
    assert len(result.claims) >= 1
    assert result.trust.confidence_score > 0.5


def test_task5_07_checkpoint_creation():
    """TEST 7: Checkpoint creation - LangGraph MemorySaver creates step checkpoints."""
    inv_id = f"test_chk_{uuid.uuid4().hex[:6]}"
    initial_state: AgentGraphState = {
        "investigation_id": inv_id,
        "user_goal": "Investigate AMD ROCm software stack improvements",
        "domain": "GPU Compute",
        "target_competitors": ["AMD"],
        "resource_budget": {"max_steps": 4, "max_tools": 6, "used_steps": 0, "used_tools": 0}
    }

    config = {"configurable": {"thread_id": inv_id}}
    final_state = langgraph_orchestrator.graph.invoke(initial_state, config=config)
    
    assert final_state["status"] == "COMPLETED"
    assert "checkpoint_info" in final_state
    assert final_state["checkpoint_info"]["last_checkpoint"] == "FINAL_SYNTHESIS"


def test_task5_08_checkpoint_recovery():
    """TEST 8: Checkpoint recovery - Retrieve latest checkpoint state from MemorySaver."""
    inv_id = f"test_rec_{uuid.uuid4().hex[:6]}"
    initial_state: AgentGraphState = {
        "investigation_id": inv_id,
        "user_goal": "Checkpoint recovery test",
        "domain": "AI",
        "target_competitors": ["Qualcomm"],
        "resource_budget": {"max_steps": 4, "max_tools": 6, "used_steps": 0, "used_tools": 0}
    }
    config = {"configurable": {"thread_id": inv_id}}
    langgraph_orchestrator.graph.invoke(initial_state, config=config)

    # Inspect checkpoint from MemorySaver
    checkpoint_state = langgraph_orchestrator.graph.get_state(config)
    assert checkpoint_state is not None
    assert checkpoint_state.values.get("investigation_id") == inv_id
    assert checkpoint_state.values.get("status") == "COMPLETED"


def test_task5_09_tool_failure_handling():
    """TEST 9: Tool failure - Tool error caught safely without crashing graph."""
    orchestrator = LangGraphOrchestrator()
    state: AgentGraphState = {
        "investigation_id": "test_inv_09",
        "user_goal": "Tool failure test",
        "is_chaos_mode": True,  # Forces patent tool failure
        "pending_tasks": [
            {"id": "t1", "agent": "Patent Agent", "tool": "patent_intelligence", "question": "Simulated patent query"}
        ],
        "tasks": [
            {"id": "t1", "agent": "Patent Agent", "tool": "patent_intelligence", "question": "Simulated patent query"}
        ],
        "resource_budget": {"max_steps": 6, "max_tools": 6, "used_steps": 0, "used_tools": 0}
    }

    result = orchestrator.parallel_dispatch_node(state)
    assert len(result["tool_failures"]) >= 1
    assert "Patent Agent" in result["tool_failures"][0]["agent"]


def test_task5_10_tool_fallback_mechanism():
    """TEST 10: Tool fallback - Dynamic fallback tool selected and executed."""
    orchestrator = LangGraphOrchestrator()
    state: AgentGraphState = {
        "investigation_id": "test_inv_10",
        "user_goal": "Tool fallback test",
        "is_chaos_mode": True,
        "pending_tasks": [
            {"id": "t1", "agent": "Patent Agent", "tool": "patent_intelligence", "question": "Patent fallback query"}
        ],
        "tasks": [
            {"id": "t1", "agent": "Patent Agent", "tool": "patent_intelligence", "question": "Patent fallback query"}
        ],
        "resource_budget": {"max_steps": 6, "max_tools": 6, "used_steps": 0, "used_tools": 0}
    }

    result = orchestrator.parallel_dispatch_node(state)
    assert len(result["fallback_attempts"]) >= 1
    assert result["fallback_attempts"][0]["fallback_tool"] == "web_search"
    assert result["fallback_attempts"][0]["status"] == "SUCCESS"


def test_task5_11_conflicting_evidence_detection():
    """TEST 11: Conflicting evidence - Detection of opposing source claims."""
    orchestrator = LangGraphOrchestrator()
    state: AgentGraphState = {
        "is_chaos_mode": True,
        "evidence": [
            {"title": "Commercial rollout confirmed for Q2", "publisher": "Source A"},
            {"title": "Silicon packaging delays rollout to Q4", "publisher": "Source B"}
        ]
    }

    result = orchestrator.conflict_detector_node(state)
    assert len(result["contradictions"]) >= 1
    assert result["conflict_status"] == "CONFLICTS_DETECTED"


def test_task5_12_verification_agent_resolution():
    """TEST 12: Verification - Contradiction verified and resolved by Verification Agent."""
    orchestrator = LangGraphOrchestrator()
    state: AgentGraphState = {
        "contradictions": [
            {
                "id": "contra_test",
                "claim_a": "Q2 launch",
                "claim_b": "Q4 delay",
                "source_a": "Source A",
                "source_b": "Source B",
                "resolved": False
            }
        ]
    }

    result = orchestrator.verification_agent_node(state)
    assert result["conflict_status"] == "RESOLVED"
    assert result["contradictions"][0]["resolved"] is True
    assert "Corroborated" in result["contradictions"][0]["resolution"]


def test_task5_13_hypothesis_engine():
    """TEST 13: Hypothesis engine - Evaluates evidence against hypothesis."""
    orchestrator = LangGraphOrchestrator()
    
    # Supported state
    state_supp: AgentGraphState = {
        "hypothesis": "NVIDIA is entering edge vision compute.",
        "evidence": [{"id": "ev1"}, {"id": "ev2"}, {"id": "ev3"}]
    }
    assert orchestrator.hypothesis_evaluator_node(state_supp)["hypothesis_status"] == "SUPPORTED"

    # Weak state
    state_weak: AgentGraphState = {
        "hypothesis": "NVIDIA is entering edge vision compute.",
        "evidence": [{"id": "ev1"}]
    }
    assert orchestrator.hypothesis_evaluator_node(state_weak)["hypothesis_status"] == "WEAK"


def test_task5_14_self_evaluation():
    """TEST 14: Self-evaluation - Assesses evidence completeness and uncertainty."""
    orchestrator = LangGraphOrchestrator()
    state: AgentGraphState = {
        "evidence": [{"id": f"e_{i}"} for i in range(5)],
        "visited_tools": ["research_papers", "web_search"],
        "resource_budget": {"max_steps": 6, "max_tools": 6, "used_steps": 1, "used_tools": 2}
    }

    result = orchestrator.self_evaluator_node(state)
    assert result["confidence"] >= 0.85
    assert result["uncertainty"] == "LOW"
    assert result["self_evaluation"]["evidence_sufficient"] is True


def test_task5_15_autonomous_replanning():
    """TEST 15: Autonomous replanning - Replanner dynamically generates gap-fill task."""
    orchestrator = LangGraphOrchestrator()
    state: AgentGraphState = {
        "user_goal": "Investigate Tesla Dojo supercomputing architecture",
        "target_competitors": ["Tesla"],
        "tasks": [{"id": "t1", "question": "Dojo initial query"}]
    }

    result = orchestrator.replanner_node(state)
    assert len(result["tasks"]) == 2
    assert len(result["pending_tasks"]) == 1
    assert "task_replan_" in result["pending_tasks"][0]["id"]


def test_task5_16_resource_budget():
    """TEST 16: Resource budget - Resource constraints prevent runaway execution."""
    orchestrator = LangGraphOrchestrator()
    state: AgentGraphState = {
        "evidence": [{"id": "e1"}],
        "visited_tools": ["t1", "t2", "t3", "t4", "t5", "t6"],
        "resource_budget": {"max_steps": 6, "max_tools": 6, "used_steps": 6, "used_tools": 6}
    }

    result = orchestrator.self_evaluator_node(state)
    assert result["resource_budget"]["is_exhausted"] is True
    assert result["self_evaluation"]["needs_replanning"] is False


def test_task5_17_loop_deadlock_detection():
    """TEST 17: Loop detection - Repeated consecutive tool calls identified and broken."""
    orchestrator = LangGraphOrchestrator()
    state: AgentGraphState = {
        "evidence": [{"id": "e1"}],
        "visited_tools": ["web_search", "web_search", "web_search", "web_search"],
        "resource_budget": {"max_steps": 6, "max_tools": 6, "used_steps": 2, "used_tools": 4}
    }

    result = orchestrator.self_evaluator_node(state)
    assert result["loop_detected"] is True
    assert orchestrator.route_after_self_evaluation(result) == "synthesis"


def test_task5_18_memory_based_reasoning(db_session: Session):
    """TEST 18: Memory-based reasoning - Historical memory incorporated and compared."""
    # Seed historical memory
    past_run = AgentRun(
        id=f"run_hist_{uuid.uuid4().hex[:6]}",
        objective="Investigate NVIDIA AI hardware developments",
        status="completed",
        domain="AI Hardware",
        meta_json={
            "answer": {"what": "Prior baseline: NVIDIA revealed initial Blackwell preview."},
            "metrics": {"evidence_count": 4}
        }
    )
    db_session.add(past_run)
    db_session.commit()

    result = agent_loop_controller.run(
        objective="What are the newest updates on NVIDIA Blackwell AI accelerators?",
        domain="AI Hardware",
        competitors=["NVIDIA"],
        db=db_session
    )

    assert result.memory["has_recalled_memory"] is True
    assert result.answer["changes_detected"] is not None
    assert "Compared to previous" in result.answer["changes_detected"]


def test_task5_19_red_team_adversarial_challenge():
    """TEST 19: Red-team challenge - Stress-tests final conclusion against counter-hypotheses."""
    orchestrator = LangGraphOrchestrator()
    state: AgentGraphState = {
        "hypothesis": "Competitor is expanding AI hardware deployments.",
        "evidence": [{"id": "ev1", "title": "Paper 1"}, {"id": "ev2", "title": "Announcement 2"}]
    }

    result = orchestrator.red_team_node(state)
    assert "red_team_results" in result
    assert result["red_team_results"]["conclusion_challenged"] is True
    assert result["red_team_results"]["passed"] is True


def test_task5_20_complete_chaos_mode_and_adversarial_test():
    """TEST 20: Complete Chaos Mode - End-to-end autonomous fault injection, recovery, and replanning."""
    result = agent_loop_controller.run(
        objective="Investigate whether Competitor X is entering AI hardware",
        domain="AI Hardware",
        competitors=["Competitor X"],
        max_steps=6,
        chaos_mode=True
    )

    assert result.status in ["completed", "COMPLETED"]
    assert result.details["is_chaos_mode"] is True
    
    # 1. Verify tool failure occurred and was recorded
    assert len(result.details["tool_failures"]) >= 1
    
    # 2. Verify fallback tool activated
    assert len(result.details["fallback_attempts"]) >= 1
    assert result.details["fallback_attempts"][0]["fallback_tool"] == "web_search"
    
    # 3. Verify contradiction was detected and resolved
    assert len(result.details["contradictions"]) >= 1
    assert result.details["contradictions"][0]["resolved"] is True
    
    # 4. Verify autonomous replan executed
    assert len(result.details["tasks"]) > 4
    
    # 5. Verify red-team evaluation ran
    assert result.details["red_team_results"]["conclusion_challenged"] is True
    
    # 6. Verify WHAT -> WHY -> SO WHAT synthesized
    assert "what" in result.answer
    assert "why" in result.answer
    assert "so_what" in result.answer
