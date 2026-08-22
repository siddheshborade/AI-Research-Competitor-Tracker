# AGENTX24 Competitor Intelligence API Contract

**Version:** `3.1.0`  
**Protocol:** `HTTP / REST`  
**Content-Type:** `application/json`  
**Base URL Prefixes:** `/api` and `/api/v1`

---

## 1. Overview & System Design

The **AGENTX24** backend is an autonomous research and competitor intelligence engine designed to produce deep strategic intelligence using a genuine **ReAct Multi-Source Agent Loop** (`MAX_AGENT_STEPS = 6`). It dynamically routes inquiries to real external tools (**Web Search API** and **Research Papers API**), verifies evidence sufficiency, detects factual contradictions, triggers targeted re-search when conflicts arise, constructs an interactive **Evidence Graph**, and synthesizes high-value strategic insights using the **WHAT → WHY → SO WHAT** framework, backed by a **Trust Layer** and **Human Verification Gate**.

This document is the definitive API Contract between the Backend and Frontend applications.

---

## 2. Standard Response Envelopes

### 2.1 Standard Success Envelope
All successful API responses return `2xx` HTTP status codes with the standard envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable informational message"
}
```

### 2.2 Standard Error Envelope
All error responses return appropriate `4xx` or `5xx` HTTP status codes with a consistent, predictable error format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "Human-readable explanation of the error",
    "details": null
  }
}
```

### 2.3 Standard Error Codes
| Code | HTTP Status | Description |
|---|---|---|
| `NOT_FOUND` | 404 | The requested entity (run, objective, insight, evidence) does not exist |
| `INVALID_REQUEST` | 400 | The request violates business logic or is missing required parameters |
| `VALIDATION_ERROR` | 422 | Pydantic payload validation failure |
| `TOOL_INVALID_ARGUMENTS` | 422 | Tool argument schema validation failure |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected backend server error |

---

## 3. Endpoints

---

### 3.1 Autonomous Agent Engine (Primary Endpoint)

#### `POST /api/agent/run` and `POST /api/v1/agent/run`
Executes an end-to-end autonomous research investigation. The agent autonomously plans, selects tools dynamically, calls external APIs, evaluates evidence sufficiency, detects contradictions, triggers verification re-search if needed, links claims to evidence, and synthesizes actionable intelligence.

**Request Body:**
```json
{
  "message": "Find emerging research on medical diagnostic AI models and check whether OmniHealth Labs is commercializing it.",
  "domain": "Medical AI",
  "target_competitors": ["OmniHealth Labs"],
  "max_steps": 6
}
```

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "run_id": "run_a1b2c3d4e5f6",
    "objective": "Find emerging research on medical diagnostic AI models and check whether OmniHealth Labs is commercializing it.",
    "status": "completed",
    "answer": {
      "what": "OmniHealth Labs announced nationwide commercial rollout of its autonomous diagnostic platform across 40 hospital networks.",
      "why": "Recent academic preprints demonstrate that Cross-Attention Transformer models achieve 99.1% sensitivity, creating intense competitive pressure.",
      "so_what": "Accelerate clinical trial data remediation and initiate defensive patent filings in sensor uncertainty scoring.",
      "classification": "THREAT",
      "priority": "HIGH"
    },
    "sources": [
      {
        "id_or_title": "src_paper_1",
        "title": "Cross-Attention Multi-Modal Fusion for Real-Time Autonomous Clinical Diagnostics",
        "source": "IEEE Transactions & arXiv:2607.08912",
        "source_type": "paper",
        "url": "https://arxiv.org/abs/2607.08912",
        "credibility_weight": 0.95
      },
      {
        "id_or_title": "src_web_1",
        "title": "OmniHealth Announces Commercial Expansion Across 40 Hospital Networks",
        "source": "Global MedTech Wire",
        "source_type": "web",
        "url": "https://medtechwire.com/news/omnihealth-rollout",
        "credibility_weight": 0.90
      }
    ],
    "evidence": [
      {
        "source_id": "src_paper_1",
        "source_type": "paper",
        "title": "Cross-Attention Multi-Modal Fusion for Real-Time Autonomous Clinical Diagnostics",
        "publisher": "IEEE Transactions & arXiv:2607.08912",
        "url": "https://arxiv.org/abs/2607.08912",
        "published_at": "2026-07-14",
        "snippet": "Achieves 99.1% diagnostic sensitivity with sub-20ms inference latency on edge silicon.",
        "content_summary": "Extensive empirical benchmark across 14,000 multi-spectral clinical scans.",
        "relevance": 0.96,
        "credibility": 0.95
      }
    ],
    "claims": [
      {
        "id": "clm_12345678",
        "claim_text": "IEEE Transactions & arXiv reports: Achieves 99.1% diagnostic sensitivity with sub-20ms inference latency...",
        "status": "SUPPORTED",
        "importance": "HIGH",
        "supporting_evidence_ids": ["src_paper_1"]
      }
    ],
    "tool_activity": [
      {
        "step": 1,
        "tool_name": "research_papers",
        "status": "completed",
        "purpose": "Query scientific research papers and preprints for foundational technological developments",
        "trigger": "initial_search",
        "duration_ms": 340,
        "result_count": 3
      },
      {
        "step": 2,
        "tool_name": "web_search",
        "status": "completed",
        "purpose": "Search current web news and press releases for OmniHealth Labs commercial rollout",
        "trigger": "sequential_research",
        "duration_ms": 410,
        "result_count": 2
      }
    ],
    "trust": {
      "evidence_count": 5,
      "verification_status": "STRONGLY_SUPPORTED",
      "confidence_score": 0.93,
      "confidence_category": "VERY_HIGH",
      "contradiction_status": "NO_CONTRADICTIONS",
      "re_search_triggered": false,
      "requires_human_verification": false,
      "supporting_sources": [
        {
          "title": "Cross-Attention Multi-Modal Fusion...",
          "publisher": "IEEE Transactions",
          "url": "https://arxiv.org/abs/2607.08912",
          "type": "paper",
          "relevance": 0.96
        }
      ]
    },
    "graph": {
      "nodes": [
        { "id": "node-target", "label": "OmniHealth Labs", "type": "competitor" },
        { "id": "node-tech", "label": "Cross-Attention Transformers", "type": "technology" },
        { "id": "node-threat", "label": "Threat: Commercial Diagnostic Deployment", "type": "opportunity" }
      ],
      "edges": [
        { "source": "node-target", "target": "node-tech", "label": "deploys", "type": "technology" },
        { "source": "node-tech", "target": "node-threat", "label": "creates_threat", "type": "intelligence" }
      ]
    }
  },
  "message": "Autonomous research agent completed intelligence gathering successfully."
}
```

---

#### `GET /api/agent/runs/{run_id}`
Retrieves audit history, tool activity, and claims for a specific agent run.

---

### 3.2 Health & Status

#### `GET /api/health` and `GET /api/v1/health`
Returns system health, database connection state, API version, and environment.

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "environment": "development",
    "timestamp": "2026-08-22T10:00:00.000000",
    "database": {
      "status": "connected",
      "dialect": "sqlite"
    }
  },
  "message": "System operational"
}
```

---

### 3.3 Research Objectives & Execution

- `POST /api/research` - Create & execute research inquiry
- `GET /api/research/{id}` - Retrieve research details and findings
- `POST /api/research/{id}/execute` - Trigger ReAct agent execution
- `GET /api/research/{id}/trace` - Retrieve safe step-by-step execution trace
- `GET /api/research/{id}/graph` - Retrieve Evidence Graph

---

### 3.4 Strategic Insights

- `GET /api/insights` - List all synthesized WHAT → WHY → SO WHAT insights
- `GET /api/insights/{id}` - Get single insight by ID
- `GET /api/insights/feed` - Get dynamic intelligence feed
- `GET /api/insights/signals` - Get emerging weak signals
- `GET /api/insights/gaps` - Get research & white space gaps

---

### 3.5 Competitor Intelligence

- `GET /api/competitors` - List tracked competitors with telemetry
- `GET /api/competitors/{id}` - Get competitor details
- `GET /api/competitors/{id}/timeline` - Get chronological activity timeline
- `GET /api/competitors/matrix/comparison` - Get comparative capability matrix

---

### 3.6 Evidence & Contradictions

- `GET /api/evidence` - List all gathered evidence items
- `GET /api/evidence/{id}` - Get single evidence item
- `GET /api/evidence/graph` - Global interactive multi-type Evidence Graph
- `GET /api/evidence/contradictions` - Flagged cross-source contradictions

---

### 3.7 Human Verification Gate & Trust Ledger

- `GET /api/verification/queue` - Get items pending auditor sign-off
- `POST /api/verification/items/{id}/verify` - Submit auditor verification decision
  - Body: `{ "status": "VERIFIED" | "REJECTED" | "FLAGGED", "notes": "Auditor note" }`
- `GET /api/verification/ledger` - Audit log of all verified claims

---

### 3.8 Dashboard Overview

- `GET /api/dashboard` - Aggregated executive metrics, threat counts, signals, and top insights.
