import os
from typing import List, Union, Optional
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Nexus Intelligence API"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api"

    # Database
    DATABASE_URL: str = "sqlite:///./agentx.db"

    # API Keys
    LLM_API_KEY: str = Field(default="", description="API key for LLM services")
    SEARCH_API_KEY: str = Field(default="", description="API key for multi-source search providers")
    WEB_SEARCH_API_KEY: str = Field(default="", description="API key for Web Search API (e.g. Tavily / Serper)")
    RESEARCH_API_KEY: str = Field(default="", description="API key for Research Paper API (e.g. Semantic Scholar / Europe PMC)")

    # CORS Settings
    FRONTEND_URL: str = "http://localhost:3000,http://localhost:5173"
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

    # Server Host & Port
    HOST: str = "0.0.0.0"
    PORT: int = 5000

    # Agent Limits
    MAX_AGENT_STEPS: int = 6
    MAX_TOOL_CALLS_PER_RUN: int = 6
    EXTERNAL_API_TIMEOUT_SECONDS: float = 10.0

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_database_url(cls, v: Optional[str]) -> str:
        if not v or v == "sqlite:///./agentx.db":
            if os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"):
                return "sqlite:////tmp/agentx.db"
            return "sqlite:///./agentx.db"
        return v

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
        ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
