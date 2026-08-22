from fastapi import APIRouter
from sqlalchemy.orm import Session
from app.api.deps import DBDep
from app.schemas.common import StandardResponse
from app.schemas.dashboard import DashboardSummaryResponse
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get(
    "",
    response_model=StandardResponse[DashboardSummaryResponse],
    summary="Competitor Intelligence Dashboard Summary",
    description="Aggregated metrics, intelligence breakdowns (opportunities, threats, weak signals, contradictions), recent findings, and tracked competitors."
)
@router.get(
    "/",
    response_model=StandardResponse[DashboardSummaryResponse],
    include_in_schema=False
)
@router.get(
    "/summary",
    response_model=StandardResponse[DashboardSummaryResponse],
    summary="Competitor Intelligence Dashboard Summary (Alias)",
    description="Alias endpoint for dashboard summary."
)
def get_dashboard_summary(db: Session = DBDep) -> StandardResponse[DashboardSummaryResponse]:
    summary = DashboardService.get_summary(db)
    return StandardResponse(
        success=True,
        data=DashboardSummaryResponse.model_validate(summary)
    )
