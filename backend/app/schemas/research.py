from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.source import SourceResponse
from app.schemas.insight import InsightResponse


class ResearchCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255, description="Research objective title or inquiry")
    description: str = Field(..., min_length=5, description="Detailed strategic inquiry or competitor research goal")
    domain: str = Field(default="Enterprise Software", description="Industry domain or sector")
    target_competitors: List[str] = Field(
        default_factory=list,
        description="List of competitor names or domains to investigate"
    )
    depth: str = Field(default="standard", description="Research depth: quick, standard, deep")
    user_id: Optional[str] = None


class ResearchRunResponse(BaseModel):
    id: str
    objective_id: str
    status: str = Field(..., description="queued, planning, searching, synthesizing, completed, failed")
    depth: str
    current_step: str
    agent_plan: Dict[str, Any] = Field(default_factory=dict)
    step_history: List[Dict[str, Any]] = Field(default_factory=list)
    metrics: Dict[str, Any] = Field(default_factory=dict)
    error_message: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ResearchObjectiveResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    title: str
    description: str
    domain: str
    target_competitors: List[str]
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ResearchDetailResponse(BaseModel):
    objective: ResearchObjectiveResponse
    latest_run: Optional[ResearchRunResponse] = None
    sources_scanned_count: int = 0
    evidence_count: int = 0
    insights_count: int = 0
    insights: List[InsightResponse] = Field(default_factory=list)
    sources: List[SourceResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)
