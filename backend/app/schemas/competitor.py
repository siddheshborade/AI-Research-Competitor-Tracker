from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, ConfigDict, Field


class CompetitorBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    domain: Optional[str] = None
    ticker: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None
    threat_level: str = Field(default="medium", description="Threat level: low, medium, high, critical")
    market_cap: Optional[str] = None
    headquarters: Optional[str] = None
    key_products: List[str] = Field(default_factory=list)
    metadata_json: Dict[str, Any] = Field(default_factory=dict)


class CompetitorCreate(CompetitorBase):
    pass


class CompetitorResponse(CompetitorBase):
    id: str
    created_at: datetime
    updated_at: datetime
    insights_count: Optional[int] = 0
    confidence: Optional[float] = 0.88
    research_signals_count: Optional[int] = 4
    patent_signals_count: Optional[int] = 3
    news_signals_count: Optional[int] = 5
    strategic_signals_count: Optional[int] = 2
    last_activity: Optional[str] = "Recent live telemetry"
    summary: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class CompetitorDetailResponse(CompetitorResponse):
    top_threats: List[str] = Field(default_factory=list)
    top_opportunities: List[str] = Field(default_factory=list)
    research_activity: List[Dict[str, Any]] = Field(default_factory=list)
    patent_activity: List[Dict[str, Any]] = Field(default_factory=list)
    news_activity: List[Dict[str, Any]] = Field(default_factory=list)
    evidence: List[Dict[str, Any]] = Field(default_factory=list)
    related_investigations: List[Dict[str, Any]] = Field(default_factory=list)
    recommendation: Optional[str] = None
    uncertainty: Optional[str] = "LOW"
