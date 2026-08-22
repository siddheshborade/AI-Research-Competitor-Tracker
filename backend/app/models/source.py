import datetime
import uuid
from typing import Optional, Any
from sqlalchemy import String, DateTime, Float, Boolean, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Source(Base):
    __tablename__ = "sources"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: f"src_{uuid.uuid4().hex[:12]}")
    run_id: Mapped[str] = mapped_column(String(36), ForeignKey("research_runs.id"), nullable=False)
    url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    source_type: Mapped[str] = mapped_column(
        String(64), default="web_article", nullable=False
    )  # sec_filing, financial_report, news, patent, pricing_page, social, web_article
    reliability_score: Mapped[float] = mapped_column(Float, default=0.8, nullable=False)
    verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    published_date: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    author_or_publisher: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    metadata_json: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    run = relationship("ResearchRun", back_populates="sources")
    evidence_items = relationship("Evidence", back_populates="source")
