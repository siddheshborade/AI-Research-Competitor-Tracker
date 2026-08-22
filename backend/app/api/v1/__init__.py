from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.memory import router as memory_router
from app.api.v1.agent import router as agent_router
from app.api.v1.research import router as research_router
from app.api.v1.insights import router as insights_router
from app.api.v1.competitors import router as competitors_router
from app.api.v1.evidence import router as evidence_router
from app.api.v1.verification import router as verification_router
from app.api.v1.dashboard import router as dashboard_router

__all__ = [
    "health_router",
    "auth_router",
    "memory_router",
    "agent_router",
    "research_router",
    "insights_router",
    "competitors_router",
    "evidence_router",
    "verification_router",
    "dashboard_router",
]
