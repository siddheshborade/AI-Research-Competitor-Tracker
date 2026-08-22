import datetime
from fastapi import APIRouter
from app.core.config import settings
from app.db.session import check_db_connection, engine
from app.schemas.common import StandardResponse
from app.schemas.health import HealthData, DatabaseHealth

router = APIRouter()


@router.get(
    "/health",
    response_model=StandardResponse[HealthData],
    summary="System Health & Database Status",
    description="Returns overall backend health status, database connectivity verification, API version, and environment details."
)
def get_health() -> StandardResponse[HealthData]:
    db_connected = check_db_connection()
    dialect = engine.url.get_backend_name()

    health_data = HealthData(
        status="healthy" if db_connected else "degraded",
        version="1.0.0",
        environment=settings.APP_ENV,
        timestamp=datetime.datetime.utcnow(),
        database=DatabaseHealth(
            status="connected" if db_connected else "disconnected",
            dialect=dialect
        )
    )

    return StandardResponse(
        success=True,
        data=health_data,
        message="System operational" if db_connected else "Database connectivity issue detected"
    )
