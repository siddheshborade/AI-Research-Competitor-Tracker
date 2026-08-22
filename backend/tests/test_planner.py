from app.engine.planner import planner
from app.engine.types import ResearchPlan


def test_planner_generates_structured_plan():
    objective = "Find important developments in AI medical imaging and identify potential threats and opportunities."
    plan = planner.plan(
        objective=objective,
        domain="Medical AI",
        target_competitors=["OmniHealth Labs"],
        depth="standard"
    )

    assert isinstance(plan, ResearchPlan)
    assert plan.domain == "Medical AI"
    assert "OmniHealth Labs" in plan.target_competitors
    assert len(plan.research_tasks) >= 3

    for task in plan.research_tasks:
        assert task.id.startswith("task_")
        assert len(task.question) > 10
        assert len(task.source_types) >= 1
        assert task.priority in ["high", "medium", "low"]
        assert len(task.stopping_condition) > 5
        assert task.reasoning is not None


def test_planner_deep_depth_generates_supplementary_tasks():
    plan = planner.plan(
        objective="Analyze competitor quantum cryptography advances",
        domain="Cybersecurity",
        depth="deep"
    )
    assert len(plan.research_tasks) >= 4
