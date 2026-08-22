from typing import List, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.insight import InsightResponse
from app.schemas.competitor import CompetitorResponse


class DashboardStats(BaseModel):
    total_objectives: int = 0
    active_runs: int = 0
    completed_runs: int = 0
    total_competitors_tracked: int = 0
    total_evidence_nodes: int = 0
    evidence_graph_edges: int = 0
    total_insights: int = 0
    pending_verifications_count: int = 0


class IntelligenceBreakdown(BaseModel):
    opportunities: int = 0
    threats: int = 0
    weak_signals: int = 0
    contradictions: int = 0
    emerging_trends: int = 0
    gaps: int = 0


class DashboardSummaryResponse(BaseModel):
    stats: DashboardStats
    breakdown: IntelligenceBreakdown
    recent_insights: List[InsightResponse] = Field(default_factory=list)
    top_threats: List[InsightResponse] = Field(default_factory=list)
    top_opportunities: List[InsightResponse] = Field(default_factory=list)
    pending_verification_insights: List[InsightResponse] = Field(default_factory=list)
    tracked_competitors: List[CompetitorResponse] = Field(default_factory=list)
    meta: Dict[str, Any] = Field(default_factory=dict)
