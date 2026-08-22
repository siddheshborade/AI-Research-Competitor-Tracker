from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.verification import VerificationResponse
from app.schemas.evidence import EvidenceResponse


class InsightBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    what_description: str = Field(..., description="WHAT: The factual observation or event")
    why_description: str = Field(..., description="WHY: Underlying competitive drivers and causes")
    so_what_description: str = Field(..., description="SO WHAT: Strategic implications and recommendations")
    category: str = Field(
        default="opportunity",
        description="Category: opportunity, threat, weak_signal, trend, gap, contradiction"
    )
    impact_level: str = Field(default="high", description="Impact level: low, medium, high, critical")
    confidence_score: float = Field(default=0.85, ge=0.0, le=1.0)
    status: str = Field(default="pending_review", description="Status: pending_review, approved, rejected, flagged")
    action_recommendation: Optional[str] = None


class InsightCreate(InsightBase):
    objective_id: str
    run_id: str
    competitor_id: Optional[str] = None
    evidence_ids: List[str] = Field(default_factory=list)


class InsightResponse(InsightBase):
    id: str
    run_id: str
    objective_id: str
    competitor_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    verifications: List[VerificationResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class InsightDetailResponse(InsightResponse):
    evidence_items: List[EvidenceResponse] = Field(default_factory=list)
