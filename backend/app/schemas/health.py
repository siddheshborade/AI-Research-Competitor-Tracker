from datetime import datetime
from pydantic import BaseModel, Field


class DatabaseHealth(BaseModel):
    status: str = Field(..., description="Database connection status: 'connected' or 'disconnected'")
    dialect: str = Field(..., description="Database dialect, e.g. postgresql or sqlite")


class HealthData(BaseModel):
    status: str = Field(default="healthy", description="Overall service status")
    version: str = Field(default="1.0.0", description="API Version")
    environment: str = Field(default="development", description="Current environment")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="UTC Timestamp")
    database: DatabaseHealth
