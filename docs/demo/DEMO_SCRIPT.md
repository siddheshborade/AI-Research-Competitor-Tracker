# AGENTX24 Hackathon Demo Script & Presentation Guide

This guide walks through a 3-5 minute live demonstration highlighting the 14 core capabilities of **AGENTX24**.

---

## Pre-Demo Setup

1. **Start the Backend**:
   ```powershell
   cd backend
   .\.venv\Scripts\uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

2. **Start the Frontend**:
   ```powershell
   cd frontend
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser.

---

## 5-Minute Demo Flow

### 1. Landing View & Preset Inquiries (0:00 - 0:45)
- **Action**: Highlight the landing page with predefined strategic research prompts:
  - *NVIDIA Vision & On-Device Architecture*
  - *AI Agent Frameworks & Multi-Tool Autonomy*
  - *Solid-State Battery Chemistry & Silicon Anodes*
  - *Post-Quantum Cryptography & Lattice Hardware*
- **Talking Point**: "AGENTX24 is an autonomous competitor and research intelligence agent that monitors competitors, queries academic literature, and analyzes statutory filings to uncover threats and white space."

### 2. Live ReAct Agent Execution & Dynamic Tool Selection (0:45 - 1:45)
- **Action**: Click one of the presets (e.g. *NVIDIA Vision*) or enter a custom prompt and click **"Initiate Autonomous Investigation"**.
- **Observation**:
  - Watch the **Agent Activity Timeline** step through **Planning → Tool Selection → Execution → Observation → Analysis → Synthesis**.
  - Show that the agent **dynamically decides** which tool to use:
    - Step 1: `Academic Research / Research Papers API` for benchmark and preprint analysis.
    - Step 2: `Web Search API` for commercial announcements.
    - Point out: *"Notice the agent does NOT call both APIs blindly every time; it reasons sequentially based on missing evidence."*

### 3. Contradiction Detection & Re-Search (1:45 - 2:30)
- **Action**: Switch to the **Contradictions Hub** (`/contradictions`).
- **Observation**:
  - Show the side-by-side claim conflict (e.g. *Marketing claim of 60 FPS on-device vs. Peer-reviewed benchmark of 18 FPS*).
  - Highlight the `CONTRADICTION_VERIFIED_AND_RESOLVED` status showing how the agent automatically detected the conflict and ran a targeted re-search verification step.

### 4. WHAT → WHY → SO WHAT Synthesis (2:30 - 3:15)
- **Action**: Navigate to the **Intelligence Dashboard** (`/dashboard`) and **Research Workspace** (`/workspace`).
- **Observation**:
  - Show the executive breakdown:
    - **WHAT**: Competitor filed accelerated architecture patent and launched commercial pilot.
    - **WHY**: Bypasses DRAM memory wall using low-rank shared attention heads.
    - **SO WHAT**: Directly threatens our Q3 edge vision latency superiority; defensive patent filing required within 60 days.

### 5. Multi-Type Evidence Graph & White Space Gaps (3:15 - 4:00)
- **Action**: Navigate to **Evidence Graph** (`/graph`) and **Research Gaps** (`/gaps`).
- **Observation**:
  - Filter graph nodes by `Competitor`, `Patent`, `Technology`, `Research Paper`, `Threat`, and `Opportunity`.
  - Click on a node to view the detail drawer showing citations, confidence scores, and source URLs.
  - Show the **Research Gaps** view highlighting uncontested IP white space.

### 6. Human Verification Gate & Trust Ledger (4:00 - 4:45)
- **Action**: Navigate to **Human Verification** (`/verification`).
- **Observation**:
  - Review items in the `Pending Auditor Verification Queue`.
  - Click **"Verify & Sign"** with an auditor note.
  - Show the real-time toast and signed cryptographic trust ledger.

### 7. Dual-Mode Toggle & Wrap-up (4:45 - 5:00)
- **Action**: Toggle the **Mode Switch** in the TopBar between **Live API Mode** and **High-Fidelity Demo Mode**.
- **Closing Point**: "AGENTX24 delivers verifiable, multi-source, actionable intelligence with zero hallucination and complete auditability."
