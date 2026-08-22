from typing import Dict, Any, Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import select, desc, func

from app.db.session import get_db
from app.schemas.common import StandardResponse
from app.engine.memory import memory_engine, ShortTermWorkingMemory, PreviousContext
from app.models.agent import AgentRun, ToolCallRecord, Claim
from app.models.insight import Insight
from app.models.competitor import Competitor
from app.models.evidence import Evidence

router = APIRouter(prefix="/memory", tags=["Memory & Context"])


class MemorySearchRequest(BaseModel):
    query: str
    competitors: Optional[List[str]] = None


@router.get("/current", response_model=StandardResponse[Dict[str, Any]])
@router.get("/working", response_model=StandardResponse[Dict[str, Any]], include_in_schema=False)
def get_current_working_memory():
    """Retrieve active or most recent short-term investigation working memory context."""
    wm = memory_engine.get_latest_working_memory()
    if not wm:
        return StandardResponse(
            success=True,
            data={
                "has_active_context": False,
                "working_memory": None,
                "message": "No active investigation working memory in current session."
            },
            message="No active memory context found."
        )

    return StandardResponse(
        success=True,
        data={
            "has_active_context": True,
            "working_memory": wm.model_dump()
        },
        message="Active short-term working memory retrieved."
    )


@router.get("/history", response_model=StandardResponse[Dict[str, Any]])
def get_long_term_memory_history(
    limit: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Retrieve persistent long-term memory records across previous investigations from SQLite database."""
    past_runs = db.query(AgentRun).order_by(desc(AgentRun.created_at)).limit(limit).all()
    past_insights = db.query(Insight).order_by(desc(Insight.created_at)).limit(limit).all()
    competitors = db.query(Competitor).all()

    investigations_history = []
    for r in past_runs:
        meta = r.meta_json or {}
        answer = meta.get("answer", {})
        investigations_history.append({
            "run_id": r.id,
            "objective": r.objective,
            "domain": r.domain,
            "status": r.status,
            "created_at": r.created_at.strftime("%b %d, %Y - %H:%M"),
            "what": answer.get("what", "Intelligence synthesized."),
            "why": answer.get("why", "Market signals observed."),
            "so_what": answer.get("so_what", "Defensive action required."),
            "classification": answer.get("classification", "OPPORTUNITY"),
            "evidence_count": meta.get("metrics", {}).get("evidence_count", 0),
            "tool_calls_count": meta.get("metrics", {}).get("tool_calls_count", 0),
        })

    opportunities = [
        {
            "id": ins.id,
            "title": ins.title,
            "what": ins.what_description,
            "why": ins.why_description,
            "so_what": ins.so_what_description,
            "impact": ins.impact_level,
            "confidence": ins.confidence_score,
            "created_at": ins.created_at.strftime("%b %d, %Y"),
        }
        for ins in past_insights if ins.category == "opportunity"
    ]

    threats = [
        {
            "id": ins.id,
            "title": ins.title,
            "what": ins.what_description,
            "why": ins.why_description,
            "so_what": ins.so_what_description,
            "impact": ins.impact_level,
            "confidence": ins.confidence_score,
            "created_at": ins.created_at.strftime("%b %d, %Y"),
        }
        for ins in past_insights if ins.category == "threat"
    ]

    return StandardResponse(
        success=True,
        data={
            "total_investigations_stored": len(past_runs),
            "investigations": investigations_history,
            "previous_opportunities": opportunities,
            "previous_threats": threats,
            "tracked_competitors_count": len(competitors)
        },
        message="Long-term memory history retrieved from persistent database."
    )


@router.get("/stats", response_model=StandardResponse[Dict[str, Any]])
def get_memory_stats(db: Session = Depends(get_db)):
    """Retrieve high-level memory ledger counts and storage health."""
    total_runs = db.scalar(select(func.count(AgentRun.id))) or 0
    total_insights = db.scalar(select(func.count(Insight.id))) or 0
    total_evidence = db.scalar(select(func.count(Evidence.id))) or 0
    total_tools = db.scalar(select(func.count(ToolCallRecord.id))) or 0
    wm = memory_engine.get_latest_working_memory()

    return StandardResponse(
        success=True,
        data={
            "total_investigations_persisted": total_runs,
            "total_insights_recorded": total_insights,
            "total_evidence_stored": total_evidence,
            "total_tool_calls_audited": total_tools,
            "active_working_context": wm is not None,
            "active_investigation_id": wm.investigation_id if wm else None,
            "storage_engine": "SQLite Persistent Memory Ledger"
        },
        message="Memory stats retrieved successfully."
    )


@router.post("/search", response_model=StandardResponse[Dict[str, Any]])
def search_memory(
    req: MemorySearchRequest,
    db: Session = Depends(get_db)
):
    """Searches long-term database memory for relevant previous investigation context."""
    matched_context = memory_engine.retrieve_relevant_long_term_memory(
        db=db,
        objective=req.query,
        competitors=req.competitors
    )

    return StandardResponse(
        success=True,
        data={
            "query": req.query,
            "has_match": matched_context is not None,
            "context": matched_context.model_dump() if matched_context else None
        },
        message="Memory search completed."
    )
