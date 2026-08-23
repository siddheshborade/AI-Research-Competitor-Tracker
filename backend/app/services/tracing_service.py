import datetime
import uuid
import time
from typing import Dict, Any, Optional, List, Union
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import select, desc, func

from app.models.trace import Trace, TraceSpan
from app.core.logging import logger


def sanitize_metadata(data: Any, max_depth: int = 4) -> Any:
    """Recursively removes sensitive keys, secrets, tokens, and overly large payloads."""
    if max_depth <= 0:
        return "<truncated_depth>"
    
    sensitive_keys = {
        "api_key", "apikey", "secret", "password", "token", "authorization", 
        "auth", "cookie", "jwt", "bearer", "private_key", "access_token"
    }

    if isinstance(data, dict):
        cleaned = {}
        for k, v in data.items():
            k_lower = str(k).lower()
            if any(s in k_lower for s in sensitive_keys):
                cleaned[k] = "[REDACTED_SECRET]"
            else:
                cleaned[k] = sanitize_metadata(v, max_depth - 1)
        return cleaned
    elif isinstance(data, list):
        return [sanitize_metadata(item, max_depth - 1) for item in data[:50]]
    elif isinstance(data, str):
        # Truncate overly long strings
        if len(data) > 1000:
            return data[:1000] + "... [truncated]"
        return data
    return data


class SpanContext(BaseModel):
    span_id: str
    trace_id: str
    parent_span_id: Optional[str] = None
    span_type: str  # AGENT, TOOL, LLM, DECISION, CHAIN, VERIFICATION, RECOVERY
    agent_name: Optional[str] = None
    operation: str
    tool_name: Optional[str] = None
    status: str = "RUNNING"
    started_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    completed_at: Optional[datetime.datetime] = None
    duration_ms: int = 0
    input_tokens: Optional[int] = None
    output_tokens: Optional[int] = None
    total_tokens: Optional[int] = None
    error_type: Optional[str] = None
    error_message: Optional[str] = None
    retry_count: int = 0
    fallback_used: bool = False
    decision_data: Optional[Dict[str, Any]] = None
    llm_metadata: Optional[Dict[str, Any]] = None
    meta_json: Dict[str, Any] = Field(default_factory=dict)


class TraceContext(BaseModel):
    trace_id: str
    investigation_id: str
    user_id: Optional[str] = None
    name: str
    status: str = "RUNNING"
    started_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    completed_at: Optional[datetime.datetime] = None
    duration_ms: int = 0
    total_tool_calls: int = 0
    error_count: int = 0
    total_tokens: Optional[int] = None
    success: bool = True
    failure_injected: Optional[str] = None
    meta_json: Dict[str, Any] = Field(default_factory=dict)
    spans: List[SpanContext] = Field(default_factory=list)


class TracingService:
    """
    Task 7: Production-Grade Tracing & Observability Service.
    
    Guarantees:
      1. Complete end-to-end tracing (User -> Planner -> Agents -> Tools -> Deciders -> LLM -> Synthesizer).
      2. Strict Parent-Child Span hierarchy.
      3. Total Fail-Safety: Tracing errors will NEVER crash the investigation pipeline.
      4. Sanitized metadata with zero secret/key leakage.
      5. Real execution latency and token metrics (null when unavailable, never fabricated).
    """

    def __init__(self):
        self._active_traces: Dict[str, TraceContext] = {}

    def start_trace(
        self,
        investigation_id: str,
        name: str,
        user_id: Optional[str] = None,
        failure_injection: Optional[str] = None,
        meta: Optional[Dict[str, Any]] = None
    ) -> str:
        """Initializes a new root investigation trace."""
        try:
            trace_id = f"trc_{uuid.uuid4().hex[:12]}"
            trace_ctx = TraceContext(
                trace_id=trace_id,
                investigation_id=investigation_id,
                user_id=user_id,
                name=name,
                failure_injected=failure_injection,
                meta_json=sanitize_metadata(meta or {})
            )
            self._active_traces[trace_id] = trace_ctx
            logger.info(f"[TracingService] Started trace '{trace_id}' for investigation '{investigation_id}' (Failure Injection: {failure_injection})")
            return trace_id
        except Exception as e:
            logger.error(f"[TracingService] Failed to start trace: {e}")
            return f"trc_fallback_{uuid.uuid4().hex[:8]}"

    def start_span(
        self,
        trace_id: str,
        operation: str,
        span_type: str,
        parent_span_id: Optional[str] = None,
        agent_name: Optional[str] = None,
        tool_name: Optional[str] = None,
        meta: Optional[Dict[str, Any]] = None
    ) -> str:
        """Starts an active child span within a trace."""
        span_id = f"span_{uuid.uuid4().hex[:12]}"
        try:
            trace_ctx = self._active_traces.get(trace_id)
            if not trace_ctx:
                return span_id

            span_ctx = SpanContext(
                span_id=span_id,
                trace_id=trace_id,
                parent_span_id=parent_span_id,
                span_type=span_type,
                agent_name=agent_name,
                operation=operation,
                tool_name=tool_name,
                meta_json=sanitize_metadata(meta or {})
            )
            trace_ctx.spans.append(span_ctx)
            return span_id
        except Exception as e:
            logger.error(f"[TracingService] Failed to start span: {e}")
            return span_id

    def end_span(
        self,
        trace_id: str,
        span_id: str,
        status: str = "SUCCESS",
        duration_ms: Optional[int] = None,
        error_type: Optional[str] = None,
        error_message: Optional[str] = None,
        input_tokens: Optional[int] = None,
        output_tokens: Optional[int] = None,
        total_tokens: Optional[int] = None,
        retry_count: int = 0,
        fallback_used: bool = False,
        decision_data: Optional[Dict[str, Any]] = None,
        llm_metadata: Optional[Dict[str, Any]] = None,
        meta: Optional[Dict[str, Any]] = None
    ):
        """Ends an active child span and populates metrics."""
        try:
            trace_ctx = self._active_traces.get(trace_id)
            if not trace_ctx:
                return

            span_ctx = next((s for s in trace_ctx.spans if s.span_id == span_id), None)
            if not span_ctx:
                return

            span_ctx.completed_at = datetime.datetime.utcnow()
            if duration_ms is not None:
                span_ctx.duration_ms = duration_ms
            else:
                span_ctx.duration_ms = max(1, int((span_ctx.completed_at - span_ctx.started_at).total_seconds() * 1000))

            span_ctx.status = status
            if error_type:
                span_ctx.error_type = str(error_type)[:128]
                span_ctx.error_message = str(error_message)[:1000] if error_message else None
                trace_ctx.error_count += 1
                trace_ctx.success = False

            if input_tokens is not None:
                span_ctx.input_tokens = input_tokens
            if output_tokens is not None:
                span_ctx.output_tokens = output_tokens
            if total_tokens is not None:
                span_ctx.total_tokens = total_tokens
                trace_ctx.total_tokens = (trace_ctx.total_tokens or 0) + total_tokens

            span_ctx.retry_count = retry_count
            span_ctx.fallback_used = fallback_used
            if decision_data:
                span_ctx.decision_data = sanitize_metadata(decision_data)
            if llm_metadata:
                span_ctx.llm_metadata = sanitize_metadata(llm_metadata)
            if meta:
                span_ctx.meta_json.update(sanitize_metadata(meta))

            if span_ctx.span_type == "TOOL":
                trace_ctx.total_tool_calls += 1

        except Exception as e:
            logger.error(f"[TracingService] Failed to end span: {e}")

    def record_agent_span(
        self,
        trace_id: str,
        agent_name: str,
        operation: str,
        duration_ms: int,
        status: str = "SUCCESS",
        parent_span_id: Optional[str] = None,
        meta: Optional[Dict[str, Any]] = None
    ) -> str:
        """Direct helper to record a completed agent execution span."""
        span_id = self.start_span(
            trace_id=trace_id,
            operation=operation,
            span_type="AGENT",
            parent_span_id=parent_span_id,
            agent_name=agent_name,
            meta=meta
        )
        self.end_span(trace_id=trace_id, span_id=span_id, status=status, duration_ms=duration_ms, meta=meta)
        return span_id

    def record_tool_span(
        self,
        trace_id: str,
        tool_name: str,
        agent_name: Optional[str],
        operation: str,
        duration_ms: int,
        status: str = "SUCCESS",
        sanitized_args: Optional[Dict[str, Any]] = None,
        result_count: int = 0,
        error_type: Optional[str] = None,
        error_message: Optional[str] = None,
        retry_count: int = 0,
        fallback_used: bool = False,
        parent_span_id: Optional[str] = None,
        meta: Optional[Dict[str, Any]] = None
    ) -> str:
        """Direct helper to record a completed tool call span."""
        tool_meta = {
            "arguments": sanitized_args or {},
            "result_count": result_count,
            **(meta or {})
        }
        span_id = self.start_span(
            trace_id=trace_id,
            operation=operation,
            span_type="TOOL",
            parent_span_id=parent_span_id,
            agent_name=agent_name,
            tool_name=tool_name,
            meta=tool_meta
        )
        self.end_span(
            trace_id=trace_id,
            span_id=span_id,
            status=status,
            duration_ms=duration_ms,
            error_type=error_type,
            error_message=error_message,
            retry_count=retry_count,
            fallback_used=fallback_used,
            meta=tool_meta
        )
        return span_id

    def record_decision_span(
        self,
        trace_id: str,
        agent_name: str,
        decision: str,
        reason_code: str,
        confidence: Optional[float] = None,
        next_action: Optional[str] = None,
        duration_ms: int = 10,
        parent_span_id: Optional[str] = None,
        meta: Optional[Dict[str, Any]] = None
    ) -> str:
        """Direct helper to record an explicit decision span."""
        decision_data = {
            "decision": decision,
            "reason_code": reason_code,
            "confidence": confidence,
            "next_action": next_action
        }
        span_id = self.start_span(
            trace_id=trace_id,
            operation=f"DECISION: {decision}",
            span_type="DECISION",
            parent_span_id=parent_span_id,
            agent_name=agent_name,
            meta=meta
        )
        self.end_span(
            trace_id=trace_id,
            span_id=span_id,
            status="SUCCESS",
            duration_ms=duration_ms,
            decision_data=decision_data,
            meta=meta
        )
        return span_id

    def record_llm_span(
        self,
        trace_id: str,
        model: str,
        prompt_type: str,
        template_id: str,
        duration_ms: int,
        input_tokens: Optional[int] = None,
        output_tokens: Optional[int] = None,
        total_tokens: Optional[int] = None,
        status: str = "SUCCESS",
        parent_span_id: Optional[str] = None,
        error: Optional[str] = None
    ) -> str:
        """Direct helper to record LLM prompt execution metadata without private reasoning."""
        llm_meta = {
            "model": model,
            "prompt_type": prompt_type,
            "template_id": template_id,
            "provider": "google-genai" if "gemini" in model.lower() else "llm-provider"
        }
        span_id = self.start_span(
            trace_id=trace_id,
            operation=f"LLM_INVOCATION: {prompt_type}",
            span_type="LLM",
            parent_span_id=parent_span_id,
            meta=llm_meta
        )
        self.end_span(
            trace_id=trace_id,
            span_id=span_id,
            status=status,
            duration_ms=duration_ms,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            total_tokens=total_tokens,
            error_type="LLMError" if error else None,
            error_message=error,
            llm_metadata=llm_meta
        )
        return span_id

    def end_trace(
        self,
        trace_id: str,
        db: Optional[Session] = None,
        status: Optional[str] = None,
        success: Optional[bool] = None
    ) -> Optional[TraceContext]:
        """Finalizes trace, calculates aggregate metrics, and persists to database."""
        try:
            trace_ctx = self._active_traces.get(trace_id)
            if not trace_ctx:
                return None

            trace_ctx.completed_at = datetime.datetime.utcnow()
            trace_ctx.duration_ms = max(1, int((trace_ctx.completed_at - trace_ctx.started_at).total_seconds() * 1000))
            
            if status is not None:
                trace_ctx.status = status
            else:
                if trace_ctx.error_count > 0 and trace_ctx.failure_injected:
                    trace_ctx.status = "RECOVERED"
                elif trace_ctx.error_count > 0:
                    trace_ctx.status = "DEGRADED" if any(s.status == "SUCCESS" for s in trace_ctx.spans) else "FAILED"
                else:
                    trace_ctx.status = "SUCCESS"

            if success is not None:
                trace_ctx.success = success
            else:
                trace_ctx.success = (trace_ctx.status in ["SUCCESS", "RECOVERED"])

            # Persist to database if db session provided
            if db:
                try:
                    db_trace = Trace(
                        trace_id=trace_ctx.trace_id,
                        investigation_id=trace_ctx.investigation_id,
                        user_id=trace_ctx.user_id,
                        name=trace_ctx.name,
                        status=trace_ctx.status,
                        started_at=trace_ctx.started_at,
                        completed_at=trace_ctx.completed_at,
                        duration_ms=trace_ctx.duration_ms,
                        total_spans=len(trace_ctx.spans),
                        total_tool_calls=trace_ctx.total_tool_calls,
                        error_count=trace_ctx.error_count,
                        total_tokens=trace_ctx.total_tokens,
                        success=trace_ctx.success,
                        failure_injected=trace_ctx.failure_injected,
                        meta_json=trace_ctx.meta_json
                    )
                    db.add(db_trace)
                    db.flush()

                    for span in trace_ctx.spans:
                        db_span = TraceSpan(
                            trace_id=span.trace_id,
                            span_id=span.span_id,
                            parent_span_id=span.parent_span_id,
                            span_type=span.span_type,
                            agent_name=span.agent_name,
                            operation=span.operation,
                            tool_name=span.tool_name,
                            status=span.status,
                            started_at=span.started_at,
                            completed_at=span.completed_at or datetime.datetime.utcnow(),
                            duration_ms=span.duration_ms,
                            input_tokens=span.input_tokens,
                            output_tokens=span.output_tokens,
                            total_tokens=span.total_tokens,
                            error_type=span.error_type,
                            error_message=span.error_message,
                            retry_count=span.retry_count,
                            fallback_used=span.fallback_used,
                            decision_data=span.decision_data,
                            llm_metadata=span.llm_metadata,
                            meta_json=span.meta_json
                        )
                        db.add(db_span)
                    
                    db.commit()
                    logger.info(f"[TracingService] Persisted trace '{trace_id}' with {len(trace_ctx.spans)} spans to database.")
                except Exception as db_err:
                    db.rollback()
                    logger.error(f"[TracingService] Database persistence failed for trace '{trace_id}': {db_err}")

            return trace_ctx

        except Exception as e:
            logger.error(f"[TracingService] Failed to end trace: {e}")
            return None

    def get_trace(self, trace_id: str, db: Session) -> Optional[Dict[str, Any]]:
        """Retrieves a single trace with its full span hierarchy."""
        trace = db.query(Trace).filter(Trace.trace_id == trace_id).first()
        if not trace:
            # Fallback to in-memory active traces
            in_mem = self._active_traces.get(trace_id)
            if in_mem:
                return in_mem.model_dump()
            return None

        spans = db.query(TraceSpan).filter(TraceSpan.trace_id == trace_id).order_by(TraceSpan.started_at).all()
        return {
            "trace_id": trace.trace_id,
            "investigation_id": trace.investigation_id,
            "user_id": trace.user_id,
            "name": trace.name,
            "status": trace.status,
            "started_at": trace.started_at.isoformat(),
            "completed_at": trace.completed_at.isoformat() if trace.completed_at else None,
            "duration_ms": trace.duration_ms,
            "total_spans": trace.total_spans,
            "total_tool_calls": trace.total_tool_calls,
            "error_count": trace.error_count,
            "total_tokens": trace.total_tokens,
            "success": trace.success,
            "failure_injected": trace.failure_injected,
            "meta": trace.meta_json,
            "spans": [
                {
                    "span_id": s.span_id,
                    "parent_span_id": s.parent_span_id,
                    "span_type": s.span_type,
                    "agent_name": s.agent_name,
                    "operation": s.operation,
                    "tool_name": s.tool_name,
                    "status": s.status,
                    "started_at": s.started_at.isoformat(),
                    "completed_at": s.completed_at.isoformat() if s.completed_at else None,
                    "duration_ms": s.duration_ms,
                    "input_tokens": s.input_tokens,
                    "output_tokens": s.output_tokens,
                    "total_tokens": s.total_tokens,
                    "error_type": s.error_type,
                    "error_message": s.error_message,
                    "retry_count": s.retry_count,
                    "fallback_used": s.fallback_used,
                    "decision_data": s.decision_data,
                    "llm_metadata": s.llm_metadata,
                    "meta": s.meta_json
                }
                for s in spans
            ]
        }

    def get_recent_traces(
        self,
        db: Session,
        limit: int = 20,
        status_filter: Optional[str] = None,
        user_id: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Retrieves list of recent traces with summary metadata."""
        query = db.query(Trace)
        if status_filter and status_filter.upper() != "ALL":
            query = query.filter(Trace.status == status_filter.upper())
        if user_id:
            query = query.filter(Trace.user_id == user_id)
        
        traces = query.order_by(desc(Trace.started_at)).limit(limit).all()
        return [
            {
                "trace_id": t.trace_id,
                "investigation_id": t.investigation_id,
                "name": t.name,
                "status": t.status,
                "started_at": t.started_at.isoformat(),
                "duration_ms": t.duration_ms,
                "total_spans": t.total_spans,
                "total_tool_calls": t.total_tool_calls,
                "error_count": t.error_count,
                "total_tokens": t.total_tokens,
                "success": t.success,
                "failure_injected": t.failure_injected
            }
            for t in traces
        ]

    def get_trace_spans(self, trace_id: str, db: Session) -> List[Dict[str, Any]]:
        """Retrieves all spans for a specific trace in chronological sequence."""
        spans = db.query(TraceSpan).filter(TraceSpan.trace_id == trace_id).order_by(TraceSpan.started_at).all()
        return [
            {
                "span_id": s.span_id,
                "parent_span_id": s.parent_span_id,
                "span_type": s.span_type,
                "agent_name": s.agent_name,
                "operation": s.operation,
                "tool_name": s.tool_name,
                "status": s.status,
                "started_at": s.started_at.isoformat(),
                "duration_ms": s.duration_ms,
                "input_tokens": s.input_tokens,
                "output_tokens": s.output_tokens,
                "total_tokens": s.total_tokens,
                "error_type": s.error_type,
                "error_message": s.error_message,
                "retry_count": s.retry_count,
                "fallback_used": s.fallback_used,
                "decision_data": s.decision_data,
                "llm_metadata": s.llm_metadata,
                "meta": s.meta_json
            }
            for s in spans
        ]

    def get_trace_summary_metrics(self, db: Session) -> Dict[str, Any]:
        """Calculates global observability aggregations across all recorded traces."""
        total_traces = db.scalar(select(func.count(Trace.id))) or 0
        if total_traces == 0:
            return {
                "total_traces": 0,
                "success_rate": 100.0,
                "average_duration_ms": 0,
                "total_spans": 0,
                "total_tool_calls": 0,
                "total_errors": 0,
                "agent_distribution": {},
                "tool_distribution": {}
            }

        successful_traces = db.scalar(select(func.count(Trace.id)).filter(Trace.success == True)) or 0
        avg_duration = db.scalar(select(func.avg(Trace.duration_ms))) or 0
        total_spans = db.scalar(select(func.count(TraceSpan.id))) or 0
        total_tool_calls = db.scalar(select(func.count(TraceSpan.id)).filter(TraceSpan.span_type == "TOOL")) or 0
        total_errors = db.scalar(select(func.count(TraceSpan.id)).filter(TraceSpan.status == "ERROR")) or 0

        # Agent distribution
        agent_counts = db.query(TraceSpan.agent_name, func.count(TraceSpan.id))\
            .filter(TraceSpan.agent_name.isnot(None))\
            .group_by(TraceSpan.agent_name).all()
        
        # Tool distribution
        tool_counts = db.query(TraceSpan.tool_name, func.count(TraceSpan.id))\
            .filter(TraceSpan.tool_name.isnot(None))\
            .group_by(TraceSpan.tool_name).all()

        return {
            "total_traces": total_traces,
            "success_rate": round((successful_traces / total_traces) * 100.0, 1) if total_traces > 0 else 100.0,
            "average_duration_ms": int(avg_duration),
            "total_spans": total_spans,
            "total_tool_calls": total_tool_calls,
            "total_errors": total_errors,
            "agent_distribution": {name: count for name, count in agent_counts if name},
            "tool_distribution": {name: count for name, count in tool_counts if name}
        }


tracing_service = TracingService()
