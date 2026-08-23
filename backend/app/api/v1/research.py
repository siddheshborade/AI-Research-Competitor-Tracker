from typing import List, Dict, Any
from fastapi import APIRouter, status, Query
from sqlalchemy.orm import Session
from app.api.deps import DBDep
from app.schemas.common import StandardResponse
from app.schemas.research import (
    ResearchCreate,
    ResearchDetailResponse,
)
from app.schemas.evidence import EvidenceGraphData
from app.services.research_service import ResearchService
from app.services.evidence_service import EvidenceService

router = APIRouter(prefix="/research", tags=["Research"])


@router.post(
    "",
    response_model=StandardResponse[ResearchDetailResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create & Execute Autonomous Research Objective",
    description="Initializes a new autonomous research inquiry, generates a prioritized plan, executes the ReAct multi-source intelligence loop, detects contradictions/weak signals, and synthesizes findings."
)
def create_research(
    data: ResearchCreate,
    execute_now: bool = Query(True, description="Whether to execute the ReAct agent pipeline immediately"),
    db: Session = DBDep
) -> StandardResponse[ResearchDetailResponse]:
    objective, run = ResearchService.create_research(db, data, auto_execute=execute_now)
    details = ResearchService.get_research_details(db, objective.id)
    return StandardResponse(
        success=True,
        data=ResearchDetailResponse.model_validate(details),
        message="Research objective and autonomous intelligence pipeline executed successfully."
    )


@router.get(
    "/search",
    response_model=StandardResponse[Dict[str, Any]],
    summary="Direct Research Intelligence Query",
    description="Queries real research literature and academic publications (e.g., arXiv.org Atom API) and returns normalized evidence records."
)
def search_research_literature(
    query: str = Query(..., description="Research question, keywords, or publication topic"),
    max_results: int = Query(5, ge=1, le=20, description="Maximum number of research papers to retrieve")
) -> StandardResponse[Dict[str, Any]]:
    result = ResearchService.search_papers(query=query, max_results=max_results)
    return StandardResponse(
        success=True,
        data=result,
        message=f"Retrieved {result.get('count', 0)} normalized research papers from external research index."
    )


@router.post(
    "/search",
    response_model=StandardResponse[Dict[str, Any]],
    summary="Direct Research Intelligence Query (POST)",
    description="Queries real research literature and academic publications (e.g., arXiv.org Atom API) with payload."
)
def search_research_literature_post(
    payload: Dict[str, Any]
) -> StandardResponse[Dict[str, Any]]:
    query = payload.get("query") or payload.get("message") or "latest research on AI agents"
    max_results = int(payload.get("max_results", 5))
    result = ResearchService.search_papers(query=query, max_results=max_results)
    return StandardResponse(
        success=True,
        data=result,
        message=f"Retrieved {result.get('count', 0)} normalized research papers from external research index."
    )


@router.get(
    "/{id}",
    response_model=StandardResponse[ResearchDetailResponse],
    summary="Get Research Objective & Findings",
    description="Retrieves the research objective, active agent plan, step history, and synthesized findings."
)
def get_research_by_id(
    id: str,
    db: Session = DBDep
) -> StandardResponse[ResearchDetailResponse]:
    details = ResearchService.get_research_details(db, id)
    return StandardResponse(
        success=True,
        data=ResearchDetailResponse.model_validate(details)
    )


@router.post(
    "/{id}/execute",
    response_model=StandardResponse[Dict[str, Any]],
    summary="Trigger/Re-run Autonomous Intelligence Pipeline",
    description="Triggers the ReAct agent loop for a research objective, scanning primary sources, detecting contradictions, and updating the Evidence Graph."
)
def execute_research_pipeline(
    id: str,
    depth: str = Query("standard", description="Research depth: quick, standard, deep"),
    db: Session = DBDep
) -> StandardResponse[Dict[str, Any]]:
    result = ResearchService.execute_research(db, id, depth=depth)
    return StandardResponse(
        success=True,
        data=result,
        message="Intelligence engine execution completed."
    )


@router.get(
    "/{id}/trace",
    response_model=StandardResponse[List[Dict[str, Any]]],
    summary="Get Safe Agent Execution Trace",
    description="Retrieves safe, structured step-by-step reasoning metadata and tool rationale suitable for demo and evaluation."
)
def get_research_execution_trace(
    id: str,
    db: Session = DBDep
) -> StandardResponse[List[Dict[str, Any]]]:
    trace = ResearchService.get_execution_trace(db, id)
    return StandardResponse(
        success=True,
        data=trace,
        message="Execution trace retrieved."
    )


@router.get(
    "/{id}/graph",
    response_model=StandardResponse[EvidenceGraphData],
    summary="Get Research Evidence Graph",
    description="Retrieves the multi-type Evidence Graph for an objective linking Competitor -> Patent -> Technology -> Research -> Trend -> Opportunity / Threat."
)
def get_research_evidence_graph(
    id: str,
    db: Session = DBDep
) -> StandardResponse[EvidenceGraphData]:
    graph_data = EvidenceService.get_evidence_graph(db, objective_id=id)
    return StandardResponse(
        success=True,
        data=EvidenceGraphData.model_validate(graph_data)
    )
