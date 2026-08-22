from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.source import SourceResponse


class EvidenceRelationshipBase(BaseModel):
    target_evidence_id: str
    relationship_type: str = Field(
        ...,
        description="Type of relationship: supports, contradicts, correlates_with, leads_to, supersedes"
    )
    confidence: float = Field(default=0.9, ge=0.0, le=1.0)
    explanation: Optional[str] = None


class EvidenceRelationshipResponse(EvidenceRelationshipBase):
    id: str
    source_evidence_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class EvidenceBase(BaseModel):
    content: str = Field(..., description="Factual excerpt or quoted finding")
    confidence_score: float = Field(default=0.85, ge=0.0, le=1.0)
    credibility_score: float = Field(default=0.85, ge=0.0, le=1.0)
    extracted_facts: Dict[str, Any] = Field(default_factory=dict)
    is_contradiction: bool = False
    is_weak_signal: bool = False
    tags: List[str] = Field(default_factory=list)


class EvidenceCreate(EvidenceBase):
    source_id: Optional[str] = None
    objective_id: str
    run_id: str


class EvidenceResponse(EvidenceBase):
    id: str
    source_id: Optional[str] = None
    run_id: str
    objective_id: str
    created_at: datetime
    source: Optional[SourceResponse] = None
    outgoing_relationships: List[EvidenceRelationshipResponse] = Field(default_factory=list)
    incoming_relationships: List[EvidenceRelationshipResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class EvidenceGraphNode(BaseModel):
    id: str
    label: str
    type: Optional[str] = Field(default="Evidence", description="Competitor, Patent, Technology, Research, Trend, Opportunity, Threat, Evidence")
    is_contradiction: bool = False
    is_weak_signal: bool = False
    confidence_score: float = 0.85
    source_type: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class EvidenceGraphEdge(BaseModel):
    id: str
    source: str
    target: str
    relationship_type: str
    confidence: float = 0.9
    metadata: Dict[str, Any] = Field(default_factory=dict)


class EvidenceGraphData(BaseModel):
    nodes: List[EvidenceGraphNode]
    edges: List[EvidenceGraphEdge]
