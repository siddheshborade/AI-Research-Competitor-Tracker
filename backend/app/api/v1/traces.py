from typing import Dict, Any, Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.common import StandardResponse
from app.services.tracing_service import tracing_service
from app.services.diagnostic_service import diagnostic_service, TraceDiagnosisResult, ExperimentResult

router = APIRouter(prefix="/traces", tags=["Tracing & Observability"])


class ExperimentRunRequest(BaseModel):
    objective: Optional[str] = Field(default="Investigate NVIDIA patent filings and AI hardware strategy", description="Objective to test")
    domain: Optional[str] = Field(default="AI Hardware & Semiconductors", description="Domain")
    competitors: Optional[List[str]] = Field(default=["NVIDIA"], description="Competitor organizations")


@router.get("", response_model=StandardResponse[List[Dict[str, Any]]])
@router.get("/", response_model=StandardResponse[List[Dict[str, Any]]], include_in_schema=False)
def list_traces(
    limit: int = Query(default=20, ge=1, le=100, description="Max traces to retrieve"),
    status: Optional[str] = Query(default="ALL", description="Filter by status (ALL, SUCCESS, FAILED, DEGRADED, RECOVERED)"),
    db: Session = Depends(get_db)
):
    """Retrieve recent investigation execution traces with aggregate duration and tool stats."""
    traces = tracing_service.get_recent_traces(db=db, limit=limit, status_filter=status)
    return StandardResponse(
        success=True,
        data=traces,
        message=f"Retrieved {len(traces)} execution traces."
    )


@router.get("/summary/metrics", response_model=StandardResponse[Dict[str, Any]])
def get_trace_metrics(db: Session = Depends(get_db)):
    """Retrieve global system observability metrics, average latencies, error counts, and tool distributions."""
    metrics = tracing_service.get_trace_summary_metrics(db=db)
    return StandardResponse(
        success=True,
        data=metrics,
        message="Observability summary metrics retrieved successfully."
    )


@router.get("/{trace_id}", response_model=StandardResponse[Dict[str, Any]])
def get_trace_by_id(
    trace_id: str,
    db: Session = Depends(get_db)
):
    """Retrieve detailed trace record including its complete hierarchical child spans."""
    trace_data = tracing_service.get_trace(trace_id=trace_id, db=db)
    if not trace_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trace with ID '{trace_id}' was not found."
        )

    return StandardResponse(
        success=True,
        data=trace_data,
        message=f"Trace '{trace_id}' retrieved successfully."
    )


@router.get("/{trace_id}/spans", response_model=StandardResponse[List[Dict[str, Any]]])
def get_trace_spans(
    trace_id: str,
    db: Session = Depends(get_db)
):
    """Retrieve chronological child spans (agents, tools, decisions, LLM calls) for a specific trace."""
    spans = tracing_service.get_trace_spans(trace_id=trace_id, db=db)
    return StandardResponse(
        success=True,
        data=spans,
        message=f"Retrieved {len(spans)} spans for trace '{trace_id}'."
    )


@router.get("/{trace_id}/diagnosis", response_model=StandardResponse[Dict[str, Any]])
def get_trace_diagnosis(
    trace_id: str,
    db: Session = Depends(get_db)
):
    """Perform automated root-cause diagnosis on a trace, identifying failed operations, latency bottlenecks, and recommendations."""
    diag = diagnostic_service.diagnose_trace(trace_id=trace_id, db=db)
    return StandardResponse(
        success=True,
        data=diag.model_dump(),
        message=f"Root-cause diagnosis computed for trace '{trace_id}'."
    )


@router.post("/experiment/run", response_model=StandardResponse[Dict[str, Any]])
def run_before_after_experiment(
    req: ExperimentRunRequest,
    db: Session = Depends(get_db)
):
    """
    Executes a real empirical Before vs. After experiment:
      - Baseline: Simulates upstream tool timeout with standard retry delay.
      - Improved: Executes with adaptive fast-fallback circuit breaker.
      - Computes real latency deltas, error reductions, and improvement percentages.
    """
    res = diagnostic_service.run_before_after_experiment(
        objective=req.objective or "Investigate NVIDIA patent filings and AI hardware strategy",
        domain=req.domain or "AI Hardware & Semiconductors",
        competitors=req.competitors or ["NVIDIA"],
        db=db
    )

    return StandardResponse(
        success=True,
        data=res.model_dump(),
        message="Before/After empirical benchmark experiment completed successfully."
    )
