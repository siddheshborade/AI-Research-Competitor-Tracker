from typing import List, Optional
from fastapi import APIRouter, Query
from sqlalchemy.orm import Session
from app.api.deps import DBDep
from app.schemas.common import StandardResponse
from app.schemas.insight import InsightResponse, InsightDetailResponse
from app.services.insight_service import InsightService

router = APIRouter(prefix="/insights", tags=["Insights"])


@router.get(
    "",
    response_model=StandardResponse[List[InsightResponse]],
    summary="List & Filter Intelligence Insights",
    description="Retrieve synthesized intelligence insights filtered by objective, competitor, category, or review status."
)
def list_insights(
    objective_id: Optional[str] = Query(None, description="Filter by Research Objective ID"),
    run_id: Optional[str] = Query(None, description="Filter by Research Run ID"),
    competitor_id: Optional[str] = Query(None, description="Filter by Competitor ID"),
    category: Optional[str] = Query(
        None,
        description="Filter by category: opportunity, threat, weak_signal, trend, gap, contradiction"
    ),
    status: Optional[str] = Query(
        None,
        description="Filter by status: pending_review, approved, rejected, flagged"
    ),
    limit: int = Query(50, ge=1, le=100, description="Pagination limit"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
    db: Session = DBDep
) -> StandardResponse[List[InsightResponse]]:
    insights = InsightService.get_insights(
        db,
        objective_id=objective_id,
        run_id=run_id,
        competitor_id=competitor_id,
        category=category,
        status=status,
        limit=limit,
        offset=offset
    )
    return StandardResponse(
        success=True,
        data=[InsightResponse.model_validate(i) for i in insights]
    )


@router.get(
    "/{id}",
    response_model=StandardResponse[InsightDetailResponse],
    summary="Get Insight Details (WHAT -> WHY -> SO WHAT)",
    description="Retrieves a full insight breakdown including WHAT (observation), WHY (causes), SO WHAT (strategic action), linked evidence nodes, and human verification history."
)
def get_insight_by_id(
    id: str,
    db: Session = DBDep
) -> StandardResponse[InsightDetailResponse]:
    insight = InsightService.get_insight_by_id(db, id)
    return StandardResponse(
        success=True,
        data=InsightDetailResponse.model_validate(insight)
    )
