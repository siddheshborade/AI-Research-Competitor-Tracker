from typing import Optional, List
from fastapi import APIRouter, Query
from sqlalchemy.orm import Session
from app.api.deps import DBDep
from app.schemas.common import StandardResponse
from app.schemas.evidence import EvidenceResponse, EvidenceGraphData
from app.services.evidence_service import EvidenceService

router = APIRouter(prefix="/evidence", tags=["Evidence"])


@router.get(
    "",
    response_model=StandardResponse[List[EvidenceResponse]],
    summary="List Evidence Items",
    description="Retrieves a list of collected evidence records with credibility scores and provenance."
)
def list_evidence(
    run_id: Optional[str] = Query(None, description="Filter by Run ID"),
    limit: int = Query(50, ge=1, le=200),
    db: Session = DBDep
) -> StandardResponse[List[EvidenceResponse]]:
    evidence_list = EvidenceService.get_all_evidence(db, run_id=run_id, limit=limit)
    return StandardResponse(
        success=True,
        data=[EvidenceResponse.model_validate(e) for e in evidence_list]
    )


@router.get(
    "/graph/overview",
    response_model=StandardResponse[EvidenceGraphData],
    summary="Evidence Graph Visualization Data",
    description="Retrieves the graph of connected evidence nodes and directed relationship edges (support, contradiction, correlation) for visualization."
)
def get_evidence_graph(
    run_id: Optional[str] = Query(None, description="Filter graph by Run ID"),
    objective_id: Optional[str] = Query(None, description="Filter graph by Objective ID"),
    db: Session = DBDep
) -> StandardResponse[EvidenceGraphData]:
    graph_data = EvidenceService.get_evidence_graph(db, run_id=run_id, objective_id=objective_id)
    return StandardResponse(
        success=True,
        data=EvidenceGraphData.model_validate(graph_data)
    )


@router.get(
    "/{id}",
    response_model=StandardResponse[EvidenceResponse],
    summary="Get Evidence Item & Provenance",
    description="Retrieves a specific evidence node with primary source metadata, credibility scores, contradiction flags, and graph connections."
)
def get_evidence_by_id(
    id: str,
    db: Session = DBDep
) -> StandardResponse[EvidenceResponse]:
    evidence = EvidenceService.get_evidence_by_id(db, id)
    return StandardResponse(
        success=True,
        data=EvidenceResponse.model_validate(evidence)
    )
