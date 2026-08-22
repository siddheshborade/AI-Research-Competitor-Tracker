from pydantic import BaseModel
from app.engine.llm_client import LLMClient
from app.engine.react_loop import ReActLoopController
from app.engine.types import ResearchPlan, ResearchTask


class SampleModel(BaseModel):
    name: str = "default_name"
    score: int = 10


def test_llm_fallback_factory_on_missing_key():
    client = LLMClient(api_key="")
    
    def sample_fallback():
        return SampleModel(name="fallback_success", score=99)

    result = client.generate_structured(
        prompt="Generate sample data",
        response_model=SampleModel,
        fallback_factory=sample_fallback
    )
    assert result.name == "fallback_success"
    assert result.score == 99


def test_all_sources_fail_fallback(monkeypatch):
    controller = ReActLoopController()
    
    # Mock registry so all tools return empty results
    from app.engine.tools.registry import tool_registry
    monkeypatch.setattr(tool_registry, "execute_for_task", lambda task, domain, competitors: ("mock_tool", "mock rationale", []))

    plan = ResearchPlan(
        objective="Analyze impossible technology with zero sources",
        domain="Unknown",
        research_tasks=[
            ResearchTask(
                id="task_fail",
                question="Find non-existent records",
                source_types=["research"]
            )
        ]
    )

    sources, trace, contradictions, weak_signals, gaps = controller.execute_plan(plan)
    assert len(sources) == 0
    assert len(trace) >= 1
    assert trace[0].status == "no_results"
