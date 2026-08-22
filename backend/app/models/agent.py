import datetime
import uuid
from typing import List, Optional, Any
from sqlalchemy import String, Text, DateTime, Integer, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class AgentRun(Base):
    """Stores full execution history for an autonomous ReAct agent run."""
    __tablename__ = "agent_runs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: f"run_{uuid.uuid4().hex[:12]}")
    objective: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="researching", nullable=False)  # researching, completed, failed
    domain: Mapped[str] = mapped_column(String(128), default="General", nullable=False)
    meta_json: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)

    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    completed_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, nullable=True)

    tool_calls = relationship("ToolCallRecord", back_populates="agent_run", cascade="all, delete-orphan")
    claims = relationship("Claim", back_populates="agent_run", cascade="all, delete-orphan")


class ToolCallRecord(Base):
    """Audit log of real external tool executions made by the agent."""
    __tablename__ = "tool_calls"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: f"call_{uuid.uuid4().hex[:12]}")
    agent_run_id: Mapped[str] = mapped_column(String(36), ForeignKey("agent_runs.id"), nullable=False)
    tool_name: Mapped[str] = mapped_column(String(64), nullable=False)
    arguments_json: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="completed", nullable=False)  # completed, error, re_search, no_results
    purpose: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    trigger: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)  # initial_search, contradiction_detected, insufficient_evidence
    duration_ms: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    result_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    result_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    agent_run = relationship("AgentRun", back_populates="tool_calls")


class Claim(Base):
    """Synthesized intelligence claims linked to underlying evidence."""
    __tablename__ = "claims"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: f"clm_{uuid.uuid4().hex[:12]}")
    agent_run_id: Mapped[str] = mapped_column(String(36), ForeignKey("agent_runs.id"), nullable=False)
    claim_text: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="SUPPORTED", nullable=False)  # STRONGLY_SUPPORTED, SUPPORTED, PARTIALLY_SUPPORTED, CONFLICTING, INSUFFICIENT
    importance: Mapped[str] = mapped_column(String(32), default="HIGH", nullable=False)  # HIGH, MEDIUM, LOW

    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    agent_run = relationship("AgentRun", back_populates="claims")
    evidence_links = relationship("ClaimEvidence", back_populates="claim", cascade="all, delete-orphan")


class ClaimEvidence(Base):
    """Many-to-many relationship linking claims to specific evidence nodes."""
    __tablename__ = "claim_evidence"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: f"ce_{uuid.uuid4().hex[:12]}")
    claim_id: Mapped[str] = mapped_column(String(36), ForeignKey("claims.id"), nullable=False)
    evidence_id: Mapped[str] = mapped_column(String(36), ForeignKey("evidence.id"), nullable=False)
    relationship_type: Mapped[str] = mapped_column(String(32), default="supports", nullable=False)  # supports, contradicts, mentions

    claim = relationship("Claim", back_populates="evidence_links")
