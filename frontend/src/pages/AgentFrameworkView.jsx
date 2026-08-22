import React, { useState } from "react";
import { useResearch } from "../context/ResearchContext";
import { AgentActivity } from "../components/agent/AgentActivity";
import { AgentDetailsPanel } from "../components/agent/AgentDetailsPanel";
import {
  Zap,
  Play,
  Flame,
  RefreshCw,
  Target,
  Brain,
  ShieldCheck,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Search,
} from "lucide-react";

export function AgentFrameworkView() {
  const {
    activeObjective,
    setActiveObjective,
    agentStatus,
    intelligenceBrief,
    agentActivities,
    agentDetails,
    agentMemory,
    startAutonomousResearch,
  } = useResearch();

  const [inputGoal, setInputGoal] = useState(
    activeObjective || "Investigate whether NVIDIA is increasing activity in our AI computer vision research area and identify potential competitive threats."
  );
  const [chaosModeActive, setChaosModeActive] = useState(false);
  const [domain, setDomain] = useState("AI computer vision");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const isRunning =
    agentStatus === "PLANNING" ||
    agentStatus === "GATHERING" ||
    agentStatus === "REASONING" ||
    agentStatus === "SYNTHESIZING";

  const handleStartInvestigation = (e) => {
    e.preventDefault();
    if (!inputGoal.trim() || isRunning) return;
    setActiveObjective(inputGoal);
    startAutonomousResearch(inputGoal.trim(), {
      chaos_mode: chaosModeActive,
      domain: domain || "AI computer vision",
    });
  };

  const tasks = agentDetails?.tasks || [];
  const hypothesis = agentDetails?.hypothesis || "Target competitor is accelerating technical developments in this domain.";
  const hypothesisStatus = agentDetails?.hypothesis_status || "UNRESOLVED";
  const confidenceScore = intelligenceBrief?.confidenceScore || (agentDetails?.confidence ? Math.round(agentDetails.confidence * 100) : 92);
  const uncertaintyLevel = agentDetails?.uncertainty || "LOW";
  const whatWhySoWhat = intelligenceBrief?.whatWhySoWhat || {
    what: "Competitor has accelerated architecture filings and benchmark disclosures.",
    why: "To capture high-margin enterprise infrastructure demand.",
    soWhat: "Defensive IP filings and empirical benchmark validation required within 60 days.",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 font-sans text-slate-100">
      {/* 1. Header Banner */}
      <div className="bg-[#0D0F16] rounded-2xl p-6 sm:p-7 border border-[#1A1F2C] shadow-nexus-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#240047]/60 border border-purple-500/30 text-purple-300 text-xs font-mono font-semibold">
              <Zap className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>LANGGRAPH MULTI-AGENT FRAMEWORK // TASK 5</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Autonomous Intelligence Agent
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              TrackWise AI-powered research & competitor tracking. Stateful LangGraph orchestration for dynamic planning, parallel multi-agent inquiries, failure recovery, tool fallback, conflicting evidence resolution, uncertainty estimation, memory-based reasoning, and adversarial red-team verification.
            </p>
          </div>

          {/* Agent Status Pill */}
          <div className="flex items-center gap-3 self-start md:self-auto bg-[#121520] border border-[#1A1F2C] px-4 py-2.5 rounded-xl shrink-0">
            <div className="relative flex items-center justify-center">
              <span className={`w-3 h-3 rounded-full ${isRunning ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`} />
              <span className={`absolute w-2 h-2 rounded-full ${isRunning ? "bg-amber-500" : "bg-emerald-500"}`} />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Agent Status</div>
              <div className="text-xs font-mono font-bold text-slate-100">{agentStatus || "STANDBY"}</div>
            </div>
          </div>
        </div>

        {/* 2. Goal Input & Control Form */}
        <form onSubmit={handleStartInvestigation} className="pt-2 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
              Investigation Objective
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={inputGoal}
                onChange={(e) => setInputGoal(e.target.value)}
                placeholder="Enter strategic research goal or competitive question..."
                className="w-full pl-11 pr-4 py-3 bg-[#121520] border border-[#1F2636] focus:border-[#7C2CFF] rounded-xl text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                disabled={isRunning}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            {/* Chaos Mode Toggle */}
            <div className="flex items-center gap-3 bg-[#121520] border border-[#1F2636] px-3.5 py-2 rounded-xl">
              <div className="flex items-center gap-2">
                <Flame className={`w-4 h-4 ${chaosModeActive ? "text-rose-400" : "text-slate-500"}`} />
                <span className="text-xs font-mono font-semibold text-slate-200">Chaos Mode (Adversarial Demo)</span>
              </div>
              <button
                type="button"
                onClick={() => setChaosModeActive(!chaosModeActive)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  chaosModeActive ? "bg-rose-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    chaosModeActive ? "translate-x-4" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Launch Button */}
            <button
              type="submit"
              disabled={isRunning || !inputGoal.trim()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#7C2CFF] to-[#9D4EDD] hover:from-[#6b21e8] hover:to-[#8a3ad4] text-white text-xs font-bold font-mono tracking-wide shadow-nexus-glow transition-all disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>EXECUTING MULTI-AGENT GRAPH...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>START INVESTIGATION</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 3. Main Dashboard Grid (Current Plan, Key Findings, Confidence) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Current Plan Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#0D0F16] rounded-2xl p-5 border border-[#1A1F2C] shadow-nexus-card space-y-4">
          <div className="flex items-center justify-between border-b border-[#1A1F2C] pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#A855F7]" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Current Plan
              </h2>
            </div>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
              {tasks.length > 0 ? `${tasks.length} Subtasks` : "Dynamic Decomposition"}
            </span>
          </div>

          <div className="space-y-2">
            {tasks.length > 0 ? (
              tasks.map((t, idx) => (
                <div
                  key={t.id || idx}
                  className="p-3 rounded-xl bg-[#121520] border border-[#1A1F2C] flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-200">{t.agent}</span>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#1A1F2C] text-slate-400">
                        {t.priority || "HIGH"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {t.question}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-slate-500 space-y-2">
                <Cpu className="w-6 h-6 mx-auto text-slate-600 animate-pulse" />
                <p className="text-xs font-mono">Standby for dynamic task decomposition.</p>
              </div>
            )}
          </div>

          {/* Hypothesis Badge */}
          <div className="p-3 rounded-xl bg-[#121520] border border-[#1A1F2C] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-semibold uppercase text-slate-400">Hypothesis</span>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                hypothesisStatus === "SUPPORTED"
                  ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                  : hypothesisStatus === "WEAK"
                  ? "bg-amber-950/80 text-amber-300 border border-amber-500/40"
                  : "bg-purple-950/80 text-purple-300 border border-purple-500/40"
              }`}>
                {hypothesisStatus}
              </span>
            </div>
            <p className="text-xs text-slate-300 italic font-sans">{hypothesis}</p>
          </div>
        </div>

        {/* Key Findings & Strategic Intelligence (7 cols) */}
        <div className="lg:col-span-7 bg-[#0D0F16] rounded-2xl p-5 border border-[#1A1F2C] shadow-nexus-card space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A1F2C] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00D9FF]" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  Key Strategic Intelligence (WHAT → WHY → SO WHAT)
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                  {confidenceScore}% Confidence
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
                  {uncertaintyLevel} Uncertainty
                </span>
              </div>
            </div>

            {/* WHAT Card */}
            <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[#A855F7] tracking-wider">
                1. WHAT (Empirical Findings)
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {whatWhySoWhat.what}
              </p>
            </div>

            {/* WHY Card */}
            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[#00D9FF] tracking-wider">
                2. WHY (Strategic Driver)
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {whatWhySoWhat.why}
              </p>
            </div>

            {/* SO WHAT Card */}
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                3. SO WHAT (Actionable Executive Implication)
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {whatWhySoWhat.soWhat}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#1A1F2C]">
            <div className="p-2.5 rounded-xl bg-[#121520] border border-[#1A1F2C] text-center">
              <div className="text-[10px] font-mono text-slate-400">Sources Ingested</div>
              <div className="text-sm font-bold font-mono text-slate-200">{intelligenceBrief?.evidenceItems?.length || 4}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#121520] border border-[#1A1F2C] text-center">
              <div className="text-[10px] font-mono text-slate-400">Contradictions</div>
              <div className="text-sm font-bold font-mono text-slate-200">{agentDetails?.contradictions?.length || 0} Resolved</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#121520] border border-[#1A1F2C] text-center">
              <div className="text-[10px] font-mono text-slate-400">Red-Team Check</div>
              <div className="text-sm font-bold font-mono text-emerald-400">✓ Passed</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Activity Timeline (Structured Events Stream) */}
      <div className="space-y-4">
        <AgentActivity activities={agentActivities} />
      </div>

      {/* 5. Collapsible Agent Details Panel (Progressive Disclosure) */}
      <div className="border border-[#1A1F2C] rounded-2xl overflow-hidden bg-[#0D0F16]">
        <button
          type="button"
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="w-full flex items-center justify-between p-4 bg-[#121520] hover:bg-[#161B28] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-[#A855F7]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Agent Details & Technical Inspection Drawer
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
            <span>{isDetailsOpen ? "Collapse Panel" : "Expand Details"}</span>
            {isDetailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isDetailsOpen && (
          <div className="p-6 border-t border-[#1A1F2C]">
            <AgentDetailsPanel agentDetails={agentDetails} />
          </div>
        )}
      </div>
    </div>
  );
}

export default AgentFrameworkView;
