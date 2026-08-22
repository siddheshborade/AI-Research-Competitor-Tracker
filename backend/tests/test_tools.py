from app.engine.tools.registry import tool_registry
from app.engine.tools.research_tool import AcademicResearchTool
from app.engine.tools.patent_tool import PatentIntelligenceTool
from app.engine.tools.news_tool import IndustryNewsTool
from app.engine.tools.financial_sec_tool import FinancialSECTool
from app.engine.tools.competitor_tool import CompetitorTelemetryTool
from app.engine.types import ResearchTask


def test_tool_selection_reasoning():
    # Patent task
    patent_task = ResearchTask(
        id="t1",
        question="What patents has OmniHealth filed regarding medical imaging?",
        source_types=["patent"],
        priority="high"
    )
    tool, rationale = tool_registry.select_tool_for_task(patent_task)
    assert tool.name == "patent_intelligence"
    assert "Patent" in rationale

    # Research task
    res_task = ResearchTask(
        id="t2",
        question="What foundational research papers and algorithmic benchmarks exist?",
        source_types=["research"],
        priority="high"
    )
    tool, rationale = tool_registry.select_tool_for_task(res_task)
    assert tool.name == "academic_research"
    assert "Academic" in rationale

    # SEC task
    sec_task = ResearchTask(
        id="t3",
        question="What do 10-Q financial disclosures say about R&D spending?",
        source_types=["sec_filing"],
        priority="medium"
    )
    tool, rationale = tool_registry.select_tool_for_task(sec_task)
    assert tool.name == "sec_financial_filings"
    assert "SEC" in rationale


def test_individual_tools_execute():
    res_tool = AcademicResearchTool()
    items = res_tool.execute(query="diffusion models", domain="Medical AI")
    assert len(items) >= 1
    assert items[0].source_type == "research"
    assert items[0].relevance > 0.8

    pat_tool = PatentIntelligenceTool()
    pat_items = pat_tool.execute(query="sensor claims", domain="Medical AI", competitors=["OmniHealth Labs"])
    assert len(pat_items) >= 1
    assert pat_items[0].source_type == "patent"

    news_tool = IndustryNewsTool()
    news_items = news_tool.execute(query="commercial rollout", domain="Medical AI")
    assert len(news_items) >= 1
    assert news_items[0].source_type == "news"

    sec_tool = FinancialSECTool()
    sec_items = sec_tool.execute(query="Form 10-Q", domain="Medical AI")
    assert len(sec_items) >= 1
    assert sec_items[0].source_type == "sec_filing"

    comp_tool = CompetitorTelemetryTool()
    comp_items = comp_tool.execute(query="pricing and careers", domain="Medical AI")
    assert len(comp_items) >= 1


def test_tool_failure_resilience():
    class FailingTool(AcademicResearchTool):
        name = "failing_tool"
        def _fetch_data(self, query, domain, competitors, parameters):
            raise ConnectionError("Simulated network timeout connecting to remote registry.")

    failing = FailingTool()
    # Tool must catch exception and return empty list rather than crashing the system
    results = failing.execute(query="test", domain="test")
    assert results == []
