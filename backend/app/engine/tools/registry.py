import re
import time
from typing import Dict, List, Optional, Any, Tuple
from app.engine.tools.web_search import WebSearchTool
from app.engine.tools.research_papers import ResearchPapersTool
from app.engine.tools.patent_tool import PatentIntelligenceTool
from app.engine.tools.financial_sec_tool import FinancialSECTool
from app.engine.tools.competitor_tool import CompetitorTelemetryTool
from app.engine.tools.news_tool import IndustryNewsTool
from app.engine.tools.research_tool import AcademicResearchTool
from app.engine.tools.schemas import (
    NormalizedEvidence,
    ToolResult,
    ToolDefinition,
    PatentSearchInput,
    SECFilingsInput,
    CompetitorTelemetryInput,
)
from app.engine.tools.validator import ToolValidator, ToolValidationException
from app.engine.types import ResearchTask, RawSourceItem
from app.core.logging import logger


class ToolRegistry:
    """Central dynamic tool registry for external intelligence tools and strict input validation."""

    def __init__(self):
        self._tools: Dict[str, Any] = {
            "web_search": WebSearchTool(),
            "research_papers": ResearchPapersTool(),
            "patent_intelligence": PatentIntelligenceTool(),
            "sec_financial_filings": FinancialSECTool(),
            "competitor_telemetry": CompetitorTelemetryTool(),
            "industry_news": IndustryNewsTool(),
            "academic_research": AcademicResearchTool(),
        }

    def get_tool(self, name: str) -> Optional[Any]:
        return self._tools.get(name, self._tools.get("web_search"))

    def list_tools(self) -> List[ToolDefinition]:
        """Returns self-descriptive tool metadata exposed to the LLM agent for dynamic routing."""
        definitions = []
        for name in ["web_search", "research_papers", "patent_intelligence", "sec_financial_filings", "competitor_telemetry"]:
            tool = self._tools[name]
            definitions.append(ToolDefinition(
                name=tool.name if hasattr(tool, "name") else name,
                description=tool.description if hasattr(tool, "description") else f"Intelligence tool for {name}",
                when_to_use=tool.when_to_use if hasattr(tool, "when_to_use") else "When domain intelligence is needed",
                when_not_to_use=tool.when_not_to_use if hasattr(tool, "when_not_to_use") else "When another tool is more specific",
                input_schema_name=tool.input_schema.__name__ if hasattr(tool, "input_schema") else "dict"
            ))
        return definitions

    def select_tool_for_task(self, task: ResearchTask) -> Tuple[Any, str]:
        """Dynamically chooses the optimal tool based on task question and target source types, generating rationale."""
        question_lower = task.question.lower()
        source_types = [st.lower() for st in task.source_types]

        # 1. Patent questions
        has_patent_keyword = bool(re.search(r"\b(patent|patents|intellectual property|claims|assignee|uspto|epo)\b", question_lower))
        if "patent" in source_types or has_patent_keyword:
            return (
                self._tools["patent_intelligence"],
                "Selected Patent Intelligence Tool: Task requires verification of intellectual property claims, priority dates, and assignee filing scope."
            )

        # 2. Academic / Research literature
        has_research_keyword = bool(re.search(r"\b(research|academic|paper|papers|arxiv|pubmed|benchmark|benchmarks|algorithm|algorithms|diffusion|federated)\b", question_lower))
        if "research" in source_types or has_research_keyword:
            return (
                self._tools["academic_research"],
                "Selected Academic Research Tool: Task demands peer-reviewed papers and preprint benchmarks to evaluate underlying algorithmic methods."
            )

        # 3. SEC & Financial filings
        has_sec_keyword = bool(re.search(r"\b(sec|10-k|10-q|8-k|edgar|financial|spending|capex|earnings|disclosures|regulatory risk)\b", question_lower))
        if "sec_filing" in source_types or has_sec_keyword:
            return (
                self._tools["sec_financial_filings"],
                "Selected SEC & Financial Tool: Task investigates statutory regulatory disclosures, R&D expenditure growth, and legally binding risk factors."
            )

        # 4. Industry news & press releases
        has_news_keyword = bool(re.search(r"\b(news|announcement|announcements|launch|launches|press release|partnership|partnerships|media|rollout)\b", question_lower))
        if "news" in source_types or has_news_keyword:
            return (
                self._tools["industry_news"],
                "Selected Industry News Tool: Task requires tracking current market releases, executive statements, and trade journal investigations."
            )

        # 5. Competitor telemetry (pricing, hiring, roadmaps)
        has_company_keyword = bool(re.search(r"\b(pricing|hiring|job|jobs|career|careers|developer portal|rate limit|api price)\b", question_lower))
        if "company" in source_types or has_company_keyword:
            return (
                self._tools["competitor_telemetry"],
                "Selected Competitor Telemetry Tool: Task analyzes high-frequency digital footprints including developer API pricing changes and engineering recruiting surges."
            )

        # 6. Default Fallback
        return (
            self._tools["industry_news"],
            "Selected Industry News Tool: Task requires general multi-source market scanning."
        )

    def execute_for_task(
        self,
        task: ResearchTask,
        domain: str = "General",
        competitors: List[str] = None
    ) -> Tuple[str, str, List[RawSourceItem]]:
        """Selects tool, records rationale, and retrieves source items."""
        competitors = competitors or []
        tool, rationale = self.select_tool_for_task(task)
        logger.info(f"Dynamic Tool Selection for task '{task.id}': {getattr(tool, 'name', 'tool')} -> {rationale}")
        
        items = tool.execute(query=task.question, domain=domain, competitors=competitors)
        return getattr(tool, "name", "tool"), rationale, items

    def execute_tool(
        self,
        tool_name: str,
        raw_args: Dict[str, Any],
        purpose: str = "Execute intelligence tool",
        trigger: Optional[str] = None
    ) -> ToolResult:
        """Strictly validates arguments and executes the requested external tool."""
        start_time = time.time()
        tool = self._tools.get(tool_name)

        if not tool:
            logger.error(f"[ToolRegistry] Unknown tool requested: '{tool_name}'")
            return ToolResult(
                status="ERROR",
                tool_name=tool_name,
                purpose=purpose,
                trigger=trigger,
                duration_ms=0,
                items=[],
                error_message=f"Tool '{tool_name}' is not registered in ToolRegistry. Available tools: {list(self._tools.keys())}"
            )

        # 1. Validate Arguments
        schema = getattr(tool, "input_schema", None)
        if schema:
            try:
                validated_args = ToolValidator.validate(schema, raw_args)
            except ToolValidationException as tve:
                logger.warning(f"[ToolRegistry] Validation failed for tool '{tool_name}': {tve.message}")
                return ToolResult(
                    status="INVALID_ARGUMENTS",
                    tool_name=tool_name,
                    purpose=purpose,
                    trigger=trigger,
                    duration_ms=int((time.time() - start_time) * 1000),
                    items=[],
                    error_message=tve.message
                )
        else:
            validated_args = raw_args

        # 2. Execute with Safe Isolation
        try:
            if hasattr(tool, "execute"):
                if hasattr(tool, "input_schema"):
                    result = tool.execute(validated_args, purpose=purpose, trigger=trigger)
                else:
                    query = raw_args.get("query", "")
                    domain = raw_args.get("domain", "General")
                    competitors = raw_args.get("competitors", [])
                    raw_items = tool.execute(query=query, domain=domain, competitors=competitors)
                    
                    normalized = []
                    for it in raw_items:
                        normalized.append(NormalizedEvidence(
                            source_id=getattr(it, "id_or_title", f"src_{tool_name}"),
                            source_type=getattr(it, "source_type", tool_name),
                            title=getattr(it, "title", "Intelligence Record"),
                            publisher=getattr(it, "source", "Registry"),
                            url=getattr(it, "url", None),
                            published_at=getattr(it, "date", "2026-08-15"),
                            snippet=getattr(it, "summary", "")[:280],
                            content_summary=getattr(it, "summary", ""),
                            relevance=0.90,
                            credibility=getattr(it, "credibility_weight", 0.88),
                            extracted_facts=getattr(it, "extracted_facts", {})
                        ))
                    result = ToolResult(
                        status="SUCCESS" if normalized else "NO_RESULTS",
                        tool_name=tool_name,
                        purpose=purpose,
                        trigger=trigger,
                        duration_ms=int((time.time() - start_time) * 1000),
                        items=normalized
                    )
                return result
            else:
                return ToolResult(
                    status="SERVICE_UNAVAILABLE",
                    tool_name=tool_name,
                    purpose=purpose,
                    duration_ms=0,
                    error_message=f"Tool '{tool_name}' has no execute method."
                )
        except Exception as ex:
            logger.error(f"[ToolRegistry] Tool execution crashed: {ex}", exc_info=True)
            return ToolResult(
                status="ERROR",
                tool_name=tool_name,
                purpose=purpose,
                trigger=trigger,
                duration_ms=int((time.time() - start_time) * 1000),
                items=[],
                error_message=f"Tool execution exception: {str(ex)}"
            )


tool_registry = ToolRegistry()
