import uuid
from typing import Dict, Any, Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.common import StandardResponse
from app.engine.agent_loop import agent_loop_controller, AgentRunResult
from app.models.agent import AgentRun, ToolCallRecord, Claim, ClaimEvidence
from app.models.research import ResearchObjective, ResearchRun
from app.models.insight import Insight
from app.models.competitor import Competitor
from app.core.logging import logger

router = APIRouter(prefix="/agent", tags=["Agent"])


class AgentRunRequest(BaseModel):
    message: Optional[str] = Field(default=None, description="User prompt or research inquiry")
    objective: Optional[str] = Field(default=None, description="Alternative objective field")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Contextual parameters (domain, competitors)")
    domain: Optional[str] = Field(default=None, description="Industry or technical domain")
    target_competitors: Optional[List[str]] = Field(default=None, description="Target competitors to monitor")
    max_steps: Optional[int] = Field(default=6, ge=1, le=10, description="Maximum agent tool steps")
    chaos_mode: Optional[bool] = Field(default=False, description="Enable Chaos Mode for live adversarial fault injection")


@router.post("/run", response_model=StandardResponse[AgentRunResult], status_code=status.HTTP_200_OK)
def run_agent(
    request: AgentRunRequest,
    db: Session = Depends(get_db)
):
    """Primary autonomous agent endpoint that executes the LangGraph multi-agent loop with dynamic memory and tool calling."""
    inquiry = request.message or request.objective or (request.context.get("objective") if request.context else None)
    
    if not inquiry or not inquiry.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Either 'message' or 'objective' must be provided in the request payload."
        )

    domain = request.domain or (request.context.get("domain") if request.context else "General") or "General"
    competitors = request.target_competitors or (request.context.get("target_competitors") if request.context else []) or []
    chaos = bool(request.chaos_mode or (request.context.get("chaos_mode") if request.context else False))

    logger.info(f"API Request to /api/agent/run: '{inquiry[:80]}...' (Domain: {domain}, Chaos: {chaos})")

    # Run Autonomous LangGraph Multi-Agent Loop with DB Memory Context & Checkpointing
    result: AgentRunResult = agent_loop_controller.run(
        objective=inquiry,
        domain=domain,
        competitors=competitors,
        max_steps=request.max_steps,
        db=db,
        chaos_mode=chaos
    )

    return StandardResponse(
        success=True,
        data=result,
        message="Autonomous research agent completed intelligence gathering successfully."
    )


@router.get("/runs/{run_id}", response_model=StandardResponse[Dict[str, Any]])
def get_agent_run(
    run_id: str,
    db: Session = Depends(get_db)
):
    """Retrieve audit history, tool activity, and claims for a specific agent run."""
    run_record = db.query(AgentRun).filter(AgentRun.id == run_id).first()
    if not run_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent run '{run_id}' was not found."
        )

    tool_calls = db.query(ToolCallRecord).filter(ToolCallRecord.agent_run_id == run_id).all()
    claims = db.query(Claim).filter(Claim.agent_run_id == run_id).all()

    return StandardResponse(
        success=True,
        data={
            "run_id": run_record.id,
            "objective": run_record.objective,
            "status": run_record.status,
            "domain": run_record.domain,
            "created_at": run_record.created_at.isoformat(),
            "meta": run_record.meta_json,
            "tool_activity": [
                {
                    "tool_name": tc.tool_name,
                    "status": tc.status,
                    "purpose": tc.purpose,
                    "trigger": tc.trigger,
                    "duration_ms": tc.duration_ms,
                    "result_count": tc.result_count,
                    "created_at": tc.created_at.isoformat()
                }
                for tc in tool_calls
            ],
            "claims": [
                {
                    "id": c.id,
                    "claim_text": c.claim_text,
                    "status": c.status,
                    "importance": c.importance
                }
                for c in claims
            ]
        },
        message="Agent run audit details retrieved successfully."
    )
