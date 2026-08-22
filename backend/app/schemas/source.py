from datetime import datetime
from typing import Optional, Any, Dict
from pydantic import BaseModel, ConfigDict, Field


class SourceBase(BaseModel):
    title: str
    url: Optional[str] = None
    source_type: str = Field(
        default="web_article",
        description="Type of source: sec_filing, financial_report, news, patent, pricing_page, social, web_article"
    )
    reliability_score: float = Field(default=0.8, ge=0.0, le=1.0)
    verified: bool = False
    published_date: Optional[str] = None
    author_or_publisher: Optional[str] = None
    metadata_json: Dict[str, Any] = Field(default_factory=dict)


class SourceCreate(SourceBase):
    pass


class SourceResponse(SourceBase):
    id: str
    run_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
