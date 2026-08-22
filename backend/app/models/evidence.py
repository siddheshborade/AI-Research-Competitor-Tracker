import datetime
import uuid
from typing import List, Optional, Any
from sqlalchemy import String, Text, DateTime, Float, Boolean, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Evidence(Base):
    __tablename__ = "evidence"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: f"ev_{uuid.uuid4().hex[:12]}")
    source_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("sources.id"), nullable=True)
    run_id: Mapped[str] = mapped_column(String(36), ForeignKey("research_runs.id"), nullable=False)
    objective_id: Mapped[str] = mapped_column(String(36), ForeignKey("research_objectives.id"), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    confidence_score: Mapped[float] = mapped_column(Float, default=0.85, nullable=False)
    credibility_score: Mapped[float] = mapped_column(Float, default=0.85, nullable=False)
    extracted_facts: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    is_contradiction: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_weak_signal: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    tags: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    source = relationship("Source", back_populates="evidence_items")
    run = relationship("ResearchRun", back_populates="evidence")
    objective = relationship("ResearchObjective", back_populates="evidence")
    
    # Insights association
    insights = relationship(
        "Insight",
        secondary="insight_evidence_association",
        back_populates="evidence_items"
    )

    # Graph Edges
    outgoing_relationships = relationship(
        "EvidenceRelationship",
        foreign_keys="EvidenceRelationship.source_evidence_id",
        back_populates="source_evidence",
        cascade="all, delete-orphan"
    )
    incoming_relationships = relationship(
        "EvidenceRelationship",
        foreign_keys="EvidenceRelationship.target_evidence_id",
        back_populates="target_evidence",
        cascade="all, delete-orphan"
    )


class EvidenceRelationship(Base):
    """Represents directed relationships/edges in the Evidence Graph."""
    __tablename__ = "evidence_relationships"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: f"edge_{uuid.uuid4().hex[:12]}")
    source_evidence_id: Mapped[str] = mapped_column(String(36), ForeignKey("evidence.id"), nullable=False)
    target_evidence_id: Mapped[str] = mapped_column(String(36), ForeignKey("evidence.id"), nullable=False)
    relationship_type: Mapped[str] = mapped_column(
        String(64), nullable=False
    )  # supports, contradicts, correlates_with, leads_to, supersedes
    confidence: Mapped[float] = mapped_column(Float, default=0.9, nullable=False)
    explanation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    source_evidence = relationship("Evidence", foreign_keys=[source_evidence_id], back_populates="outgoing_relationships")
    target_evidence = relationship("Evidence", foreign_keys=[target_evidence_id], back_populates="incoming_relationships")
