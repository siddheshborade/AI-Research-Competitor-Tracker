import pytest
from app.engine.tools.registry import tool_registry
from app.engine.tools.research_papers import ResearchPapersTool
from app.engine.tools.patent_tool import PatentIntelligenceTool
from app.engine.tools.news_tool import IndustryNewsTool
from app.engine.tools.web_search import WebSearchTool
from app.engine.tools.schemas import ResearchPaperInput, WebSearchInput
from app.engine.types import ResearchTask
from app.engine.langgraph_orchestrator import LangGraphOrchestrator


def test_1_research_papers_tool_execution():
    """Verify ResearchPapersTool executes and produces normalized academic evidence."""
    tool = ResearchPapersTool()
    res = tool.execute(ResearchPaperInput(query="transformer architecture attention", max_results=3))
    assert res.status in ["SUCCESS", "NO_RESULTS"]
    assert len(res.items) > 0
    first = res.items[0]
    assert first.source_type == "paper"
    assert first.title != ""
    assert first.relevance >= 0.80
    assert first.publisher != ""


def test_2_patent_intelligence_tool_execution():
    """Verify PatentIntelligenceTool returns normalized patent claims and USPTO/EPO sources."""
    tool = PatentIntelligenceTool()
    res = tool.execute(query="anomaly synthesis neural networks", domain="Healthcare AI", competitors=["OmniHealth Labs"])
    assert len(res) >= 1
    p = res[0]
    assert p.source_type == "patent"
    assert "patent" in p.source.lower() or "uspto" in p.source.lower() or "epo" in p.source.lower()
    assert p.url is not None


def test_3_industry_news_tool_execution():
    """Verify IndustryNewsTool returns current wire and trade news items."""
    tool = IndustryNewsTool()
    res = tool.execute(query="commercial rollout FDA 510k", domain="Healthcare AI", competitors=["OmniHealth Labs"])
    assert len(res) >= 1
    n = res[0]
    assert n.source_type == "news"
    assert n.title != ""


def test_4_web_search_tool_execution():
    """Verify WebSearchTool returns live/fallback web evidence."""
    tool = WebSearchTool()
    res = tool.execute(WebSearchInput(query="NVIDIA AI accelerators GPU roadmap", max_results=3))
    assert res.status in ["SUCCESS", "NO_RESULTS"]
    assert len(res.items) > 0
    assert res.items[0].source_type == "web"


def test_5_dynamic_tool_selection_by_intent():
    """Verify ToolRegistry dynamically selects appropriate tools based on intent."""
    # 1. Patent Intent
    task_patent = ResearchTask(
        id="t1",
        question="What recent patent applications has NVIDIA filed for chip interconnects?",
        source_types=["patent"],
        assigned_agent="Patent Agent",
        priority="high"
    )
    tool_p, rationale_p = tool_registry.select_tool_for_task(task_patent)
    assert tool_p.name == "patent_intelligence"
    assert "patent" in rationale_p.lower()

    # 2. Research Intent
    task_research = ResearchTask(
        id="t2",
        question="Find recent academic arXiv preprints on federated diffusion benchmarks.",
        source_types=["research"],
        assigned_agent="Research Agent",
        priority="high"
    )
    tool_r, rationale_r = tool_registry.select_tool_for_task(task_research)
    assert "research" in tool_r.name
    assert "research" in rationale_r.lower() or "academic" in rationale_r.lower()

    # 3. News Intent
    task_news = ResearchTask(
        id="t3",
        question="What press releases and announcements were published this week?",
        source_types=["news"],
        assigned_agent="News Agent",
        priority="high"
    )
    tool_n, rationale_n = tool_registry.select_tool_for_task(task_news)
    assert tool_n.name == "industry_news"


def test_6_langgraph_dynamic_decomposition_intent_ordering():
    """Verify LangGraph planner dynamically prioritizes tools according to user objective."""
    orchestrator = LangGraphOrchestrator()

    # Patent-focused query
    state_patent = {
        "user_goal": "What recent patents has NVIDIA filed for GPU architectures?",
        "domain": "Semiconductors",
        "target_competitors": ["NVIDIA"],
        "resource_budget": {"max_steps": 4}
    }
    plan_res_p = orchestrator.planner_node(state_patent)
    tasks_p = plan_res_p["tasks"]
    assert len(tasks_p) > 0
    # First candidate task should be Patent Agent
    assert tasks_p[0]["agent"] == "Patent Agent"
    assert tasks_p[0]["tool"] == "patent_intelligence"

    # Research-focused query
    state_research = {
        "user_goal": "What new research and algorithmic papers are published on generative AI?",
        "domain": "AI Research",
        "target_competitors": ["OpenAI"],
        "resource_budget": {"max_steps": 4}
    }
    plan_res_r = orchestrator.planner_node(state_research)
    tasks_r = plan_res_r["tasks"]
    assert len(tasks_r) > 0
    # First candidate task should be Research Agent
    assert tasks_r[0]["agent"] == "Research Agent"
    assert tasks_r[0]["tool"] == "research_papers"


def test_7_evidence_merging_deduplication_and_prioritization():
    """Verify evidence merger deduplicates items, consolidates citations, and classifies priority."""
    orchestrator = LangGraphOrchestrator()
    sample_state = {
        "evidence": [
            {
                "source_id": "src_1",
                "title": "Cross-Attention Multi-Modal Fusion for Real-Time Diagnostics",
                "publisher": "arXiv.org",
                "url": "https://arxiv.org/abs/2607.08912",
                "relevance": 0.96,
                "credibility": 0.95
            },
            {
                "source_id": "src_2",
                "title": "Cross-Attention Multi-Modal Fusion for Real-Time Diagnostics",  # duplicate title
                "publisher": "IEEE Xplore",
                "url": "https://ieeexplore.ieee.org/document/260708912",
                "relevance": 0.95,
                "credibility": 0.94
            },
            {
                "source_id": "src_3",
                "title": "Preliminary Market Overview of Hospital Diagnostic Trials",
                "publisher": "Health Wire",
                "url": "https://healthwire.com/trials",
                "relevance": 0.78,
                "credibility": 0.80
            }
        ],
        "sources": []
    }
    merged_res = orchestrator.evidence_merger_node(sample_state)
    ev_list = merged_res["evidence"]
    # 2 unique titles after deduplication
    assert len(ev_list) == 2
    # First item is prioritized HIGH and has consolidated secondary source URL
    assert ev_list[0]["priority"] == "HIGH"
    assert len(ev_list[0]["all_sources"]) == 2
    assert "https://arxiv.org/abs/2607.08912" in ev_list[0]["all_sources"]
    assert "https://ieeexplore.ieee.org/document/260708912" in ev_list[0]["all_sources"]


def test_8_end_to_end_task2_agent_investigation(client):
    """Verify full end-to-end multi-source investigation executes and populates evidence."""
    payload = {
        "message": "Track NVIDIA's recent AI research, patent developments, competitor activity and industry news.",
        "domain": "Semiconductors",
        "target_competitors": ["NVIDIA"],
        "max_steps": 4,
        "chaos_mode": False
    }
    resp = client.post("/api/v1/agent/run", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    res_data = data["data"]
    assert res_data["status"] == "completed"
    assert "answer" in res_data
    assert "what" in res_data["answer"]
    assert "so_what" in res_data["answer"]
    assert len(res_data["tool_activity"]) >= 1
    assert res_data["trust"]["evidence_count"] >= 1
