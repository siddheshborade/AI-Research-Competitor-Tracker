from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class WebSearchInput(BaseModel):
    query: str = Field(..., min_length=2, max_length=400, description="Search query keywords")
    max_results: int = Field(default=5, ge=1, le=20, description="Maximum number of search results to return")
    domain_filter: Optional[str] = Field(default=None, max_length=100, description="Optional domain restriction")


class ResearchPaperInput(BaseModel):
    query: str = Field(..., min_length=2, max_length=400, description="Scientific or technical research query")
    max_results: int = Field(default=5, ge=1, le=20, description="Maximum number of research papers to return")
    categories: Optional[List[str]] = Field(default=None, description="Optional academic subject categories (e.g. cs.AI, stat.ML, q-bio)")


class PatentSearchInput(BaseModel):
    query: str = Field(..., min_length=2, max_length=400, description="Patent search query")
    assignee: Optional[str] = Field(default=None, max_length=150, description="Target patent assignee/company")
    max_results: int = Field(default=5, ge=1, le=20)


class SECFilingsInput(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=150, description="Target public company or ticker")
    form_types: Optional[List[str]] = Field(default=["10-K", "10-Q", "8-K"], description="SEC form types to inspect")
    max_results: int = Field(default=5, ge=1, le=20)


class CompetitorTelemetryInput(BaseModel):
    competitor_name: str = Field(..., min_length=2, max_length=150, description="Target competitor name")
    telemetry_type: Optional[str] = Field(default="all", description="pricing | hiring | roadmaps | all")
    max_results: int = Field(default=5, ge=1, le=20)


class NormalizedEvidence(BaseModel):
    """Common evidence structure normalized across all external tool providers."""
    source_id: str
    source_type: str = Field(..., description="web | paper | patent | sec_filing | telemetry")
    title: str
    publisher: str
    url: Optional[str] = None
    published_at: str
    snippet: str
    content_summary: str
    relevance: float = Field(default=0.85, ge=0.0, le=1.0)
    credibility: float = Field(default=0.85, ge=0.0, le=1.0)
    extracted_facts: Dict[str, Any] = Field(default_factory=dict)


class ToolResult(BaseModel):
    """Standardized response from tool execution."""
    status: str = Field(..., description="SUCCESS | TIMEOUT | RATE_LIMIT | AUTH_ERROR | INVALID_RESPONSE | NO_RESULTS | SERVICE_UNAVAILABLE")
    tool_name: str
    purpose: str
    trigger: Optional[str] = None
    duration_ms: int = 0
    items: List[NormalizedEvidence] = Field(default_factory=list)
    error_message: Optional[str] = None


class ToolDefinition(BaseModel):
    """Self-descriptive schema exposed to LLM for dynamic tool selection."""
    name: str
    description: str
    when_to_use: str
    when_not_to_use: str
    input_schema_name: str
