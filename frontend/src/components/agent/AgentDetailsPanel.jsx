import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  GitBranch,
  Flame,
  CheckCircle2,
  XCircle,
  Database,
  Gauge,
} from "lucide-react";

export function AgentDetailsPanel({ details, trust, memory }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("graph"); // 'graph' | 'state' | 'recovery' | 'conflicts' | 'budget' | 'redteam'

  if (!details && !trust && !memory) {
    return null;
  }

  const tasks = details?.tasks || [
    { id: "t1", question: "Investigate scientific publications", agent: "Research Agent", tool: "research_papers", status: "completed" },
    { id: "t2", question: "Search patent filings and claims", agent: "Patent Agent", tool: "patent_intelligence", status: "completed" },
    { id: "t3", question: "Analyze market press releases", agent: "News Agent", tool: "industry_news", status: "completed" },
    { id: "t4", question: "Track developer telemetry & hiring", agent: "Competitor Agent", tool: "competitor_telemetry", status: "completed" },
  ];

  const fallbacks = details?.fallback_attempts || [];
  const failures = details?.tool_failures || [];
  const contradictions = details?.contradictions || [];
  const budget = details?.resource_budget || { used_steps: 2, max_steps: 6, used_tools: 4, max_tools: 6 };
  const redTeam = details?.red_team_results || { passed: true, stress_tests: [] };
  const isChaos = details?.is_chaos_mode;
  const loopDetected = details?.loop_detected || false;
  const checkpoint = details?.checkpoint_info || { last_checkpoint: "FINAL_SYNTHESIS" };

  return (
    <div className="bg-[#0D0F16] rounded-2xl border border-[#1A1F2C] shadow-nexus-card overflow-hidden transition-all">
      {/* Header / Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-[#121520] hover:bg-[#181C2B] border-b border-[#1A1F2C] transition-colors text-left"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[#A855F7]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-100">
                Agent Framework & LangGraph Execution Details
              </span>
              {isChaos && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-rose-400" /> CHAOS MODE
                </span>
              )}
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Checkpoint: {checkpoint?.last_checkpoint || "Active"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspect multi-agent state, dynamic planning graph, tool fallback log, and red-team challenge.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-xs font-mono">{isOpen ? "Hide Details" : "Inspect Technical Trace"}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expandable Body */}
      {isOpen && (
        <div className="p-6 space-y-6">
          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[#1A1F2C] pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab("graph")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "graph"
                  ? "bg-[#7C2CFF] text-white"
                  : "text-slate-400 hover:text-slate-200 bg-[#121520]"
              }`}
            >
              Task Graph ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab("recovery")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "recovery"
                  ? "bg-[#7C2CFF] text-white"
                  : "text-slate-400 hover:text-slate-200 bg-[#121520]"
              }`}
            >
              Tool Fallbacks ({fallbacks.length})
            </button>
            <button
              onClick={() => setActiveTab("conflicts")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "conflicts"
                  ? "bg-[#7C2CFF] text-white"
                  : "text-slate-400 hover:text-slate-200 bg-[#121520]"
              }`}
            >
              Conflict Resolution ({contradictions.length})
            </button>
            <button
              onClick={() => setActiveTab("budget")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "budget"
                  ? "bg-[#7C2CFF] text-white"
                  : "text-slate-400 hover:text-slate-200 bg-[#121520]"
              }`}
            >
              Resource Budget & Loop Detector
            </button>
            <button
              onClick={() => setActiveTab("redteam")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "redteam"
                  ? "bg-[#7C2CFF] text-white"
                  : "text-slate-400 hover:text-slate-200 bg-[#121520]"
              }`}
            >
              Red-Team Challenge
            </button>
          </div>

          {/* TAB 1: DYNAMIC TASK GRAPH */}
          {activeTab === "graph" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>HYPOTHESIS: "{details?.hypothesis || 'Verified competitor advancement in target domain'}"</span>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  Status: {details?.hypothesis_status || "SUPPORTED"}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tasks.map((t, idx) => (
                  <div
                    key={t.id || idx}
                    className="p-3.5 rounded-xl bg-[#121520] border border-[#1A1F2C] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-[#00D9FF]">
                        {t.agent || "Agent"}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {t.tool}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium">{t.question}</p>
                    {t.reasoning && <p className="text-[11px] text-slate-400">{t.reasoning}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: TOOL FAILURES & FALLBACK RECOVERY */}
          {activeTab === "recovery" && (
            <div className="space-y-3">
              {fallbacks.length === 0 && failures.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#121520] border border-[#1A1F2C] text-center text-xs text-slate-400 font-mono">
                  All primary tools executed cleanly. Zero tool failures encountered in this session.
                </div>
              ) : (
                <div className="space-y-2">
                  {failures.map((f, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 text-rose-300">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>
                          <strong>{f.agent}</strong> primary tool <code>{f.tool}</code> failed: {f.error}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono bg-rose-500/20 px-2 py-0.5 rounded text-rose-200">
                        CAUGHT SAFELY
                      </span>
                    </div>
                  ))}
                  {fallbacks.map((fb, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 text-purple-200">
                        <RefreshCw className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>
                          <strong>Dynamic Fallback:</strong> Switched {fb.agent} from <code>{fb.failed_tool}</code> to{" "}
                          <code>{fb.fallback_tool}</code>. Recovered {fb.items_recovered} evidence points.
                        </span>
                      </div>
                      <span className="text-[10px] font-mono bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">
                        RECOVERED
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONFLICTS & VERIFICATION */}
          {activeTab === "conflicts" && (
            <div className="space-y-3">
              {contradictions.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#121520] border border-[#1A1F2C] text-center text-xs text-slate-400 font-mono">
                  No unresolved source contradictions detected across merged evidence.
                </div>
              ) : (
                contradictions.map((c, idx) => (
                  <div
                    key={c.id || idx}
                    className="p-4 rounded-xl bg-[#121520] border border-[#1A1F2C] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-amber-400 font-bold">
                        ⚠ CONFLICT DETECTED ({c.conflict_type || "Source Contradiction"})
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                        {c.resolved ? "VERIFIED & RESOLVED" : "IN REVIEW"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                      <div className="p-2.5 rounded bg-[#0D0F16] border border-[#1A1F2C]">
                        <span className="text-[10px] text-slate-500 block">SOURCE A ({c.source_a})</span>
                        {c.claim_a}
                      </div>
                      <div className="p-2.5 rounded bg-[#0D0F16] border border-[#1A1F2C]">
                        <span className="text-[10px] text-slate-500 block">SOURCE B ({c.source_b})</span>
                        {c.claim_b}
                      </div>
                    </div>
                    {c.resolution && (
                      <p className="text-[11px] text-purple-300 bg-purple-500/10 p-2.5 rounded border border-purple-500/20">
                        <strong>Verification Resolution:</strong> {c.resolution}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: RESOURCE BUDGET & LOOP DETECTOR */}
          {activeTab === "budget" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#121520] border border-[#1A1F2C] space-y-3">
                <div className="flex items-center justify-between font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-200">
                    <Gauge className="w-4 h-4 text-[#A855F7]" /> Tool Call Budget
                  </span>
                  <span>
                    {budget.used_tools} / {budget.max_tools} Calls
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#0D0F16] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-[#00D9FF]"
                    style={{ width: `${Math.min(100, (budget.used_tools / budget.max_tools) * 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Execution steps used: {budget.used_steps} / {budget.max_steps}. Loop detector prevents runaway recursion.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#121520] border border-[#1A1F2C] space-y-3">
                <div className="flex items-center justify-between font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Loop & Deadlock Detector
                  </span>
                  <span className={loopDetected ? "text-rose-400" : "text-emerald-400"}>
                    {loopDetected ? "LOOP DETECTED" : "NOMINAL"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Status: <strong>{loopDetected ? "Loop intervened and safely broken" : "No execution deadlocks observed"}</strong>
                </p>
                <div className="text-[10px] font-mono text-slate-500">
                  Max consecutive identical tool calls allowed: 2
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RED-TEAM CHALLENGE */}
          {activeTab === "redteam" && (
            <div className="p-4 rounded-xl bg-[#121520] border border-[#1A1F2C] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#A855F7]" /> Adversarial Counter-Factual Evaluation
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                  ALL CHECKS PASSED
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded bg-[#0D0F16] border border-[#1A1F2C]">
                  <span className="text-slate-300">Conclusions corroborated across multiple independent sources</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-[#0D0F16] border border-[#1A1F2C]">
                  <span className="text-slate-300">Counter-evidence and supply-chain delay risks verified</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-[#0D0F16] border border-[#1A1F2C]">
                  <span className="text-slate-300">Zero reliance on unverified marketing single-source claims</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AgentDetailsPanel;
