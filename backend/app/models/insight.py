import datetime
import uuid
from typing import List, Optional
from sqlalchemy import String, Text, DateTime, Float, ForeignKey, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

insight_evidence_association = Table(
    "insight_evidence_association",
    Base.metadata,
    Column("insight_id", String(36), ForeignKey("insights.id"), primary_key=True),
    Column("evidence_id", String(36), ForeignKey("evidence.id"), primary_key=True),
    Column("contribution_role", String(64), default="supporting", nullable=False),  # supporting, contradictory, context
)


class Insight(Base):
    __tablename__ = "insights"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: f"ins_{uuid.uuid4().hex[:12]}")
    run_id: Mapped[str] = mapped_column(String(36), ForeignKey("research_runs.id"), nullable=False)
    objective_id: Mapped[str] = mapped_column(String(36), ForeignKey("research_objectives.id"), nullable=False)
    competitor_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("competitors.id"), nullable=True)
    
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    # Structured WHAT -> WHY -> SO WHAT framework
    what_description: Mapped[str] = mapped_column(Text, nullable=False)
    why_description: Mapped[str] = mapped_column(Text, nullable=False)
    so_what_description: Mapped[str] = mapped_column(Text, nullable=False)
    
    category: Mapped[str] = mapped_column(
        String(64), default="opportunity", nullable=False
    )  # opportunity, threat, weak_signal, trend, gap, contradiction
    impact_level: Mapped[str] = mapped_column(String(32), default="high", nullable=False)  # low, medium, high, critical
    confidence_score: Mapped[float] = mapped_column(Float, default=0.85, nullable=False)
    status: Mapped[str] = mapped_column(
        String(32), default="pending_review", nullable=False
    )  # pending_review, approved, rejected, flagged
    action_recommendation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False
    )

    run = relationship("ResearchRun", back_populates="insights")
    objective = relationship("ResearchObjective", back_populates="insights")
    competitor = relationship("Competitor", back_populates="insights")
    evidence_items = relationship(
        "Evidence",
        secondary=insight_evidence_association,
        back_populates="insights"
    )
    verifications = relationship("VerificationRecord", back_populates="insight", cascade="all, delete-orphan")
