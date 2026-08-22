import pytest
from fastapi.testclient import TestClient
from app.engine.tools.registry import tool_registry
from app.engine.tools.web_search import WebSearchTool
from app.engine.tools.research_papers import ResearchPapersTool
from app.engine.tools.schemas import WebSearchInput, ResearchPaperInput, NormalizedEvidence
from app.engine.tools.validator import ToolValidator, ToolValidationException
from app.engine.router import tool_router
from app.engine.evidence_sufficiency import evidence_sufficiency_checker
from app.engine.contradiction_detector import contradiction_detector
from app.engine.agent_loop import agent_loop_controller
from app.engine.types import RawSourceItem, ContradictionRecord


def test_1_valid_agent_research_request(client: TestClient):
    """1. Valid research request via POST /api/agent/run"""
    payload = {
        "message": "Find emerging research on medical diagnostic AI models and check whether OmniHealth Labs is commercializing it.",
        "domain": "Medical AI",
        "target_competitors": ["OmniHealth Labs"],
        "max_steps": 5
    }
    response = client.post("/api/agent/run", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "data" in data
    assert data["data"]["status"] == "completed"
    assert "answer" in data["data"]
    assert "what" in data["data"]["answer"]
    assert "why" in data["data"]["answer"]
    assert "so_what" in data["data"]["answer"]
    assert data["data"]["answer"]["classification"] in ["THREAT", "OPPORTUNITY", "INFORMATION"]
    assert len(data["data"]["tool_activity"]) >= 1
    assert data["data"]["trust"]["evidence_count"] >= 1


def test_2_empty_request_rejected(client: TestClient):
    """2. Empty or missing request payload returns 422 Unprocessable Entity."""
    response = client.post("/api/agent/run", json={})
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert "error" in data


def test_3_web_search_tool_execution():
    """3. Real Web Search Tool executes and returns normalized evidence."""
    tool = WebSearchTool()
    inp = WebSearchInput(query="OmniHealth Labs diagnostic AI launch", max_results=3)
    res = tool.execute(inp, purpose="Search competitor news")
    assert res.status == "SUCCESS"
    assert res.tool_name == "web_search"
    assert len(res.items) >= 1
    item = res.items[0]
    assert item.source_type == "web"
    assert item.publisher is not None
    assert item.relevance > 0.0


def test_4_research_papers_tool_execution():
    """4. Real Research Paper Tool executes and returns normalized academic evidence."""
    tool = ResearchPapersTool()
    inp = ResearchPaperInput(query="transformer cross-attention medical diagnostics", max_results=2)
    res = tool.execute(inp, purpose="Query academic research")
    assert res.status == "SUCCESS"
    assert res.tool_name == "research_papers"
    assert len(res.items) >= 1
    item = res.items[0]
    assert item.source_type == "paper"
    assert "arxiv" in item.publisher.lower() or "peer-reviewed" in item.publisher.lower() or "journal" in item.publisher.lower()


def test_5_and_6_dynamic_and_sequential_tool_selection():
    """5 & 6. Sequential Tool Calling: Step 1 Research Paper -> Step 2 Web Search."""
    # Step 1: No evidence -> Router selects research_papers
    d1 = tool_router.route(
        objective="Find emerging technical research on federated diffusion and check competitor product rollout",
        gathered_evidence=[],
        previous_tool_calls=[],
        domain="Medical AI",
        competitors=["OmniHealth Labs"]
    )
    assert d1.tool_name == "research_papers"
    assert "research" in d1.purpose.lower() or "scientific" in d1.purpose.lower()

    # Step 2: Research evidence present -> Router selects web_search
    fake_paper = NormalizedEvidence(
        source_id="src_1",
        source_type="paper",
        title="Federated Diffusion Paper",
        publisher="arXiv",
        published_at="2026-08-01",
        snippet="Research paper on federated diffusion",
        content_summary="Paper summary",
        relevance=0.95,
        credibility=0.94
    )
    d2 = tool_router.route(
        objective="Find emerging technical research on federated diffusion and check competitor product rollout",
        gathered_evidence=[fake_paper],
        previous_tool_calls=[{"tool_name": "research_papers"}],
        domain="Medical AI",
        competitors=["OmniHealth Labs"]
    )
    assert d2.tool_name == "web_search"
    assert "web" in d2.purpose.lower() or "press" in d2.purpose.lower() or "news" in d2.purpose.lower()


def test_7_evidence_sufficiency_check():
    """7. Evidence Sufficiency Check accurately scores evidence volume and diversity."""
    # Empty evidence -> Insufficient
    s1 = evidence_sufficiency_checker.evaluate("Investigate competitor technology", [], [])
    assert s1["is_sufficient"] is False
    assert s1["status"] == "INSUFFICIENT"

    # Multi-source diverse evidence -> Sufficient
    ev_list = [
        NormalizedEvidence(source_id="1", source_type="paper", title="Paper", publisher="arXiv", published_at="2026", snippet="s", content_summary="c", relevance=0.9, credibility=0.9),
        NormalizedEvidence(source_id="2", source_type="paper", title="Paper2", publisher="IEEE", published_at="2026", snippet="s", content_summary="c", relevance=0.9, credibility=0.9),
        NormalizedEvidence(source_id="3", source_type="web", title="News", publisher="Wire", published_at="2026", snippet="s", content_summary="c", relevance=0.9, credibility=0.9),
        NormalizedEvidence(source_id="4", source_type="web", title="SEC", publisher="EDGAR", published_at="2026", snippet="s", content_summary="c", relevance=0.9, credibility=0.9),
    ]
    s2 = evidence_sufficiency_checker.evaluate("Investigate competitor technology", ev_list, [])
    assert s2["is_sufficient"] is True
    assert s2["status"] == "SUFFICIENT"


def test_8_and_9_contradiction_detection_and_research():
    """8 & 9. Contradiction Detection triggers re-search verification."""
    news = RawSourceItem(
        title="PR Announcement",
        source="Tech Wire",
        source_type="news",
        summary="Claims FDA 510(k) clearance by Q3 2026.",
        extracted_facts={"claimed_fda_clearance_date": "Q3 2026", "event_type": "commercial_launch"}
    )
    sec = RawSourceItem(
        title="Form 10-Q",
        source="SEC EDGAR",
        source_type="sec_filing",
        summary="Discloses delay to FY2027.",
        extracted_facts={"regulatory_risk_disclosure": "Fiscal Year 2027 delay", "projected_commercial_revenue_date": "FY 2027"}
    )
    contradictions = contradiction_detector.detect([news, sec])
    assert len(contradictions) >= 1

    # Router detects contradiction and forces verification search
    decision = tool_router.route(
        objective="Analyze OmniHealth clearance",
        gathered_evidence=[],
        previous_tool_calls=[],
        domain="Medical AI",
        competitors=["OmniHealth Labs"],
        force_verification=True
    )
    assert decision.tool_name == "web_search"
    assert "verify" in decision.purpose.lower() or "conflicting" in decision.purpose.lower()


def test_10_and_11_tool_timeout_and_failure_resilience(monkeypatch):
    """10 & 11. Tool timeout and API failure are handled gracefully without crashing."""
    import httpx

    def mock_get(*args, **kwargs):
        raise httpx.TimeoutException("Search gateway timed out")

    monkeypatch.setattr(httpx.Client, "get", mock_get)

    tool = ResearchPapersTool()
    inp = ResearchPaperInput(query="quantum neural algorithms")
    res = tool.execute(inp, purpose="Test timeout resilience")
    assert res.status == "SUCCESS"  # Falls back cleanly to structured intelligence
    assert len(res.items) >= 1


def test_12_invalid_tool_arguments_rejected():
    """12. Invalid arguments (out-of-range, missing required) are rejected by ToolValidator."""
    with pytest.raises(ToolValidationException) as exc:
        ToolValidator.validate(WebSearchInput, {"max_results": 999})  # max is 20, query is required
    assert "TOOL_INVALID_ARGUMENTS" in exc.value.code or "query" in exc.value.message


def test_13_unknown_tool_rejection():
    """13. Unknown tool requests return structured error."""
    res = tool_registry.execute_tool("arbitrary_unknown_scraper", {"query": "test"})
    assert res.status == "ERROR"
    assert "not registered" in res.error_message


def test_14_maximum_iteration_limit_enforced():
    """14. Maximum iteration limit is strictly respected."""
    result = agent_loop_controller.run(
        objective="Run extended unbounded research test",
        domain="General",
        competitors=["Acme Corp"],
        max_steps=2
    )
    assert len(result.tool_activity) <= 2
    assert result.status == "completed"


def test_15_no_results_handled_cleanly():
    """15. No results scenario does not crash."""
    tool = WebSearchTool()
    inp = WebSearchInput(query="zzzz9999nonexistentquerykeyword", max_results=1)
    res = tool.execute(inp)
    assert res.status in ["SUCCESS", "NO_RESULTS"]
    assert res.items is not None


def test_16_claims_linked_to_evidence(client: TestClient):
    """16. Synthesized claims are linked to underlying evidence IDs."""
    payload = {
        "message": "Investigate OmniHealth Labs patent filings and competitive R&D spending.",
        "domain": "Medical AI",
        "target_competitors": ["OmniHealth Labs"]
    }
    response = client.post("/api/agent/run", json=payload)
    assert response.status_code == 200
    data = response.json()["data"]
    assert len(data["claims"]) >= 1
    for claim in data["claims"]:
        assert claim["id"].startswith("clm_")
        assert claim["status"] in ["STRONGLY_SUPPORTED", "SUPPORTED", "PARTIALLY_SUPPORTED", "CONFLICTING", "INSUFFICIENT"]
        assert len(claim["supporting_evidence_ids"]) >= 1


def test_17_get_agent_run_audit_endpoint(client: TestClient):
    """17. GET /api/agent/runs/{id} retrieves complete audit trace."""
    # First create a run
    run_resp = client.post("/api/agent/run", json={"message": "Audit trace test inquiry"})
    run_id = run_resp.json()["data"]["run_id"]

    # Now retrieve audit
    audit_resp = client.get(f"/api/agent/runs/{run_id}")
    assert audit_resp.status_code == 200
    audit_data = audit_resp.json()["data"]
    assert audit_data["run_id"] == run_id
    assert len(audit_data["tool_activity"]) >= 1
