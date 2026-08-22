from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field


class ResearchTask(BaseModel):
    id: str
    question: str
    source_types: List[str] = Field(
        ...,
        description="Target source types: research, patent, news, sec_filing, company"
    )
    priority: str = Field(default="medium", description="high, medium, low")
    stopping_condition: str = Field(
        default="At least 2 corroborating sources found or conflict detected",
        description="Explicit criteria for task completion"
    )
    status: str = Field(default="pending", description="pending, in_progress, completed, failed")
    reasoning: Optional[str] = Field(None, description="Why this task is necessary")


class ResearchPlan(BaseModel):
    objective: str
    domain: str
    target_competitors: List[str] = Field(default_factory=list)
    depth: str = Field(default="standard", description="quick, standard, deep")
    search_strategy: str = Field(
        default="Multi-Source Iterative Convergence",
        description="High level strategy for inquiry resolution"
    )
    research_tasks: List[ResearchTask] = Field(default_factory=list)
    overall_stopping_condition: str = Field(
        default="All high-priority tasks completed or max iterations reached",
        description="Global stopping criterion"
    )
    estimated_iterations: int = Field(default=3, ge=1, le=5)


class RawSourceItem(BaseModel):
    title: str
    source: str
    url: Optional[str] = None
    date: Optional[str] = None
    source_type: str = Field(
        ...,
        description="research, patent, news, sec_filing, pricing_page, job_posting, web_article"
    )
    summary: str
    relevance: float = Field(default=0.85, ge=0.0, le=1.0)
    reliability: float = Field(default=0.85, ge=0.0, le=1.0)
    extracted_facts: Dict[str, Any] = Field(default_factory=dict)
    raw_snippet: Optional[str] = None


class ActionStep(BaseModel):
    step: int
    action: str
    tool_name: str
    purpose: str
    query_params: Dict[str, Any] = Field(default_factory=dict)


class ObservationStep(BaseModel):
    step: int
    tool_name: str
    result_count: int
    source_items: List[RawSourceItem] = Field(default_factory=list)
    error: Optional[str] = None


class SafeTraceStep(BaseModel):
    """Safe structured execution trace exposed for demo and evaluation without revealing private chain-of-thought."""
    step: int
    action: str
    purpose: str
    tool_selected: str
    tool_rationale: str
    result_count: int
    key_findings_summary: str
    status: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ContradictionRecord(BaseModel):
    id: str
    claim_a: str
    source_a_title: str
    source_a_url: Optional[str] = None
    source_a_type: str
    claim_b: str
    source_b_title: str
    source_b_url: Optional[str] = None
    source_b_type: str
    conflict_explanation: str
    severity: str = Field(default="high", description="low, medium, high, critical")
    requires_human_verification: bool = True


class WeakSignalRecord(BaseModel):
    id: str
    signal_title: str
    signal_type: str = Field(..., description="academic_spike, patent_filing_shift, hiring_surge, roadmap_leak")
    sources_detected: List[str] = Field(default_factory=list)
    source_count: int
    trend_direction: str = Field(default="emerging", description="emerging, accelerating, fading")
    strategic_relevance: str
    confidence: float = Field(default=0.75, ge=0.0, le=1.0)


class ResearchGapRecord(BaseModel):
    id: str
    area: str
    gap_description: str
    existing_evidence_summary: str
    why_it_matters: str
    potential_opportunity: str


class ConfidenceSignals(BaseModel):
    source_quality_score: float = Field(default=0.85, ge=0.0, le=1.0)
    source_count_score: float = Field(default=0.80, ge=0.0, le=1.0)
    recency_score: float = Field(default=0.90, ge=0.0, le=1.0)
    agreement_score: float = Field(default=0.95, ge=0.0, le=1.0)
    directness_score: float = Field(default=0.85, ge=0.0, le=1.0)
    final_confidence: float = Field(default=0.87, ge=0.0, le=1.0)
    explanation: str


class SynthesizedInsight(BaseModel):
    id: str
    title: str
    # WHAT -> WHY -> SO WHAT
    what: str = Field(..., description="WHAT: Factual observation or market event referencing evidence")
    why: str = Field(..., description="WHY: Underlying competitive drivers and market forces")
    so_what: str = Field(..., description="SO WHAT: Strategic recommendation referencing specific evidence")
    category: str = Field(default="opportunity", description="opportunity, threat, weak_signal, trend, gap, contradiction")
    classification: str = Field(default="Opportunity", description="Opportunity, Threat, Neutral")
    impact_level: str = Field(default="high", description="low, medium, high, critical")
    confidence: ConfidenceSignals
    status: str = Field(default="pending_review", description="pending_review, approved, rejected, flagged")
    requires_human_verification: bool = False
    evidence_indices: List[int] = Field(default_factory=list)
    competitor_name: Optional[str] = None
    action_recommendation: Optional[str] = None


class GraphNode(BaseModel):
    id: str
    type: str = Field(
        ...,
        description="Competitor, Patent, Technology, Research, Trend, Opportunity, Threat"
    )
    label: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    relationship: str = Field(
        ...,
        description="FILED_PATENT, DEVELOPED, RESEARCHED, INDICATES_TREND, CREATES_THREAT, CREATES_OPPORTUNITY, CONTRADICTS, SUPPORTS"
    )
    confidence: float = Field(default=0.9, ge=0.0, le=1.0)
    metadata: Dict[str, Any] = Field(default_factory=dict)


class MultiTypeEvidenceGraph(BaseModel):
    nodes: List[GraphNode] = Field(default_factory=list)
    edges: List[GraphEdge] = Field(default_factory=list)
