# AGENTX24 Autonomous Research & Competitor Intelligence Backend

AGENTX24 is a production-ready, autonomous intelligence engine engineered for deep competitor analysis. Operating on a **ReAct Multi-Source Agent Loop** (`MAX_ITERATIONS = 5`), the system decomposes strategic inquiries into prioritized tasks, gathers evidence across diverse primary sources (Patents, Academic Preprints, Industry News, SEC Disclosures, Competitor Telemetry), detects factual contradictions, surfaces emerging weak signals, and synthesizes actionable **WHAT → WHY → SO WHAT** strategic insights backed by an interactive **Evidence Graph** and a **Human Verification Gate**.

---

## Architecture Overview

```
USER INQUIRY
     ↓
[Autonomous Research Planner] → Prioritized Task Decomposition & Stopping Conditions
     ↓
[Dynamic Tool Selector]      → Specialized Source Routing (Research, Patent, News, SEC, Telemetry)
     ↓
[ReAct Execution Loop]       → Reason → Act → Observe → Analyze → Decide → Re-Plan
     ↓
[Deep Intelligence Layer]    → Contradiction Detection, Weak-Signal Aggregation, White-Space Gaps
     ↓
[Strategic Synthesizer]      → WHAT → WHY → SO WHAT Framework & Opportunity/Threat Classification
     ↓
[Trust Layer & Verification] → Explainable Confidence Formula & Human Gate Routing
     ↓
[Evidence Graph Builder]     → Multi-Type Graph (Competitor → Patent → Tech → Research → Trend → Opp/Threat)
     ↓
[REST API & DB Persistence]  → PostgreSQL / SQLite via SQLAlchemy 2.0 & FastAPI
```

---

## 1. Quickstart & Local Setup

### Prerequisites
- Python 3.10+ (tested on Python 3.14)
- PostgreSQL (Production) or SQLite (Local Development)

### 1.1 Clone and Setup Virtual Environment
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 1.2 Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` to configure your environment variables:
```ini
# Application Settings
PROJECT_NAME="AGENTX24 Intelligence API"
APP_ENV="development"
DEBUG=True
API_V1_STR="/api"

# Database Configuration
# PostgreSQL Production: postgresql+psycopg2://user:password@localhost:5432/agentx_db
# SQLite Local Fallback: sqlite:///./agentx.db
DATABASE_URL="sqlite:///./agentx.db"

# LLM & Search API Keys (Leave blank or test values to enable safe deterministic demo fallback)
LLM_API_KEY=""
SEARCH_API_KEY=""

# CORS Configuration (Comma-separated allowed origins or JSON array)
FRONTEND_URL="http://localhost:3000,http://localhost:5173"
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:5173","http://127.0.0.1:3000","http://127.0.0.1:5173"]

# Server Host & Port
HOST="0.0.0.0"
PORT=8000
```

---

## 2. Running the Server

### 2.1 Development Mode (Hot Reload)
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2.2 Production Server Mode
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4 --proxy-headers --access-log
```

The server will be live at `http://localhost:8000`.
- **Interactive Swagger UI**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`
- **OpenAPI Schema JSON**: `http://localhost:8000/openapi.json`
- **Health Check**: `http://localhost:8000/api/health`

---

## 3. REST API Contract Summary

All endpoints conform strictly to [API_CONTRACT.md](API_CONTRACT.md).

### 3.1 Research & Autonomous ReAct Engine
- `POST /api/research` — Create research objective and execute the ReAct intelligence pipeline.
- `GET /api/research/{id}` — Get objective status, findings, and scanned sources.
- `POST /api/research/{id}/execute` — Re-execute research pipeline on demand.
- `GET /api/research/{id}/trace` — Retrieve safe structured execution trace for demo & judging.
- `GET /api/research/{id}/graph` — Retrieve interactive Evidence Graph for the objective.

### 3.2 Strategic Insights & Trust Layer
- `GET /api/insights` — Query and filter insights (by competitor, category, review status).
- `GET /api/insights/{id}` — Get full **WHAT → WHY → SO WHAT** breakdown with linked evidence items.

### 3.3 Competitors & Intelligence Profiles
- `GET /api/competitors` — List tracked competitors, threat levels, and intelligence counts.
- `GET /api/competitors/{id}` — Get competitor intelligence profile (top threats & strategic opportunities).

### 3.4 Evidence & Evidence Graph
- `GET /api/evidence/{id}` — Get specific evidence item with source provenance and confidence score.
- `GET /api/evidence/graph/overview` — Get global Evidence Graph overview.

### 3.5 Human Verification Gate
- `POST /api/verification` — Submit human analyst verification decision (`verified`, `rejected`, `flag_for_review`).
- `GET /api/verification/{id}` — Get verification record audit log.

### 3.6 Competitor Intelligence Dashboard
- `GET /api/dashboard/summary` — Primary dashboard summary metrics, breakdown, top threats, opportunities, and pending verification queue.

---

## 4. Sample API Request & Response

### Request: Create Research Inquiry
```bash
curl -X POST "http://localhost:8000/api/research" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Analyze Acme Corp AI Medical Diagnostics Expansion",
    "description": "Investigate patent filings, FDA clearance timeline, and pricing for Acme Corp.",
    "domain": "Medical AI",
    "target_competitors": ["Acme Corp"],
    "depth": "standard"
  }'
```

### Response (201 Created):
```json
{
  "success": true,
  "data": {
    "objective": {
      "id": "obj_f91a2b3c4d5e",
      "title": "Analyze Acme Corp AI Medical Diagnostics Expansion",
      "status": "completed",
      "created_at": "2026-08-22T13:00:00.000000"
    },
    "latest_run": {
      "id": "run_88192a3b4c5d",
      "status": "completed",
      "metrics": {
        "sources_scanned": 4,
        "evidence_nodes_extracted": 4,
        "insights_generated": 3,
        "contradictions_flagged": 1,
        "weak_signals_detected": 1,
        "confidence_avg": 0.89
      }
    },
    "sources_scanned_count": 4,
    "evidence_count": 4,
    "insights_count": 3
  },
  "message": "Research objective and autonomous intelligence pipeline executed successfully."
}
```

---

## 5. Automated Test Suite

Run the full automated test suite using `pytest`:
```bash
# Run all tests with verbose output
pytest -v

# Run with test coverage
pytest --cov=app tests/
```

### Test Coverage Breakdown:
- `test_health.py` — Server start and database connection check.
- `test_planner.py` — Autonomous research planning and task decomposition.
- `test_tools.py` — Dynamic tool selection and source failure recovery.
- `test_react_loop.py` — Controlled ReAct iteration loop (`MAX_ITERATIONS = 5`) and safe trace logging.
- `test_contradiction.py` — Cross-source conflict detection and human review routing.
- `test_weak_signals.py` — Subtle multi-source trend emergence detection.
- `test_gap_analysis.py` — Market white-space and research gap discovery.
- `test_confidence_and_synthesis.py` — WHAT-WHY-SO WHAT synthesis and explainable confidence formula.
- `test_evidence_graph_builder.py` — Multi-type graph nodes, edge deduplication, and referential integrity.
- `test_resilience_and_fallbacks.py` — LLM failure, retry limit, and all-sources-fail fallback.
- `test_full_agent_workflow.py` — End-to-end user objective to action verification.
- `test_error_handling.py` — Predictable 404, 405, 422 standard error responses without data leakage.
- `test_cors.py` — CORS header reflection and preflight handling.

---

## 6. Deployment Guidelines

1. **Database Migration**: Ensure `DATABASE_URL` points to a high-availability PostgreSQL instance.
2. **CORS Security**: Restrict `FRONTEND_URL` / `ALLOWED_ORIGINS` to the exact production frontend domain.
3. **Environment Isolation**: Never commit `.env` into version control. Ensure all secrets are provided via container environment variables or cloud secret managers.
4. **Health Monitoring**: Monitor `GET /api/health` for uptime and database connection alerts.
