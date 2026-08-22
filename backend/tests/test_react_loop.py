from app.engine.planner import planner
from app.engine.react_loop import react_loop_controller, MAX_ITERATIONS


def test_react_loop_execution_and_max_iterations():
    plan = planner.plan(
        objective="Analyze AI medical imaging and identify threats",
        domain="Medical AI",
        target_competitors=["OmniHealth Labs"],
        depth="standard"
    )

    sources, trace, contradictions, weak_signals, gaps = react_loop_controller.execute_plan(
        plan=plan,
        domain="Medical AI",
        competitors=["OmniHealth Labs"]
    )

    assert len(sources) >= 3
    assert len(trace) <= MAX_ITERATIONS
    assert len(trace) >= 2

    # Check safe execution trace format
    for step in trace:
        assert step.step >= 1
        assert len(step.action) > 0
        assert len(step.tool_selected) > 0
        assert len(step.tool_rationale) > 0
        assert step.result_count >= 0
        assert step.status in ["completed", "no_results"]


def test_react_loop_dynamic_replanning():
    plan = planner.plan(
        objective="Examine commercial release vs regulatory clearances",
        domain="Medical AI",
        target_competitors=["OmniHealth Labs"]
    )

    sources, trace, contradictions, weak_signals, gaps = react_loop_controller.execute_plan(
        plan=plan,
        domain="Medical AI",
        competitors=["OmniHealth Labs"]
    )

    assert len(contradictions) >= 1
    # Check that at least one trace step reflects the cross-examination / replan
    trace_actions = [t.action for t in trace]
    assert any("sec_financial_filings" in a or "academic_research" in a for a in trace_actions)
