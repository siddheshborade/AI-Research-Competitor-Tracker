from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from app.engine.types import RawSourceItem
from app.core.logging import logger


class BaseIntelligenceTool(ABC):
    """Abstract base class for all multi-source intelligence gathering tools."""

    name: str = "base_tool"
    description: str = "Base intelligence tool"
    source_type: str = "web_article"

    def execute(
        self,
        query: str,
        domain: str = "General",
        competitors: Optional[List[str]] = None,
        parameters: Optional[Dict[str, Any]] = None
    ) -> List[RawSourceItem]:
        """Executes source retrieval with robust exception handling and fallback resilience."""
        competitors = competitors or []
        parameters = parameters or {}
        try:
            logger.info(f"Tool [{self.name}] executing query: '{query}' (Domain: {domain})")
            results = self._fetch_data(query, domain, competitors, parameters)
            logger.info(f"Tool [{self.name}] returned {len(results)} source items.")
            return results
        except Exception as e:
            logger.error(f"Tool [{self.name}] encountered an execution error: {e}", exc_info=True)
            # Return empty list on failure so the ReAct loop continues gracefully with other sources
            return []

    @abstractmethod
    def _fetch_data(
        self,
        query: str,
        domain: str,
        competitors: List[str],
        parameters: Dict[str, Any]
    ) -> List[RawSourceItem]:
        """Internal retrieval logic implemented by specialized tools."""
        pass
