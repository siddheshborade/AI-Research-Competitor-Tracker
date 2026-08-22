from fastapi import APIRouter
from app.api.v1 import (
    health_router,
    auth_router,
    memory_router,
    agent_router,
    research_router,
    insights_router,
    competitors_router,
    evidence_router,
    verification_router,
    dashboard_router,
)

api_router = APIRouter()

# Mount all endpoint routers
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(memory_router)
api_router.include_router(agent_router)
api_router.include_router(research_router)
api_router.include_router(insights_router)
api_router.include_router(competitors_router)
api_router.include_router(evidence_router)
api_router.include_router(verification_router)
api_router.include_router(dashboard_router)
