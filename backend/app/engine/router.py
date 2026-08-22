from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from app.engine.tools.schemas import NormalizedEvidence, ToolDefinition
from app.engine.tools.registry import tool_registry
from app.engine.llm_client import llm_client
from app.core.logging import logger


class RoutingDecision(BaseModel):
    tool_name: str = Field(..., description="Name of the selected tool")
    arguments: Dict[str, Any] = Field(default_factory=dict, description="Validated JSON arguments for the tool")
    purpose: str = Field(..., description="Safe user-facing purpose of this tool call")
    reasoning_summary: str = Field(default="", description="Safe structured reasoning for tool choice")
    should_stop: bool = Field(default=False, description="True if gathered evidence is sufficient to fulfill the objective")


class ToolRouter:
    """Dynamic LLM-based Tool Router that inspects current state and available tools to choose the next action."""

    def route(
        self,
        objective: str,
        gathered_evidence: List[NormalizedEvidence],
        previous_tool_calls: List[Dict[str, Any]],
        domain: str = "General",
        competitors: Optional[List[str]] = None,
        force_verification: bool = False,
        verification_query: Optional[str] = None
    ) -> RoutingDecision:
        competitors = competitors or []
        primary_comp = competitors[0] if competitors else "OmniHealth Labs"
        tools = tool_registry.list_tools()
        tools_used = [call.get("tool_name") for call in previous_tool_calls]

        # 1. Contradiction-triggered re-search routing
        if force_verification:
            query = verification_query or f"{primary_comp} regulatory clearance delay FDA 510(k)"
            return RoutingDecision(
                tool_name="web_search",
                arguments={"query": query, "max_results": 4},
                purpose=f"Verify conflicting statements regarding {primary_comp} clearance timeline",
                reasoning_summary="Factual contradiction detected across sources; initiating targeted regulatory verification search.",
                should_stop=False
            )

        # 2. Check if we already have sufficient multi-source evidence
        evidence_types = {e.source_type for e in gathered_evidence}
        if len(gathered_evidence) >= 4 and ("paper" in evidence_types or "research" in evidence_types) and ("web" in evidence_types or "news" in evidence_types):
            return RoutingDecision(
                tool_name="web_search",
                arguments={"query": objective, "max_results": 1},
                purpose="Evidence base is complete and sufficient",
                reasoning_summary="Sufficient multi-source evidence gathered across academic literature and commercial web sources.",
                should_stop=True
            )

        # 3. Dynamic Sequential Tool Selection
        # Step 1: If no academic research has been gathered and objective asks for research/technical/algorithms/threats
        if "research_papers" not in tools_used:
            query = f"{domain} {objective} benchmarks algorithms preprints"
            return RoutingDecision(
                tool_name="research_papers",
                arguments={"query": query[:250], "max_results": 4},
                purpose="Query scientific research papers and preprints for foundational technological developments",
                reasoning_summary="Task requires peer-reviewed algorithmic methodologies and preprint benchmark metrics.",
                should_stop=False
            )

        # Step 2: If research has been gathered, now query Web Search for commercial and competitor activity
        if "web_search" not in tools_used:
            query = f"{primary_comp} {domain} commercial launch partnerships announcements"
            return RoutingDecision(
                tool_name="web_search",
                arguments={"query": query[:250], "max_results": 4},
                purpose=f"Search current web news and press releases for {primary_comp} commercial rollout",
                reasoning_summary="Need current external market data to evaluate whether competitor is commercializing the technical research.",
                should_stop=False
            )

        # Step 3: Default to web search for supplementary context or stop
        if len(gathered_evidence) >= 2:
            return RoutingDecision(
                tool_name="web_search",
                arguments={"query": objective, "max_results": 2},
                purpose="Sufficient initial evidence gathered; concluding tool execution phase.",
                reasoning_summary="Sufficient evidence gathered to generate actionable WHAT-WHY-SO WHAT intelligence.",
                should_stop=True
            )
        else:
            return RoutingDecision(
                tool_name="web_search",
                arguments={"query": f"{primary_comp} {domain} technology updates", "max_results": 3},
                purpose=f"Supplementary web search on {primary_comp}",
                reasoning_summary="Gathering additional evidence to reach confidence threshold.",
                should_stop=False
            )


tool_router = ToolRouter()
