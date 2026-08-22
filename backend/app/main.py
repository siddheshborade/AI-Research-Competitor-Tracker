import os
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.core.exceptions import AppException
from app.db.session import init_db, check_db_connection
from app.api.router import api_router


# Resolve frontend dist directory
_backend_dir = Path(__file__).resolve().parent.parent
_repo_root = _backend_dir.parent
_default_frontend_dist = _repo_root / "frontend" / "dist"
_fallback_static = _backend_dir / "static"

FRONTEND_DIST_DIR = os.getenv(
    "FRONTEND_DIST_DIR",
    str(_default_frontend_dist if _default_frontend_dist.is_dir() else _fallback_static)
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    setup_logging()
    logger.info(f"Starting {settings.PROJECT_NAME} in '{settings.APP_ENV}' mode...")
    
    # Initialize DB tables
    init_db()
    
    # Verify DB connectivity
    is_connected = check_db_connection()
    if is_connected:
        logger.info("Database connectivity verified.")
    else:
        logger.warning("Database connectivity check failed during startup.")
        
    yield
    # Shutdown
    logger.info(f"Shutting down {settings.PROJECT_NAME}...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Autonomous Research and Competitor Intelligence Agent API - Single-origin ReAct intelligence loop, Evidence Graph, WHAT-WHY-SO WHAT synthesis, and Human Verification Gate.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# Configure CORS (permits development server origin while single-origin production requires zero CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Exception Handlers for Predictable Error Responses
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    """Handles domain-level application exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details
            }
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handles Pydantic request validation errors."""
    formatted_errors = []
    for err in exc.errors():
        field = " -> ".join(str(loc) for loc in err.get("loc", []))
        msg = err.get("msg", "Validation error")
        formatted_errors.append({"field": field, "message": msg})

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Invalid request payload or query parameters.",
                "details": formatted_errors
            }
        }
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handles standard HTTP exceptions (e.g. 404 for nonexistent route, 405 Method Not Allowed)."""
    code_map = {
        404: "NOT_FOUND",
        405: "METHOD_NOT_ALLOWED",
        401: "UNAUTHORIZED",
        403: "FORBIDDEN",
        400: "INVALID_REQUEST",
    }
    code = code_map.get(exc.status_code, "HTTP_ERROR")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": code,
                "message": str(exc.detail) if exc.detail else "HTTP error occurred."
            }
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Catches all unexpected internal errors securely, preventing sensitive leaks."""
    logger.error(f"Unhandled Exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected server error occurred. Please contact system support."
            }
        }
    )


# Mount the API Router under /api and /api/v1 (API routes ALWAYS take precedence over SPA static files)
app.include_router(api_router, prefix="/api")
app.include_router(api_router, prefix="/api/v1")


# Mount static assets if dist/assets exists
_assets_dir = os.path.join(FRONTEND_DIST_DIR, "assets")
if os.path.isdir(_assets_dir):
    app.mount("/assets", StaticFiles(directory=_assets_dir), name="assets")


# Single-Page Application (SPA) Fallback Route for React Client-Side Navigation
@app.get("/{full_path:path}", include_in_schema=False)
async def serve_spa(full_path: str = ""):
    """
    Serves the React frontend SPA.
    - If request is for an unmatched API path, returns a clean JSON 404 error.
    - If request matches a static file in dist (e.g. favicon.svg, icons.svg), serves that file.
    - Otherwise serves index.html so React client-side routing handles the view.
    """
    clean_path = full_path.strip("/")
    
    # 1. Guard: Unmatched API paths must return JSON 404, never HTML
    if clean_path == "api" or clean_path.startswith("api/") or clean_path.startswith("api/v1"):
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "success": False,
                "error": {
                    "code": "NOT_FOUND",
                    "message": f"API endpoint '/{full_path}' was not found."
                }
            }
        )

    # 2. Serve static file if found in dist (e.g. favicon.svg, icons.svg)
    if os.path.isdir(FRONTEND_DIST_DIR):
        if full_path:
            static_file = os.path.join(FRONTEND_DIST_DIR, full_path)
            if os.path.isfile(static_file):
                return FileResponse(static_file)
        
        # 3. Serve React SPA index.html for root and all client routes (/workspace, /studio, etc.)
        index_html = os.path.join(FRONTEND_DIST_DIR, "index.html")
        if os.path.isfile(index_html):
            return FileResponse(index_html)

    # 4. Fallback if frontend is not built yet
    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={
            "service": settings.PROJECT_NAME,
            "message": "Frontend build not found. Run 'npm run build' inside frontend/ directory.",
            "docs": "/docs",
            "health": "/api/health"
        }
    )
