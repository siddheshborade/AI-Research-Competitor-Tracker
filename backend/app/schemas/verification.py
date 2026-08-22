from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class VerificationCreate(BaseModel):
    insight_id: Optional[str] = None
    evidence_id: Optional[str] = None
    reviewer_name: str = Field(..., min_length=2, max_length=255, description="Name of the human reviewer")
    reviewer_role: str = Field(default="analyst", max_length=128, description="Role: analyst, strategist, admin")
    status: str = Field(..., description="Decision: 'verified', 'rejected', or 'flag_for_review'")
    notes: Optional[str] = Field(None, description="Human explanation and justification")
    confidence_adjustment: float = Field(default=0.0, ge=-1.0, le=1.0, description="Optional adjustment to score")


class VerificationResponse(BaseModel):
    id: str
    insight_id: Optional[str] = None
    evidence_id: Optional[str] = None
    reviewer_name: str
    reviewer_role: str
    status: str
    notes: Optional[str] = None
    confidence_adjustment: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
