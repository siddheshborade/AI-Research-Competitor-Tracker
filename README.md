# AGENTX24 — Autonomous Research & Competitor Intelligence Agent

> **An enterprise-grade autonomous AI intelligence agent that turns unstructured research papers, web disclosures, patent filings, and statutory regulatory records into verified, actionable WHAT → WHY → SO WHAT competitive intelligence.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19.2+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.2+-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Pytest](https://img.shields.io/badge/Tests-60%20Passed-brightgreen.svg?logo=pytest&logoColor=white)](https://docs.pytest.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌟 Executive Overview

In fast-moving technology markets, competitive advantages evaporate quickly. Traditional market monitoring relies on fragmented keyword alerts and manual reading of papers and PR statements.

**AGENTX24** solves this by operating as an autonomous intelligence officer:
1. **Autonomous Planning**: Decomposes high-level strategic objectives into multi-step investigative plans.
2. **Dynamic Tool Selection**: Evaluates evidence needs in real-time to select the optimal intelligence source (**Web Search API** vs. **Research/Paper API** vs. Patent/SEC tools) rather than blindly spamming all APIs.
3. **ReAct Reasoning Loop**: Iteratively Reasons, Acts, Observes, Analyzes, Decides, and Re-Plans (`MAX_AGENT_STEPS = 6`).
4. **Contradiction-Triggered Re-search**: Detects cross-source discrepancies (e.g. promotional press releases vs. peer-reviewed benchmarks) and automatically triggers verification re-searches.
5. **WHAT → WHY → SO WHAT Synthesis**: Condenses complex multi-modal technical findings into strategic executive summaries.
6. **Multi-Type Evidence Graph**: Visualizes connections between `Competitors`, `Technologies`, `Patents`, `Research Papers`, `Trends`, and `Threats/Opportunities`.
7. **Trust Layer & Human Verification Gate**: Employs multi-factor credibility scoring and requires human auditor sign-off on conflicting or low-confidence claims.

---

## 🏛️ System Architecture

```
project-root/
│
├── frontend/                     # React 19 + Vite 8 Intelligence UI
│   ├── public/                   # Static assets & SVG icons
│   ├── src/
│   │   ├── assets/               # Branding and visuals
│   │   ├── components/           # Modular UI Components
│   │   │   ├── agent/            # ReAct timeline, tool activity, step detail
│   │   │   ├── evidence/         # Evidence Graph canvas, source cards, drawers
│   │   │   ├── intelligence/     # WHAT-WHY-SO WHAT cards, feeds, summaries
│   │   │   ├── competitors/      # Competitor matrix & activity timeline
│   │   │   ├── modules/          # Contradiction hub, emerging signals, gaps
│   │   │   ├── verification/     # Trust panel, human verification queue
│   │   │   ├── layout/           # TopBar, Sidebar, MobileNav
│   │   │   └── common/           # Modal, Drawer, Toast, ConfidenceMeter
│   │   ├── pages/                # Workspace, Studio, Graph, Dashboard views
│   │   ├── context/              # ResearchContext state provider
│   │   ├── services/             # Centralized ApiService & Simulator
│   │   └── App.jsx               # Main application shell
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                      # Python 3.14 + FastAPI Intelligence Core
│   ├── app/
│   │   ├── api/                  # API Routers (/api and /api/v1)
│   │   ├── core/                 # Config, security, exceptions, logging
│   │   ├── engine/               # ReAct loop, planner, dynamic router, graph
│   │   │   └── tools/            # Web search, research papers, patents, SEC
│   │   ├── models/               # SQLAlchemy ORM models
│   │   ├── schemas/              # Pydantic v2 schemas & envelopes
│   │   ├── services/             # Business logic & repository services
│   │   └── db/                   # Database session & initialization
│   ├── tests/                    # 60 Pytest unit and integration tests
│   ├── requirements.txt
│   └── pytest.ini
│
├── docs/                         # Comprehensive Documentation
│   ├── architecture/             # System Architecture & Data Flow
│   ├── demo/                     # 5-Minute Hackathon Demo Script
│   └── testing/                  # Testing & QA Verification Guide
│
├── API_CONTRACT.md               # Definitive REST API Specification
├── README.md                     # Master Project Documentation
├── .env.example                  # Environment Configuration Template
└── .gitignore                    # Git Exclusion Rules
```

---

## ⚡ Quickstart Guide (Single-URL Production-Style Run)

### Prerequisites
- **Python 3.11+**
- **Node.js 18+** and **npm**

---

### Step 1: Build Frontend

```powershell
cd frontend
npm install
npm run build
```

---

### Step 2: Start Unified Full-Stack Application

```powershell
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### Step 3: Open Single URL in Browser

Open **`http://127.0.0.1:8000`** in your browser!
- **React Frontend**: `http://127.0.0.1:8000/`
- **SPA Client Routes**: `http://127.0.0.1:8000/workspace`, `http://127.0.0.1:8000/studio`, `http://127.0.0.1:8000/graph`
- **API Health**: `http://127.0.0.1:8000/api/health`
- **Swagger Docs**: `http://127.0.0.1:8000/docs`

---

## 🛠️ Development Mode (With Vite Proxy)

If you wish to run the Vite hot-reloading dev server during frontend development:
```powershell
# Terminal 1: Backend
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# Terminal 2: Frontend (Vite with automatic /api proxy)
cd frontend
npm run dev
```
Vite automatically proxies all `/api/*` requests from `localhost:5173` to `http://127.0.0.1:8000`, guaranteeing zero CORS errors and matching production behavior.

---

## 🎯 14 Core Capabilities Showcase

| # | Capability | Description |
|---|---|---|
| 1 | **Autonomous Planning** | Generates prioritized investigative hypotheses and stopping conditions. |
| 2 | **Dynamic Tool Selection** | Intelligently routes queries to `Web Search` vs. `Research/Paper` APIs. |
| 3 | **ReAct Agent Loop** | Sequential Reason → Act → Observe → Analyze cycle with step bounds. |
| 4 | **Multi-Source Intelligence** | Combines ArXiv, IEEE, trade journals, patents, and SEC 10-K disclosures. |
| 5 | **Sequential Tool Execution** | Strict schema validation with sandboxed error isolation. |
| 6 | **Evidence Sufficiency Check** | Computes quantitative sufficiency before halting tool calls. |
| 7 | **Contradiction-Triggered Re-search** | Discovers conflicting claims and executes targeted verification queries. |
| 8 | **WHAT → WHY → SO WHAT** | Strategic synthesis of facts, drivers, and defensive counter-strategies. |
| 9 | **Opportunity / Threat Intelligence** | Categorizes market signals by urgency, severity, and strategic impact. |
| 10 | **Source Verification** | Multi-factor weighting of peer review, regulatory mandate, and freshness. |
| 11 | **Confidence / Uncertainty** | Mathematical confidence index based on corroboration and divergence. |
| 12 | **Human Verification Gate** | Auditor sign-off workflow with cryptographic trust ledger logging. |
| 13 | **Evidence Graph** | Interactive node-link graph mapping competitors to patents and threats. |
| 14 | **Competitor Telemetry** | High-frequency telemetry tracking hiring spikes, pricing shifts, and patents. |

---

## 📡 API Contract Highlights

All API responses use a standard predictable envelope:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully."
}
```

### Primary Endpoints:
- `POST /api/agent/run` - Execute autonomous research ReAct loop
- `GET /api/agent/runs/{id}` - Audit trail and step details
- `GET /api/health` - Backend and database health
- `GET /api/insights` - WHAT → WHY → SO WHAT synthesized insights
- `GET /api/competitors` - Tracked competitors and telemetry
- `GET /api/evidence/graph` - Multi-type Evidence Graph
- `GET /api/evidence/contradictions` - Flagged cross-source contradictions
- `POST /api/verification/items/{id}/verify` - Human auditor verification decision

For complete details, see [API_CONTRACT.md](API_CONTRACT.md).

---

---

## 🤖 Task 5 — LangGraph Multi-Agent Autonomous Framework

### 1. Framework Justification: Why LangGraph?
AGENTX24 employs **LangGraph** (`langgraph>=1.2.11` + `langgraph-checkpoint>=4.2.0`) as the underlying execution orchestration engine:
1. **Stateful Graph Execution (`AgentGraphState`)**: All agents operate on a unified, typed shared memory state storing hypotheses, pending tasks, parallel execution histories, conflicting claims, fallbacks, and resource budgets.
2. **Dynamic Conditional Routing**: Conditional edges route execution dynamically based on real-time empirical findings (e.g. `route_after_conflict_check` dispatches to `Verification Agent`, `route_after_self_evaluation` triggers `Autonomous Replanner`).
3. **Cycles & Autonomous Replanning**: Enables iterative loops and gap-filling when evidence sufficiency is below threshold or uncertainty is high.
4. **Step Checkpointing & Time-Travel Recovery**: Integrated with LangGraph's `MemorySaver` checkpointer, persisting intermediate state across graph nodes (`POST_PLAN`, `POST_PARALLEL_EXECUTION`, `POST_VERIFICATION`, `POST_REPLAN`, `FINAL_SYNTHESIS`).
5. **Parallel Multi-Agent Dispatch**: Employs `ThreadPoolExecutor` within `parallel_dispatch_node` to query heterogeneous sources concurrently without blocking.

### 2. Multi-Agent System Roles

| Agent Name | Node in Graph | Primary Functionality |
| :--- | :--- | :--- |
| **Planner Agent** | `planner_node` | Formulates testable hypothesis and decomposes goal into prioritized multi-agent subtasks. |
| **Research Agent** | `parallel_dispatch_node` | Inquires scientific repositories, arXiv preprints, and academic algorithms. |
| **Patent Agent** | `parallel_dispatch_node` | Analyzes patent claims, assignee validity, priority dates, and IP disclosures. |
| **News Agent** | `parallel_dispatch_node` | Ingests market announcements, product releases, and trade press statements. |
| **Competitor Agent** | `parallel_dispatch_node` | Evaluates developer telemetry, hiring spikes, pricing shifts, and job postings. |
| **Evidence Merger** | `evidence_merger_node` | Deduplicates evidence points, calculates source credibility, and formulates verifiable claims. |
| **Conflict Detector** | `conflict_detector_node` | Identifies timeline and metric contradictions across opposing intelligence sources. |
| **Verification Agent** | `verification_agent_node` | Cross-corroborates disputed claims and adjusts confidence ratings. |
| **Hypothesis Evaluator**| `hypothesis_evaluator_node`| Tests hypothesis against empirical evidence (`SUPPORTED`, `WEAK`, `REJECTED`, `UNRESOLVED`). |
| **Self-Evaluator** | `self_evaluator_node` | Assesses completeness, calibrates explicit uncertainty (`LOW`, `MEDIUM`, `HIGH`), and monitors budget. |
| **Autonomous Replanner**| `replanner_node` | Dynamically creates targeted gap-fill subtasks to resolve missing evidence. |
| **Red-Team Agent** | `red_team_node` | Executes adversarial counter-factual stress tests to prevent confirmation bias. |
| **Synthesizer Agent** | `synthesis_node` | Synthesizes final **WHAT → WHY → SO WHAT** intelligence, computes temporal deltas against Task 4 memory, and builds the evidence graph. |

### 3. Failure Recovery, Tool Fallbacks & Loop Detection
- **Tool Fallback Mechanism**: If a primary data source fails (e.g. USPTO timeout), the system catches the error, logs the failure, switches to an alternate tool (`web_search`), and transparently recovers without crashing.
- **Resource Budget Enforcement**: Strict step and tool limits prevent runaway recursive execution.
- **Loop / Deadlock Detection**: Analyzes consecutive tool invocation sequences; detects repeated identical invocations and forces convergence.

### 4. Chaos Mode (Adversarial Live Testing)
Triggerable directly via the **Chaos Mode** button in the UI or `POST /api/agent/run {"chaos_mode": true}`:
- Injects simulated tool connection timeout on `Patent Agent` → triggers dynamic fallback to `WebSearchTool`.
- Injects conflicting timeline claims → triggers `Conflict Detector` and `Verification Agent` corroboration.
- Simulates evidence insufficiency → triggers `Autonomous Replanner` to create new subtasks.
- Runs `Red-Team Agent` counter-inquiry checks before final **WHAT → WHY → SO WHAT** synthesis.

---

## 🧪 Testing & Verification

Run the comprehensive 98-test pytest suite:

```powershell
backend/.venv/Scripts/python -m pytest backend/tests/ -v
```

Run only the 20 Task 5 LangGraph agent framework tests:

```powershell
backend/.venv/Scripts/python -m pytest backend/tests/test_task5_verification.py -v
```

Build the production frontend bundle:

```powershell
npm run build
```

---

## 📚 Documentation Directory

- [System Architecture Specification](docs/architecture/ARCHITECTURE.md)
- [Hackathon Demo Script & Presentation Guide](docs/demo/DEMO_SCRIPT.md)
- [Testing & Quality Assurance Guide](docs/testing/TEST_GUIDE.md)
- [API Contract Specification](API_CONTRACT.md)

---

## 👥 Authors & Team

Developed for **AGENTX24** — Autonomous AI Agents Hackathon.
Licensed under the [MIT License](LICENSE).
