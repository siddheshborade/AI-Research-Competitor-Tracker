from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.schemas.common import StandardResponse
from app.engine.evaluator import evaluation_engine, EvaluationSuiteResult, BenchmarkScenario, BaselineComparison

router = APIRouter(prefix="/evaluation", tags=["Evaluation"])


class BenchmarkRunRequest(BaseModel):
    repeat_count: Optional[int] = Field(default=1, ge=1, le=5, description="Number of evaluation test iterations")
    scenario_filter: Optional[str] = Field(default=None, description="Optional scenario name filter")


class HumanReviewRequest(BaseModel):
    rating: str = Field(..., description="CORRECT | NEEDS_REVIEW | INCORRECT")
    notes: Optional[str] = Field(default=None, description="Optional human reviewer notes")
    reviewer: Optional[str] = Field(default="Human Analyst", description="Name of reviewer")
    investigation_id: Optional[str] = Field(default=None, description="Associated investigation ID")


@router.get("/results", response_model=StandardResponse[EvaluationSuiteResult], summary="Get Agent Evaluation Results")
def get_evaluation_results() -> StandardResponse[EvaluationSuiteResult]:
    """Retrieves the latest 14-category evaluation benchmark scores and scenario audit matrix."""
    results = evaluation_engine.get_latest_results()
    return StandardResponse(
        success=True,
        data=results,
        message="Agent evaluation benchmark scores retrieved successfully."
    )


@router.post("/run", response_model=StandardResponse[EvaluationSuiteResult], summary="Trigger Agent Evaluation Benchmark Suite")
def trigger_evaluation_run(request: BenchmarkRunRequest = BenchmarkRunRequest()) -> StandardResponse[EvaluationSuiteResult]:
    """Executes live benchmark suite across NORMAL, AMBIGUOUS, ADVERSARIAL, CONTRADICTORY, INCOMPLETE, and TOOL_FAILURE scenarios."""
    results = evaluation_engine.run_benchmark_suite(repeat_count=request.repeat_count)
    return StandardResponse(
        success=True,
        data=results,
        message="Agent evaluation benchmark suite executed successfully."
    )


@router.get("/baseline", response_model=StandardResponse[List[BaselineComparison]], summary="Get Baseline vs Multi-Agent Comparison")
def get_baseline_comparison() -> StandardResponse[List[BaselineComparison]]:
    """Returns comparative metrics between single-pass RAG pipelines and TrackWise LangGraph Multi-Agent Architecture."""
    results = evaluation_engine.get_latest_results()
    return StandardResponse(
        success=True,
        data=results.baseline_comparison,
        message="Baseline comparative benchmarks retrieved successfully."
    )


@router.get("/feedback", response_model=StandardResponse[List[Dict[str, Any]]], summary="Get Human Evaluation Reviews")
def get_human_evaluation_reviews() -> StandardResponse[List[Dict[str, Any]]]:
    """Retrieves recorded human evaluation reviews."""
    reviews = evaluation_engine.get_human_reviews()
    return StandardResponse(
        success=True,
        data=reviews,
        message="Human evaluation reviews retrieved successfully."
    )


@router.post("/feedback", response_model=StandardResponse[Dict[str, Any]], summary="Submit Human Evaluation Review")
def submit_human_evaluation_review(request: HumanReviewRequest) -> StandardResponse[Dict[str, Any]]:
    """Submits human evaluation review (CORRECT / NEEDS_REVIEW) for intelligence outputs."""
    record = evaluation_engine.add_human_review(
        rating=request.rating,
        notes=request.notes,
        reviewer=request.reviewer,
        investigation_id=request.investigation_id
    )
    return StandardResponse(
        success=True,
        data=record,
        message="Human evaluation review recorded successfully."
    )
