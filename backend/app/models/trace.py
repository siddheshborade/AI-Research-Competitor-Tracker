import datetime
import uuid
from typing import List, Optional, Any, Dict
from sqlalchemy import String, Text, DateTime, Integer, Float, Boolean, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Trace(Base):
    """
    Task 7: Root Investigation Trace Model.
    Captures complete end-to-end telemetry for an autonomous investigation run.
    """
    __tablename__ = "traces"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: f"trc_{uuid.uuid4().hex[:12]}")
    trace_id: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    investigation_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    user_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(256), nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="RUNNING", nullable=False)  # RUNNING, SUCCESS, FAILED, DEGRADED, RECOVERED
    
    started_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    completed_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, nullable=True)
    duration_ms: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    total_spans: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_tool_calls: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    error_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_tokens: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    success: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    failure_injected: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    meta_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)

    spans = relationship("TraceSpan", back_populates="trace", cascade="all, delete-orphan", order_by="TraceSpan.started_at")


class TraceSpan(Base):
    """
    Task 7: Individual Child Execution Span.
    Captures hierarchical agent, tool, LLM, decision, or verification activity.
    """
    __tablename__ = "trace_spans"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: f"spn_{uuid.uuid4().hex[:12]}")
    trace_id: Mapped[str] = mapped_column(String(64), ForeignKey("traces.trace_id"), nullable=False, index=True)
    span_id: Mapped[str] = mapped_column(String(64), unique=True, index=True, default=lambda: f"span_{uuid.uuid4().hex[:12]}")
    parent_span_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    
    span_type: Mapped[str] = mapped_column(String(32), nullable=False)  # AGENT, TOOL, LLM, DECISION, CHAIN, VERIFICATION, RECOVERY
    agent_name: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    operation: Mapped[str] = mapped_column(String(128), nullable=False)
    tool_name: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="SUCCESS", nullable=False)  # SUCCESS, ERROR, FALLBACK_RECOVERED, CIRCUIT_BREAKER_TRIGGERED, RUNNING
    
    started_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    completed_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, nullable=True)
    duration_ms: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    input_tokens: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    output_tokens: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    total_tokens: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    
    error_type: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    retry_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    fallback_used: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    decision_data: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    llm_metadata: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    meta_json: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)

    trace = relationship("Trace", back_populates="spans")
