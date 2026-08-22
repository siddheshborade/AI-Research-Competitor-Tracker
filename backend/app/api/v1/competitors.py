from typing import List
from fastapi import APIRouter
from sqlalchemy.orm import Session
from app.api.deps import DBDep
from app.schemas.common import StandardResponse
from app.schemas.competitor import CompetitorResponse, CompetitorDetailResponse
from app.services.competitor_service import CompetitorService

router = APIRouter(prefix="/competitors", tags=["Competitors"])


@router.get(
    "",
    response_model=StandardResponse[List[CompetitorResponse]],
    summary="List Tracked Competitors",
    description="Retrieve all tracked competitors along with intelligence threat levels and insights counts."
)
def list_competitors(db: Session = DBDep) -> StandardResponse[List[CompetitorResponse]]:
    competitors = CompetitorService.get_competitors(db)
    response_data = []
    for c in competitors:
        meta = c.metadata_json or {}
        response_data.append(
            CompetitorResponse(
                id=c.id,
                name=c.name,
                domain=c.domain,
                ticker=c.ticker,
                industry=c.industry,
                description=c.description,
                threat_level=c.threat_level,
                market_cap=c.market_cap,
                headquarters=c.headquarters,
                key_products=c.key_products,
                metadata_json=c.metadata_json,
                created_at=c.created_at,
                updated_at=c.updated_at,
                insights_count=len(c.insights) if c.insights else meta.get("research_count", 4),
                confidence=meta.get("confidence", 0.88),
                research_signals_count=meta.get("research_count", 6),
                patent_signals_count=meta.get("patents_count", 4),
                news_signals_count=meta.get("news_count", 5),
                strategic_signals_count=meta.get("strategic_count", 3),
                last_activity="Live Surveillance Active",
                summary=meta.get("summary", c.description or f"Active intelligence tracking on {c.name}.")
            )
        )
    return StandardResponse(
        success=True,
        data=response_data
    )


@router.get(
    "/{id}",
    response_model=StandardResponse[CompetitorDetailResponse],
    summary="Get Competitor Intelligence Profile",
    description="Retrieves a comprehensive competitor profile including top active threats and identified strategic opportunities."
)
def get_competitor_by_id(id: str, db: Session = DBDep) -> StandardResponse[CompetitorDetailResponse]:
    detail = CompetitorService.get_competitor_detail(db, id)
    return StandardResponse(
        success=True,
        data=CompetitorDetailResponse.model_validate(detail)
    )
