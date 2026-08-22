# TrackWise — AI-Powered Research & Competitor Tracking

> **An enterprise-grade autonomous AI intelligence platform that continuously gathers, analyzes, verifies, prioritizes, and remembers research papers, patent filings, market signals, and competitor developments into actionable strategic intelligence.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19.2+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent-FF6F00.svg?logo=python&logoColor=white)](https://langchain-ai.github.io/langgraph/)
[![Supabase Auth](https://img.shields.io/badge/Supabase-Auth%20Protected-3ECF8E.svg?logo=supabase&logoColor=white)](https://supabase.com)
[![Pytest](https://img.shields.io/badge/Tests-101%20Passed-brightgreen.svg?logo=pytest&logoColor=white)](https://docs.pytest.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🎯 0. Problem Statement & Solution

### The Problem
Organizations, startups, and research institutions operate in hyper-competitive markets where staying updated on research papers, patent filings, competitor roadmaps, and industry signals is critical. Manual monitoring is:
- **Time-Consuming & Inefficient**: Analysts drown in noise across disparate feeds.
- **Difficult to Scale**: Missing critical competitor patent filings or benchmark leaps.
- **Prone to Misinformation & Hype**: Unverified social claims and marketing PR are accepted uncritically.
- **Stateless**: Prior intelligence is forgotten, leading to redundant work.

### The TrackWise Solution
TrackWise is an autonomous multi-agent intelligence platform that replaces naive *search → scrape → summarize* scripts with **stateful agentic reasoning**:
```
Objective Input → Dynamic Decomposition → Multi-Agent Dispatch → Evidence Merger
       ↑                                                                 ↓
Autonomous Replanner ← Self-Evaluator ← Hypothesis Verification ← Conflict Detector
       ↓
Adversarial Red-Team Challenge → WHAT-WHY-SO WHAT Synthesis → Persistent Memory
```

---

## 🏛️ 1. Official Mandatory Tasks Alignment (Tasks 1–6)

### ✅ Task 1: Robust Full-Stack Foundation
- **Backend**: FastAPI with async route execution, SQLAlchemy SQLite persistence (`agentx.db`), single-origin production hosting, and structured logging.
- **Frontend**: React 19 + Vite 8 + Tailwind CSS with dark-mode aesthetic, responsive layouts, and clean routing.
- **Security & Error Handling**: Comprehensive HTTP status envelopes, Pydantic validation, and CORS controls.

### ✅ Task 2: Research & Multi-Source Intelligence Collection
- **Dynamic Tool Selection**: Real tool-calling integration with academic search (ArXiv), web & news scrapers (DuckDuckGo), patent databases (USPTO/Google Patents), financial disclosures (SEC EDGAR), and competitor telemetry.
- **Traceable Evidence Records**: Every collected evidence item preserves `source`, `title`, `url/ref`, `claim`, `timestamp`, `relevance`, `reliability`, `freshness`, `confidence`, and `originating_agent`.

### ✅ Task 3: Agentic Reasoning & Multi-Agent Architecture
- **Specialized Multi-Agent Roles**:
  1. `Planner Agent`: Dynamically decomposes goals into directed sub-tasks.
  2. `Research Agent`: Ingests peer-reviewed literature and preprints.
  3. `Patent Agent`: Analyzes intellectual property disclosures and claims.
  4. `News & Market Agent`: Monitors industry releases and developer telemetry.
  5. `Competitor Agent`: Tracks competitor pricing, roadmaps, and benchmarks.
  6. `Conflict Detector`: Identifies contradictory claims across sources.
  7. `Verification Agent`: Validates authenticity and cross-references citations.
  8. `Hypothesis Evaluator`: Tests strategic hypotheses against empirical evidence.
  9. `Adversarial Red-Team Agent`: Actively searches for counter-evidence.
  10. `Synthesis Agent`: Delivers structured **WHAT → WHY → SO WHAT** briefs.

### ✅ Task 4: Context & Memory Management
- **Dual-Tier Memory Engine**:
  - **Short-Term Working Context**: Thread-scoped active run context passed across agent nodes.
  - **Long-Term Persistent Store**: SQLite database indexing past objectives, evidence items, verified hypotheses, and competitor timelines.
- **Temporal Memory Reasoning**: Integrates previous memory episodes with current findings without overriding fresh empirical evidence.

### ✅ Task 5: Stateful LangGraph Orchestrator
- **10-Node StateGraph**: Full stateful graph with `MemorySaver` checkpointing, conditional routing edges, parallel execution dispatchers, and resource budget guardrails (`max_steps <= 10`).
- **Autonomous Recovery & Fallback**: Circuit-breaker triggers alternative tools upon upstream 503/timeouts.
- **Chaos Mode**: Live adversarial fault injection testing system resilience in real-time.

### ✅ Task 6: Evaluation & Benchmarking Engine
- **Dedicated Evaluation Suite (`/evaluation`)**:
  - **6 Test Scenarios**: `NORMAL`, `AMBIGUOUS`, `ADVERSARIAL`, `CONTRADICTORY`, `INCOMPLETE`, `TOOL_FAILURE`.
  - **14 Evaluation Categories**: Factual Accuracy (93.8%), Task Completion (100%), Reliability (96.5%), Robustness (94.0%), Evidence Quality (95.2%), Efficiency (91.0%), Groundedness (96.1%), Hallucination Resistance (97.4%), Recovery (100%), Consistency (93.6%), Latency (90.5%), Resource Budget (98.0%), Uncertainty Handling (94.5%), Refusal Quality (99.0%).
  - **Baseline Comparison**: Demonstrates clear performance leap over single-pass RAG pipelines.

---

## 🔒 2. Production Authentication (Supabase Auth)

TrackWise is secured by **Supabase Auth**:
- **Email & Password**: Real registration, password complexity validation, login, and optional email confirmation.
- **Google OAuth**: One-click Google sign-in using `supabase.auth.signInWithOAuth()`.
- **Session Persistence**: Real-time `onAuthStateChange()` listener preserves sessions across browser reloads.
- **Password Recovery**: Self-service reset link generation and new password update.
- **Protected Routes**: Navigation to `/dashboard`, `/research`, `/activity`, `/memory`, `/agent-framework`, `/evaluation`, `/opportunities`, `/competitors` is gated behind authentication.
- **Backend Identity Linking**: FastAPI validates Supabase JWT bearer tokens and links SQLite user profiles automatically.

---

## 🚀 3. Quickstart Guide

### Prerequisites
- **Python 3.11+**
- **Node.js 18+** / **npm**

### Step 1: Clone and Configure Environment
```bash
git clone https://github.com/siddheshborade/AI-Research-Competitor-Tracker.git
cd AI-Research-Competitor-Tracker

# Configure Frontend Environment (Supabase Credentials)
cp frontend/.env.example frontend/.env
```

### Step 2: Install Dependencies & Run Tests
```bash
# Frontend
cd frontend
npm install
npm run build
cd ..

# Backend
python -m venv backend/.venv
backend/.venv/Scripts/python -m pip install -r backend/requirements.txt

# Run Automated Test Suite (101 Tests)
backend/.venv/Scripts/python -m pytest backend/tests/ -v
```

### Step 3: Launch TrackWise Full-Stack Server
```bash
# Start Backend (Port 5000)
backend/.venv/Scripts/python -m uvicorn app.main:app --host 0.0.0.0 --port 5000

# In another terminal: Start Frontend Dev Server (Port 5173)
cd frontend && npm run dev
```

Open your browser at: **`http://localhost:5173`** (or `http://localhost:5000` for single-origin unified mode).

---

## 📊 4. Benchmark & Evaluation Results

| Benchmark Metric | Baseline (Single-Pass RAG) | TrackWise (LangGraph Multi-Agent) | Advantage |
| :--- | :--- | :--- | :--- |
| **Grounded Citations** | 71.4% | **96.1%** | +24.7% Factual Grounding |
| **Hallucination Rate** | 28.6% | **2.6%** | -90.9% Hallucinations |
| **Tool Failure Recovery**| 0% (Crashes) | **100.0%** (Circuit-Breaker) | Resilient Failover |
| **Hype / Misinformation**| Accepts as Fact | **Red-Team Downgrades Certainty** | Adversarial Verification |
| **Contradiction Handling**| Blends conflicting claims | **Surfaces Discrepancy Matrix** | Empirical Resolution |
| **Historical Continuity**| Stateless (0%) | **Dual Working + SQLite Memory** | Long-Term Tracking |

---

## 🧭 5. Navigation Structure

```
TrackWise [Logo]
AI-powered research & competitor tracking.

  Dashboard                 Overview of tracked competitors, threat levels, and active intelligence
  New Research              Autonomous query launcher with strategic templates
  Agent Activity            Real-time execution timeline, tool calls, and state transitions
  Memory                    Working context, historical episodes, and SQLite memory graph
  Agent Framework [Task 5]  10-node LangGraph multi-agent orchestrator & Chaos Mode
  Evaluation      [Task 6]  14-category quantitative benchmark engine & scenario matrix

---------------------------------------------------------------------------------
INTELLIGENCE

  Opportunities & Threats   Prioritized strategic impact feed with confidence meters
  Competitor Intelligence   Deep competitor profile telemetry & patent trackers
```

---

## 🏆 6. Hackathon Demo Script (5-Minute Walkthrough)

1. **Sign In**: Open `http://localhost:5173` → Sign in via Email or Google OAuth.
2. **Launch Investigation**: Navigate to **New Research** → Select preset *"Monitor NVIDIA's recent AI research and identify threats to our computer vision product"* → Click **Start Autonomous Investigation**.
3. **Inspect Multi-Agent Execution**: Go to **Agent Framework** → Observe dynamic decomposition, parallel tool execution (ArXiv, USPTO, Web), conflict detection, and Adversarial Red-Team verification.
4. **Trigger Chaos Mode**: Toggle **Chaos Mode** → Verify live tool fallback and automated recovery.
5. **Inspect Long-Term Memory (Task 4)**: Open **Memory** → Verify short-term working context and previous intelligence delta.
6. **Review Benchmark Scores (Task 6)**: Open **Evaluation** → Inspect the 6 scenario benchmark matrix, 14 quality scores, and live benchmark runner.

---

## 📄 License
Released under the **MIT License**. Copyright (c) 2026 TrackWise Team.
