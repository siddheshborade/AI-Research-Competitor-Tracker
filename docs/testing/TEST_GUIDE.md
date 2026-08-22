# AGENTX24 Testing & Quality Assurance Guide

This document provides instructions for running automated tests, API verification, and end-to-end frontend validation.

---

## 1. Backend Automated Testing

The backend test suite is built on `pytest` and `pytest-asyncio` with 60 comprehensive unit and integration tests covering:
- ReAct Agent Loop & Step Limits
- Dynamic Tool Router & Argument Validation
- Contradiction Detector & Re-Search Triggers
- Evidence Sufficiency Evaluator
- Weak Signal & Research Gap Detectors
- Strategic WHAT-WHY-SO WHAT Synthesizer
- Multi-Type Evidence Graph Builder
- Trust Layer & Confidence Scoring
- Human Verification Gate & Ledger
- CORS & Global Exception Handling
- API Endpoints (`/api/health`, `/api/agent/run`, `/api/research`, `/api/competitors`, `/api/insights`, `/api/evidence`, `/api/verification`, `/api/dashboard`)

### Running Backend Tests

```powershell
cd backend
.\.venv\Scripts\pytest -v
```

### Running Specific Test Modules

- **Agent Workflow & Tools**:
  ```powershell
  .\.venv\Scripts\pytest tests/test_agent_api_and_tools.py -v
  ```
- **Contradiction Detection**:
  ```powershell
  .\.venv\Scripts\pytest tests/test_contradiction.py -v
  ```
- **Confidence & Synthesis**:
  ```powershell
  .\.venv\Scripts\pytest tests/test_confidence_and_synthesis.py -v
  ```
- **Evidence Graph**:
  ```powershell
  .\.venv\Scripts\pytest tests/test_evidence_graph_builder.py -v
  ```
- **Human Verification Gate**:
  ```powershell
  .\.venv\Scripts\pytest tests/test_verification.py -v
  ```

---

## 2. Frontend Build & Quality Verification

### Building Production Bundle

```powershell
cd frontend
npm run build
```

### Running Linter

```powershell
cd frontend
npm run lint
```

---

## 3. End-to-End API Verification

With the backend running at `http://127.0.0.1:8000`:

### Health Check:
```powershell
curl -X GET http://127.0.0.1:8000/api/health
curl -X GET http://127.0.0.1:8000/api/v1/health
```

### Agent Run Inquiry:
```powershell
curl -X POST http://127.0.0.1:8000/api/agent/run `
  -H "Content-Type: application/json" `
  -d '{\"message\": \"Investigate Apple ML on-device vision transformer research\", \"domain\": \"Computer Vision\", \"target_competitors\": [\"Apple ML\"], \"max_steps\": 6}'
```

### Competitor List:
```powershell
curl -X GET http://127.0.0.1:8000/api/competitors
```

### Evidence Graph:
```powershell
curl -X GET http://127.0.0.1:8000/api/evidence/graph
```
