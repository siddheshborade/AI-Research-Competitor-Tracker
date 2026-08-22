# AGENTX24 Competitor Intelligence API Contract

Version: `3.0.0`  
Protocol: `HTTP / REST`  
Content-Type: `application/json`  
Base URL Prefix: `/api`

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

#### `POST /api/agent/run`
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
        "url": "https://medtechwire.com/news/omnihealth-expansion",
        "credibility_weight": 0.88
      }
    ],
    "evidence": [
      {
        "source_id": "src_paper_1",
        "source_type": "paper",
        "title": "Cross-Attention Multi-Modal Fusion for Real-Time Autonomous Clinical Diagnostics",
        "publisher": "arXiv.org",
        "url": "https://arxiv.org/abs/2607.08912",
        "published_at": "2026-07-28T08:00:00Z",
        "snippet": "Lightweight transformer architecture achieving 99.1% sensitivity and 45% latency reduction...",
        "content_summary": "Peer-reviewed preprint detailing architecture benchmarks...",
        "relevance": 0.96,
        "credibility": 0.95,
        "extracted_facts": {
          "method": "Cross-Attention Multi-Modal Fusion",
          "sensitivity": "99.1%",
          "latency_reduction": "45%"
        }
      }
    ],
    "claims": [
      {
        "id": "clm_7718aa92",
        "claim_text": "arXiv.org reports: Lightweight transformer architecture achieving 99.1% sensitivity...",
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
        "duration_ms": 115,
        "result_count": 2
      },
      {
        "step": 2,
        "tool_name": "web_search",
        "status": "completed",
        "purpose": "Search current web news and press releases for OmniHealth Labs commercial rollout",
        "trigger": "sequential_research",
        "duration_ms": 140,
        "result_count": 2
      },
      {
        "step": 3,
        "tool_name": "web_search",
        "status": "re_search",
        "purpose": "Verify conflicting statements regarding OmniHealth Labs clearance timeline",
        "trigger": "contradiction_detected",
        "duration_ms": 125,
        "result_count": 1
      }
    ],
    "trust": {
      "evidence_count": 5,
      "verification_status": "SUPPORTED",
      "confidence_score": 0.92,
      "confidence_category": "VERY_HIGH",
      "contradiction_status": "CONTRADICTION_VERIFIED_AND_RESOLVED",
      "re_search_triggered": true,
      "requires_human_verification": false,
      "supporting_sources": [
        {
          "title": "Cross-Attention Multi-Modal Fusion...",
          "publisher": "arXiv.org",
          "url": "https://arxiv.org/abs/2607.08912",
          "type": "paper",
          "relevance": 0.96
        }
      ]
    },
    "graph": {
      "nodes": [
        { "id": "node_comp_omnihealth_labs", "type": "Competitor", "label": "OmniHealth Labs", "metadata": {} },
        { "id": "node_res_1", "type": "Research", "label": "Cross-Attention Multi-Modal...", "metadata": {} },
        { "id": "node_ins_1", "type": "Threat", "label": "Regulatory Discrepancy...", "metadata": {} }
      ],
      "edges": [
        { "id": "edge_comp_ins_threat", "source": "node_comp_omnihealth_labs", "target": "node_ins_1", "relationship": "CREATES_THREAT", "confidence": 0.92 }
      ]
    }
  },
  "message": "Autonomous research agent completed intelligence gathering successfully."
}
```

#### `GET /api/agent/runs/{run_id}`
Retrieves audit records, tool call durations, and verified claims for a specific past agent run.

---

### 3.2 Research Objectives API

#### `POST /api/research`
Creates a research objective and launches the intelligence pipeline.

#### `GET /api/research/{id}`
Fetches objective status, metrics, and associated intelligence items.

#### `GET /api/research/{id}/trace`
Retrieves step-by-step safe reasoning metadata for demo/judging transparency.

#### `GET /api/research/{id}/graph`
Retrieves the Multi-Type Evidence Graph.

---

### 3.3 Dashboard Summary API

#### `GET /api/dashboard/summary`
Returns aggregate platform intelligence metrics, pending review items, top opportunities, and top threats.

**Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_objectives": 4,
      "active_runs": 0,
      "completed_runs": 4,
      "total_competitors_tracked": 3,
      "total_evidence_nodes": 12,
      "evidence_graph_edges": 16,
      "total_insights": 8,
      "pending_verifications_count": 2
    },
    "breakdown": {
      "opportunities": 4,
      "threats": 4,
      "weak_signals": 3,
      "contradictions": 2,
      "emerging_trends": 3,
      "gaps": 2
    },
    "recent_insights": [ ... ],
    "top_threats": [ ... ],
    "top_opportunities": [ ... ],
    "pending_verification_insights": [ ... ],
    "tracked_competitors": [ ... ],
    "meta": {
      "engine": "AGENTX24 ReAct Intelligence Core",
      "framework": "WHAT -> WHY -> SO WHAT",
      "trust_layer": "Multi-Source Verification & Human Gate",
      "environment": "development",
      "demo_mode": false
    }
  }
}
```

---

### 3.4 Strategic Insights API
- `GET /api/insights` — Query insights with optional filtering (`category`, `competitor_id`, `status`).
- `GET /api/insights/{id}` — Full **WHAT → WHY → SO WHAT** breakdown with linked evidence provenance.

---

### 3.5 Human Verification Gate
- `POST /api/verification` — Submit human analyst verification decision (`verified`, `rejected`, `flag_for_review`).
- `GET /api/verification/{id}` — Retrieve verification audit record.
